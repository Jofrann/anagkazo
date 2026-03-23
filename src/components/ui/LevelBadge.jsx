import React from "react";
import { getLevelBadge } from "@/lib/levelsData";
import { cn } from "@/lib/utils";

export default function LevelBadge({ level, size = "sm" }) {
  const data = getLevelBadge(level);
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium",
      data.bgBadge,
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      Niv. {data.id} — {data.name}
    </span>
  );
}