import { Wallet, Calculator, ShieldAlert, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  icon: typeof Wallet;
  active: boolean;
}

const navItems: NavItem[] = [
  { label: "Портфель", icon: Wallet, active: true },
  { label: "DCF", icon: Calculator, active: false },
  { label: "Риск", icon: ShieldAlert, active: false },
  { label: "Сценарии", icon: GitBranch, active: false },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      aria-label="Основная навигация"
    >
      <div className="flex items-stretch justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={!item.active}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 min-h-[56px] justify-center transition-colors",
              item.active
                ? "text-primary"
                : "text-textSecondary/50 cursor-not-allowed"
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={2} />
            <span className="text-[11px] leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
