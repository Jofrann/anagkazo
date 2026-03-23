import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Compass, Loader2, Send } from "lucide-react";
import { CONTEXTS } from "@/lib/levelsData";
import ReactMarkdown from "react-markdown";

export default function FieldAssistant() {
  const [form, setForm] = useState({
    context: "",
    whatTheySaid: "",
    attitude: "",
    relationship: "",
    goal: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    const prompt = `Tu es ANAGKAZO, un stratège IA en évangélisation. Analyse cette situation terrain en profondeur.

Contexte de la rencontre : ${form.context}
Ce que la personne a dit : "${form.whatTheySaid}"
Son attitude / ce qu'elle dégage : ${form.attitude}
Lien avec l'évangéliste : ${form.relationship}
Objectif de l'échange : ${form.goal}

Réponds en français avec cette structure EXACTE :

## 1. Niveau probable
(1 à 5 avec le nom du niveau)

## 2. Pourquoi ce niveau
(Explication détaillée)

## 3. Lecture intérieure de la personne
(Ce qu'elle vit en profondeur, ses peurs, ses mécanismes de défense)

## 4. Ce qu'elle montre / ce qu'elle cache
(Décalage entre l'apparent et le réel)

## 5. Objectif principal de l'échange
(Ce que l'évangéliste doit viser dans cette conversation)

## 6. Posture recommandée
(Ton, attitude, énergie à adopter)

## 7. Ce que tu peux dire (développé)
(Une réponse complète, naturelle, adaptée au niveau — pas une phrase générique mais un vrai discours)

## 8. Ce que tu dois éviter
(Erreurs spécifiques à cette situation)

## 9. Signes de progression à observer
(Ce qui montrerait que la personne avance)

## 10. Étape suivante recommandée
(Action concrète après cette conversation)`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setAnalysis(result);

    await base44.entities.GeneratedAnalysis.create({
      context_type: "field_assistant",
      input_text: `${form.context} | ${form.whatTheySaid}`,
      ai_output: result,
    });
    setLoading(false);
  };

  const isValid = form.whatTheySaid.trim().length > 10;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Compass className="w-6 h-6 text-primary" />
          Assistant terrain
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Décris une situation réelle et reçois une analyse stratégique approfondie.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Décris la situation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Contexte de la rencontre</Label>
              <Select value={form.context} onValueChange={(v) => setForm({ ...form, context: v })}>
                <SelectTrigger><SelectValue placeholder="Où / comment ?" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTEXTS).map(([k, v]) => (
                    <SelectItem key={k} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Lien avec la personne</Label>
              <Select value={form.relationship} onValueChange={(v) => setForm({ ...form, relationship: v })}>
                <SelectTrigger><SelectValue placeholder="Quel rapport ?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inconnu">Inconnu(e)</SelectItem>
                  <SelectItem value="connaissance">Connaissance</SelectItem>
                  <SelectItem value="ami">Ami(e)</SelectItem>
                  <SelectItem value="collegue">Collègue</SelectItem>
                  <SelectItem value="famille">Famille</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Ce que la personne a dit (le plus fidèlement possible)</Label>
            <Textarea 
              value={form.whatTheySaid}
              onChange={(e) => setForm({ ...form, whatTheySaid: e.target.value })}
              placeholder="Ex: 'Moi je crois en moi, j'ai pas besoin de quelqu'un d'autre pour me dire quoi faire...'"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Son attitude / ce qu'elle dégage</Label>
            <Textarea 
              value={form.attitude}
              onChange={(e) => setForm({ ...form, attitude: e.target.value })}
              placeholder="Ex: Fermée, bras croisés, mais elle a quand même écouté..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Ton objectif dans cet échange</Label>
            <Textarea 
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              placeholder="Ex: Créer un premier lien, éveiller une curiosité..."
              className="min-h-[60px]"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={loading || !isValid} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {loading ? "Analyse en cours..." : "Analyser la situation"}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {analysis && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              Analyse stratégique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 className="text-base font-bold text-primary mt-6 mb-2 first:mt-0">{children}</h2>,
                  p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  ul: ({ children }) => <ul className="space-y-1 ml-4 list-disc text-sm text-muted-foreground">{children}</ul>,
                  li: ({ children }) => <li className="text-sm text-muted-foreground">{children}</li>,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}