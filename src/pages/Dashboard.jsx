import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Compass, Swords, MessageSquareText, Users, TrendingUp, 
  BookOpen, Layers, ArrowRight, Flame, Target, Zap
} from "lucide-react";
import LevelBadge from "@/components/ui/LevelBadge";
import { LEVELS } from "@/lib/levelsData";

const quickActions = [
  { label: "Assistant terrain", description: "Analyser une situation réelle", icon: Compass, path: "/field-assistant", color: "from-blue-500/20 to-blue-600/10" },
  { label: "Simulation", description: "S'entraîner avec l'IA", icon: Swords, path: "/simulation", color: "from-purple-500/20 to-purple-600/10" },
  { label: "Générateur", description: "Créer une réponse adaptée", icon: MessageSquareText, path: "/response-generator", color: "from-emerald-500/20 to-emerald-600/10" },
  { label: "Formation", description: "Apprendre les fondamentaux", icon: BookOpen, path: "/training", color: "from-primary/20 to-primary/10" },
];

export default function Dashboard() {
  const { data: people = [] } = useQuery({
    queryKey: ["people"],
    queryFn: () => base44.entities.Person.list("-updated_date", 5),
    initialData: [],
  });

  const { data: attempts = [] } = useQuery({
    queryKey: ["attempts-recent"],
    queryFn: () => base44.entities.SimulationAttempt.list("-created_date", 5),
    initialData: [],
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-card to-card border border-border p-8">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">ANAGKAZO</h1>
          </div>
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
            Plateforme de formation stratégique à l'évangélisation. Apprends à discerner, 
            comprendre et accompagner chaque personne selon son niveau de conscience.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Card className="group hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="w-5 h-5 text-foreground/80" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Personnes suivies</span>
              </div>
              <span className="font-bold text-lg">{people.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Simulations</span>
              </div>
              <span className="font-bold text-lg">{attempts.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Score moyen</span>
              </div>
              <span className="font-bold text-lg">
                {attempts.length > 0 
                  ? Math.round(attempts.reduce((s, a) => s + (a.overall_score || 0), 0) / attempts.length) 
                  : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent People */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Personnes récentes
            </CardTitle>
            <Link to="/people">
              <Button variant="ghost" size="sm" className="text-xs">Voir tout <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {people.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Aucune personne suivie pour l'instant.
              </div>
            ) : (
              <div className="space-y-3">
                {people.map((person) => (
                  <Link key={person.id} to={`/people/${person.id}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {person.nickname?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{person.nickname}</p>
                          <p className="text-xs text-muted-foreground">{person.meeting_context || "Pas de contexte"}</p>
                        </div>
                      </div>
                      {person.estimated_level && <LevelBadge level={person.estimated_level} />}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5 Levels Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Les 5 niveaux de conscience</h2>
          <Link to="/levels">
            <Button variant="ghost" size="sm" className="text-xs">Explorer <ArrowRight className="w-3 h-3 ml-1" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {LEVELS.map((level) => (
            <Link key={level.id} to="/levels">
              <Card className={`group hover:border-primary/30 transition-all duration-300 cursor-pointer border ${level.borderColor}`}>
                <CardContent className="p-4">
                  <div className={`text-2xl font-bold mb-1 ${level.textColor}`}>{level.id}</div>
                  <h3 className="font-semibold text-sm mb-1">{level.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{level.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}