import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Layers, Eye, Ear, MessageSquare, Handshake, ArrowUpRight, ChevronRight } from "lucide-react";
import { LEVELS } from "@/lib/levelsData";

const modules = [
  {
    title: "Introduction à l'évangélisation stratégique",
    description: "Comprends pourquoi l'approche classique ne suffit pas et découvre le modèle des 5 niveaux de conscience.",
    icon: BookOpen,
    category: "fundamentals",
    lessons: 4,
  },
  {
    title: "Les 5 niveaux de conscience",
    description: "Maîtrise chaque niveau en profondeur : état intérieur, comportements, phrases typiques, stratégies.",
    icon: Layers,
    category: "levels",
    lessons: 5,
    link: "/levels",
  },
  {
    title: "Lire une personne",
    description: "Apprends à observer les signaux verbaux et non-verbaux pour détecter le niveau de conscience.",
    icon: Eye,
    category: "skills",
    lessons: 6,
  },
  {
    title: "Savoir écouter",
    description: "L'écoute active est la clé. Apprends à entendre ce que la personne dit vraiment.",
    icon: Ear,
    category: "skills",
    lessons: 4,
  },
  {
    title: "Adapter son discours",
    description: "Apprends à changer ton langage, ton ton et ta stratégie selon le niveau détecté.",
    icon: MessageSquare,
    category: "skills",
    lessons: 5,
  },
  {
    title: "Créer la confiance",
    description: "La confiance est le pont entre toi et l'autre. Apprends à la construire authentiquement.",
    icon: Handshake,
    category: "advanced",
    lessons: 4,
  },
  {
    title: "Conduire vers l'étape suivante",
    description: "Comment amener une personne du niveau actuel au niveau suivant sans forcer.",
    icon: ArrowUpRight,
    category: "advanced",
    lessons: 5,
  },
];

const categoryLabels = { fundamentals: "Fondamentaux", levels: "Niveaux", skills: "Compétences", advanced: "Avancé" };
const categoryColors = { fundamentals: "bg-primary/15 text-primary", levels: "bg-blue-500/15 text-blue-400", skills: "bg-emerald-500/15 text-emerald-400", advanced: "bg-purple-500/15 text-purple-400" };

export default function TrainingCenter() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          Centre de formation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Parcours structuré pour devenir un évangéliste stratégique, empathique et efficace.
        </p>
      </div>

      {/* Quick Level Access */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Accès rapide aux niveaux</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LEVELS.map((level) => (
            <Link key={level.id} to="/levels">
              <Card className={`hover:border-primary/30 transition-all cursor-pointer border ${level.borderColor}`}>
                <CardContent className="p-3 text-center">
                  <div className={`text-lg font-bold ${level.textColor}`}>{level.id}</div>
                  <div className="text-xs font-medium">{level.name}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Modules de formation</h2>
        <div className="space-y-3">
          {modules.map((mod, idx) => {
            const Wrapper = mod.link ? Link : "div";
            const wrapperProps = mod.link ? { to: mod.link } : {};
            return (
              <Wrapper key={idx} {...wrapperProps}>
                <Card className="hover:border-primary/20 transition-all cursor-pointer group">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <mod.icon className="w-5 h-5 text-primary/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm">{mod.title}</h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${categoryColors[mod.category]}`}>{categoryLabels[mod.category]}</Badge>
                        <span className="text-xs text-muted-foreground">{mod.lessons} leçons</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}