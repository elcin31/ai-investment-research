#!/usr/bin/env python3
"""
Статическая проверка консистентности импортов для Next.js/TS проекта.

Это суррогат `next build` в среде без доступа к npm registry. Ловит:
  1. `@/...` импорты, которые не резолвятся ни в один файл на диске
     (в т.ч. несовпадение регистра — критично для Vercel/Linux, но
     может быть незаметно локально).
  2. Именованные импорты (`import { X } from '@/...'`), где X не
     экспортируется найденным целевым файлом.
  3. Файлы в src/, на которые нигде не ссылаются (не ошибка сборки,
     но сигнал "осиротевшего" файла после рефакторинга).

НЕ заменяет настоящий `next build`: не проверяет типы, JSX-синтаксис,
совместимость версий пакетов и т.д. Цель — отловить именно тот класс
ошибок, который уронил предыдущую версию проекта (module not found
из-за рассинхрона импортов и файлов после переименования/рефакторинга).
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
EXTS = [".ts", ".tsx"]

IMPORT_RE = re.compile(
    r"""import\s+(?:type\s+)?(?:
        (?P<default_and_named>\w+\s*,\s*\{[^}]*\})|
        (?P<named>\{[^}]*\})|
        (?P<default>\w+)|
        (?P<star>\*\s+as\s+\w+)
    )\s+from\s+['"](?P<path>@/[^'"]+)['"]""",
    re.VERBOSE,
)

EXPORT_NAMED_RE = re.compile(
    r"export\s+(?:async\s+)?(?:const|function|class|interface|type|enum)\s+(\w+)"
)
EXPORT_LIST_RE = re.compile(r"export\s*\{([^}]+)\}")
EXPORT_DEFAULT_RE = re.compile(r"export\s+default\s+")


def resolve_alias(import_path: str) -> Path | None:
    """@/foo/bar -> src/foo/bar, trying real extensions and index files."""
    rel = import_path[2:]  # strip "@/"
    base = SRC / rel

    candidates = [base.with_suffix(ext) for ext in EXTS]
    candidates += [base / f"index{ext}" for ext in EXTS]
    if base.suffix in EXTS:
        candidates.append(base)

    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def resolve_alias_case_insensitive(import_path: str) -> Path | None:
    """Find a case-insensitive match, to distinguish 'truly missing' from
    'exists but wrong case' (the latter passes on macOS/Windows dev
    machines but fails on Vercel's case-sensitive Linux build)."""
    rel = import_path[2:]
    parts = rel.split("/")
    current = SRC

    for i, part in enumerate(parts):
        if not current.exists():
            return None
        is_last = i == len(parts) - 1
        match = None
        try:
            entries = list(current.iterdir())
        except (FileNotFoundError, NotADirectoryError):
            return None

        if is_last:
            stem_candidates = {part, *[part + ext for ext in EXTS]}
            for entry in entries:
                if entry.name.lower() in {c.lower() for c in stem_candidates}:
                    match = entry
                    break
            if match is None:
                # try index files inside a dir matching `part`
                for entry in entries:
                    if entry.is_dir() and entry.name.lower() == part.lower():
                        for ext in EXTS:
                            idx = entry / f"index{ext}"
                            if idx.exists():
                                return idx
        else:
            for entry in entries:
                if entry.is_dir() and entry.name.lower() == part.lower():
                    match = entry
                    break

        if match is None:
            return None
        current = match

    return current if current.is_file() else None


def get_exported_names(file_path: Path) -> set[str]:
    text = file_path.read_text(encoding="utf-8", errors="replace")
    names = set(EXPORT_NAMED_RE.findall(text))
    for group in EXPORT_LIST_RE.findall(text):
        for item in group.split(","):
            item = item.strip()
            if not item:
                continue
            # handle "Foo as Bar" -> exported name is Bar
            if " as " in item:
                item = item.split(" as ")[-1].strip()
            names.add(item)
    if EXPORT_DEFAULT_RE.search(text):
        names.add("__default__")
    return names


def parse_named_imports(named_block: str) -> list[str]:
    names = []
    for item in named_block.strip("{}").split(","):
        item = item.strip()
        if not item:
            continue
        if " as " in item:
            item = item.split(" as ")[0].strip()
        names.append(item)
    return names


def main() -> int:
    if not SRC.exists():
        print(f"ERROR: {SRC} does not exist", file=sys.stderr)
        return 1

    all_files = [p for ext in EXTS for p in SRC.rglob(f"*{ext}")]
    referenced: set[Path] = set()
    errors: list[str] = []
    warnings: list[str] = []

    for file_path in all_files:
        text = file_path.read_text(encoding="utf-8", errors="replace")
        rel_file = file_path.relative_to(ROOT)

        for m in IMPORT_RE.finditer(text):
            import_path = m.group("path")
            resolved = resolve_alias(import_path)

            if resolved is None:
                ci_match = resolve_alias_case_insensitive(import_path)
                if ci_match is not None:
                    errors.append(
                        f"[CASE MISMATCH] {rel_file}: import '{import_path}' "
                        f"resolves only case-insensitively -> {ci_match.relative_to(ROOT)}. "
                        f"Will fail on Vercel's case-sensitive filesystem."
                    )
                    resolved = ci_match
                else:
                    errors.append(
                        f"[MISSING] {rel_file}: import '{import_path}' does not "
                        f"resolve to any file under src/"
                    )
                    continue

            referenced.add(resolved.resolve())

            named_group = m.group("named") or (
                m.group("default_and_named").split(",", 1)[1]
                if m.group("default_and_named")
                else None
            )
            if named_group:
                imported_names = parse_named_imports(named_group)
                exported_names = get_exported_names(resolved)
                for name in imported_names:
                    if name == "type" or name.startswith("type "):
                        continue
                    if name not in exported_names:
                        errors.append(
                            f"[NO EXPORT] {rel_file}: imports '{name}' from "
                            f"'{import_path}' -> {resolved.relative_to(ROOT)}, "
                            f"but that file does not export '{name}'. "
                            f"Available: {sorted(exported_names) or 'none'}"
                        )

    # Orphan check (warning only, skip Next.js special files)
    special_names = {
        "page", "layout", "loading", "error", "not-found", "route",
        "template", "default", "global-error", "middleware",
    }
    for file_path in all_files:
        if file_path.stem in special_names or file_path.name.startswith("icon"):
            continue
        if file_path.resolve() not in referenced:
            warnings.append(f"[ORPHAN] {file_path.relative_to(ROOT)} is not imported anywhere")

    print(f"Checked {len(all_files)} files under src/\n")

    if errors:
        print(f"❌ {len(errors)} ERROR(S):\n")
        for e in errors:
            print(f"  {e}")
        print()
    else:
        print("✅ No import errors found.\n")

    if warnings:
        print(f"⚠️  {len(warnings)} warning(s):\n")
        for w in warnings:
            print(f"  {w}")
        print()

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
