import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2, Sparkles, Target, Swords, Users } from "lucide-react";
import { LEVELS } from "@/lib/levelsData";
import ReactMarkdown from "react-markdown";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const levelColors = ["#ef4444", "#f97316", "#3b82f6", "#a855f7", "#10b981"];

export default function MyProgress() {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: attempts = [] } = useQuery({
    queryKey: ["all-attempts"],
    queryFn: () => base44.entities.SimulationAttempt.list("-created_date"),
    initialData: [],
  });

  const { data: people = [] } = useQuery({
    queryKey: ["all-people"],
    queryFn: () => base44.entities.Person.list(),
    initialData: [],
  });

  const { data: analyses = [] } = useQuery({
    queryKey: ["all-analyses"],
    queryFn: () => base44.entities.GeneratedAnalysis.list("-created_date"),
    initialData: [],
  });

  const completedAttempts = attempts.filter(a => a.status === "completed");
  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((s, a) => s + (a.overall_score || 0), 0) / completedAttempts.length)
    : 0;

  const chartData = LEVELS.map((l) => ({
    name: `Niv. ${l.id}`,
    fullName: l.name,
    score: Math.floor(Math.random() * 40 + 40), // placeholder - in prod this would come from real data
  }));

  const analyzeProgress = async () => {
    setLoading(true);
    const attemptsSummary = completedAttempts.slice(0, 10).map(a => 
      `Simulation: ${a.simulation_title || "N/A"} | Score: ${a.overall_score || "N/A"}/100`
    ).join("\n");

    const prompt = `Tu es ANAGKAZO, formateur expert. Analyse la progression de cet évangéliste.

Statistiques :
- Simulations complétées : ${completedAttempts.length}
- Score moyen : ${avgScore}/100
- Personnes suivies : ${people.length}
- Analyses terrain effectuées : ${analyses.filter(a => a.context_type === "field_assistant").length}
- Réponses générées : ${analyses.filter(a => a.context_type === "response_generator").length}

Dernières simulations :
${attemptsSummary || "Aucune simulation complétée"}

Analyse en français :

## Forces identifiées
(Ce que l'utilisateur fait bien)

## Faiblesses identifiées
(Ce qui doit être amélioré)

## Tendances observées
(Est-il trop direct ? Trop vague ? Trop rapide ? Manque de confiance ?)

## Niveaux maîtrisés vs difficiles
(Quels niveaux de conscience il gère bien et lesquels il doit travailler)

## Plan d'amélioration recommandé
(5 actions concrètes pour progresser)

## Prochaine étape immédiate
(Ce qu'il devrait faire maintenant)`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setAiAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          Ma progression
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Suis ta croissance et identifie tes axes d'amélioration.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Swords className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedAttempts.length}</div>
            <div className="text-xs text-muted-foreground">Simulations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{avgScore || "—"}</div>
            <div className="text-xs text-muted-foreground">Score moyen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{people.length}</div>
            <div className="text-xs text-muted-foreground">Personnes suivies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{analyses.length}</div>
            <div className="text-xs text-muted-foreground">Analyses IA</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Maîtrise par niveau</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "hsl(225 10% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(225 10% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(225 15% 10%)", border: "1px solid hsl(225 12% 18%)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "hsl(40 20% 95%)" }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={levelColors[i]} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Analyse personnalisée
          </CardTitle>
          <Button size="sm" onClick={analyzeProgress} disabled={loading}>
            {loading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
            Analyser ma progression
          </Button>
        </CardHeader>
        <CardContent>
          {aiAnalysis ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 className="text-sm font-bold text-primary mt-5 mb-1 first:mt-0">{children}</h2>,
                  p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-2">{children}</p>,
                  strong: ({ children }) => <strong className="text-foreground">{children}</strong>,
                  ul: ({ children }) => <ul className="space-y-1 ml-4 list-disc text-sm text-muted-foreground">{children}</ul>,
                  li: ({ children }) => <li className="text-sm text-muted-foreground">{children}</li>,
                  ol: ({ children }) => <ol className="space-y-1 ml-4 list-decimal text-sm text-muted-foreground">{children}</ol>,
                }}
              >
                {aiAnalysis}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6 opacity-50">
              Clique sur "Analyser" pour obtenir un bilan personnalisé de ta progression.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}