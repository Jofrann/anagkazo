import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import LevelBadge from "@/components/ui/LevelBadge";

const OBJECTIONS_DATA = [
  { title: "Je n'ai pas besoin de Dieu", category: "existence", level: 1, text: "Ma vie va bien sans Dieu. Je n'ai besoin de personne.", hidden: "Peur de la dépendance, désir de contrôle." },
  { title: "J'ai été blessé par l'église", category: "church", level: 2, text: "L'église m'a fait du mal. Les chrétiens sont hypocrites.", hidden: "Blessure profonde, besoin de guérison et de confiance." },
  { title: "Je préfère vivre ma vie", category: "freedom", level: 1, text: "Je veux profiter de la vie, pas me limiter.", hidden: "Peur de perdre sa liberté, confusion entre foi et restriction." },
  { title: "Je crois en moi, pas en Dieu", category: "existence", level: 1, text: "Je compte sur moi-même, pas sur un être invisible.", hidden: "Orgueil protecteur, mais fragilité cachée." },
  { title: "Je ne suis pas prêt", category: "personal", level: 4, text: "Peut-être un jour, mais pas maintenant.", hidden: "Peur de l'engagement, besoin d'être rassuré." },
  { title: "La religion c'est l'hypocrisie", category: "hypocrisy", level: 2, text: "Les religieux disent une chose et font le contraire.", hidden: "Recherche d'authenticité, déception passée." },
  { title: "La science explique tout", category: "science", level: 1, text: "On n'a pas besoin de Dieu, la science suffit.", hidden: "Rationalisation, peur de croire sans preuve." },
  { title: "Si Dieu existait, il n'y aurait pas de souffrance", category: "suffering", level: 2, text: "Un Dieu bon ne permettrait pas tout ça.", hidden: "Souffrance personnelle non résolue, question sincère." },
];

export default function ObjectionLibrary() {
  const [expandedId, setExpandedId] = useState(null);
  const [aiResponses, setAiResponses] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const getAiResponse = async (objection, idx) => {
    setLoadingId(idx);
    const prompt = `Tu es ANAGKAZO, stratège en évangélisation. Analyse cette objection en profondeur.

Objection : "${objection.text}"
Signification cachée : ${objection.hidden}
Niveau typique : ${objection.level}

Réponds en français avec cette structure :

## Lecture stratégique
(Ce que cette objection révèle vraiment)

## Réponse douce
(Approche empathique et non confrontante — développée)

## Réponse stratégique
(Approche qui fait réfléchir — développée)

## Réponse profonde
(Approche qui touche le cœur — développée)

## Erreurs à éviter
(Ce qu'il ne faut surtout pas faire)

## Objectif après cette objection
(Ce que tu dois viser comme prochaine étape)`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setAiResponses(prev => ({ ...prev, [idx]: result }));
    setLoadingId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-primary" />
          Bibliothèque des objections
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Les objections les plus courantes et comment y répondre stratégiquement.
        </p>
      </div>

      <div className="space-y-3">
        {OBJECTIONS_DATA.map((obj, idx) => (
          <Card key={idx} className={expandedId === idx ? "border-primary/30" : ""}>
            <CardContent className="p-0">
              <button
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{obj.title}</h3>
                    <p className="text-xs text-muted-foreground italic mt-0.5">"{obj.text}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LevelBadge level={obj.level} />
                  {expandedId === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expandedId === idx && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Signification cachée</p>
                    <p className="text-sm">{obj.hidden}</p>
                  </div>

                  {aiResponses[idx] ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h2: ({ children }) => <h2 className="text-sm font-bold text-primary mt-4 mb-1 first:mt-0">{children}</h2>,
                          p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-2">{children}</p>,
                          strong: ({ children }) => <strong className="text-foreground">{children}</strong>,
                        }}
                      >
                        {aiResponses[idx]}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getAiResponse(obj, idx)}
                      disabled={loadingId === idx}
                    >
                      {loadingId === idx ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
                      Générer les réponses stratégiques
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}