import type { AssetClass } from "@/types/portfolio";

export const assetClassLabels: Record<AssetClass, string> = {
  equity: "Акции",
  bond: "Облигации",
  cash: "Кэш",
  alternative: "Альтернативы",
  crypto: "Крипто",
};

export const assetClassColors: Record<AssetClass, string> = {
  equity: "#3DDC97",
  bond: "#5B9DF5",
  cash: "#8B98A9",
  alternative: "#F5A524",
  crypto: "#C084FC",
};
