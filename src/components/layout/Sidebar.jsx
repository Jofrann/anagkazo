import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, BookOpen, Layers, Swords, Compass, MessageSquareText, 
  ShieldAlert, Users, TrendingUp, Menu, X, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { path: "/training", label: "Centre de formation", icon: BookOpen },
  { path: "/levels", label: "Bibliothèque des niveaux", icon: Layers },
  { path: "/simulation", label: "Simulation", icon: Swords },
  { path: "/field-assistant", label: "Assistant terrain", icon: Compass },
  { path: "/response-generator", label: "Générateur de réponses", icon: MessageSquareText },
  { path: "/objections", label: "Objections", icon: ShieldAlert },
  { path: "/people", label: "Suivi des personnes", icon: Users },
  { path: "/progress", label: "Ma progression", icon: TrendingUp },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              ANAGKAZO
            </span>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs font-medium text-primary">Évangélisation stratégique</p>
            <p className="text-xs text-muted-foreground mt-0.5">Former • Discerner • Agir</p>
          </div>
        </div>
      </aside>
    </>
  );
}