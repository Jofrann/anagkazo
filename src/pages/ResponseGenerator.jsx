import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquareText, Loader2, Sparkles } from "lucide-react";
import { CONTEXTS, LEVELS } from "@/lib/levelsData";
import ReactMarkdown from "react-markdown";

export default function ResponseGenerator() {
  const [form, setForm] = useState({
    phrase: "",
    context: "",
    level: "",
    goal: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const levelName = form.level ? LEVELS.find(l => l.id === Number(form.level))?.name : "Non précisé";

    const prompt = `Tu es ANAGKAZO, un stratège IA en évangélisation. Génère des réponses adaptées.

Phrase entendue : "${form.phrase}"
Contexte : ${form.context || "Non précisé"}
Niveau de conscience estimé : ${form.level ? `Niveau ${form.level} - ${levelName}` : "Non précisé"}
Objectif de la conversation : ${form.goal || "Non précisé"}

Réponds en français avec cette structure EXACTE :

## 🟢 Réponse douce
(Une réponse empathique et non confrontante)

**Pourquoi ça marche :** (explication)
**Ce que ça cible :** (besoin intérieur visé)
**Risque :** (possible inconvénient)
**Quand l'utiliser :** (contexte idéal)

---

## 🟡 Réponse stratégique
(Une réponse calculée qui amène la personne à réfléchir)

**Pourquoi ça marche :** (explication)
**Ce que ça cible :** (besoin intérieur visé)
**Risque :** (possible inconvénient)
**Quand l'utiliser :** (contexte idéal)

---

## 🔵 Réponse profonde
(Une réponse qui va au cœur du sujet avec une dimension spirituelle authentique)

**Pourquoi ça marche :** (explication)
**Ce que ça cible :** (besoin intérieur visé)
**Risque :** (possible inconvénient)
**Quand l'utiliser :** (contexte idéal)

---

## 🟠 Réponse confrontante (si approprié)
(Une réponse plus directe, à utiliser uniquement si la relation le permet)

**Pourquoi ça marche :** (explication)
**Ce que ça cible :** (besoin intérieur visé)
**Risque :** (possible inconvénient)
**Quand l'utiliser :** (contexte idéal)

---

## 📌 Analyse globale
(Quelle réponse recommandes-tu en priorité et pourquoi)`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setResult(res);

    await base44.entities.GeneratedAnalysis.create({
      context_type: "response_generator",
      input_text: form.phrase,
      probable_level: form.level ? Number(form.level) : undefined,
      ai_output: res,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquareText className="w-6 h-6 text-primary" />
          Générateur de réponses
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Génère des réponses stratégiques adaptées au niveau de conscience et au contexte.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Phrase entendue</Label>
            <Textarea
              value={form.phrase}
              onChange={(e) => setForm({ ...form, phrase: e.target.value })}
              placeholder="Ex: 'Je n'ai pas besoin de Dieu, ma vie va très bien comme ça'"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Contexte</Label>
              <Select value={form.context} onValueChange={(v) => setForm({ ...form, context: v })}>
                <SelectTrigger><SelectValue placeholder="Contexte" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CONTEXTS).map(([k, v]) => (
                    <SelectItem key={k} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Niveau estimé</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>Niv. {l.id} — {l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Objectif</Label>
              <Input
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                placeholder="Ex: Éveiller la curiosité"
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading || form.phrase.trim().length < 5} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {loading ? "Génération..." : "Générer les réponses"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Réponses générées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 className="text-base font-bold text-primary mt-6 mb-2 first:mt-0">{children}</h2>,
                  p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-2">{children}</p>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  hr: () => <div className="border-t border-border my-5" />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}