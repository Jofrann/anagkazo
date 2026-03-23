import React, { useState } from "react";
import { LEVELS } from "@/lib/levelsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, CheckCircle2, MessageCircle, Eye, 
  Target, XCircle, ArrowUpRight, Lightbulb
} from "lucide-react";

export default function LevelLibrary() {
  const [activeLevel, setActiveLevel] = useState(1);
  const level = LEVELS.find(l => l.id === activeLevel);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Bibliothèque des niveaux</h1>
        <p className="text-muted-foreground text-sm mt-1">Comprends en profondeur chaque niveau de conscience pour mieux discerner et agir.</p>
      </div>

      {/* Level Tabs */}
      <Tabs value={String(activeLevel)} onValueChange={(v) => setActiveLevel(Number(v))}>
        <TabsList className="bg-muted/50 h-auto flex-wrap gap-1 p-1">
          {LEVELS.map((l) => (
            <TabsTrigger 
              key={l.id} 
              value={String(l.id)}
              className="data-[state=active]:bg-card text-xs sm:text-sm px-3 py-2"
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${l.textColor} bg-current`} />
              {l.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {level && (
        <div className="space-y-5">
          {/* Header Card */}
          <Card className={`border ${level.borderColor} overflow-hidden`}>
            <div className={`h-1 bg-gradient-to-r ${level.color}`} />
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`text-4xl font-black ${level.textColor}`}>{level.id}</div>
                <div>
                  <h2 className="text-xl font-bold">{level.name} <span className="text-muted-foreground font-normal text-sm">({level.nameEn})</span></h2>
                  <p className="text-muted-foreground mt-1">{level.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Internal State */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  État intérieur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{level.internalState}</p>
              </CardContent>
            </Card>

            {/* Hidden Need */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Besoin caché
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{level.hiddenNeed}</p>
              </CardContent>
            </Card>

            {/* Behaviors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Comportements typiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {level.behaviors.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Common Phrases */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Phrases fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {level.commonPhrases.map((p, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-muted/50 text-sm italic text-muted-foreground">
                      "{p}"
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategy */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stratégie recommandée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{level.strategy}</p>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-medium text-emerald-400 mb-1">Exemple de ce que tu peux dire :</p>
                  <p className="text-sm text-foreground/90 italic">"{level.whatToSay}"</p>
                </div>
              </CardContent>
            </Card>

            {/* Mistakes */}
            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  Erreurs à éviter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs font-medium text-destructive mb-1">Ne dis surtout pas :</p>
                  <p className="text-sm text-foreground/90 italic">"{level.whatNotToSay}"</p>
                </div>
                <ul className="space-y-2">
                  {level.mistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive/70 mt-0.5 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Signs of Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-primary" />
                Signes de progression vers le niveau suivant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{level.signsOfProgress}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}