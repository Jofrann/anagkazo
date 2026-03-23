import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Swords, Loader2, Send, User, Bot, RotateCcw, CheckCircle2 } from "lucide-react";
import { PROFILE_TYPES, CONTEXTS, LEVELS } from "@/lib/levelsData";
import ReactMarkdown from "react-markdown";

export default function SimulationCenter() {
  const [phase, setPhase] = useState("setup"); // setup | conversation | feedback
  const [config, setConfig] = useState({ profile: "", context: "", difficulty: "intermediate" });
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const startSimulation = async () => {
    setLoading(true);
    const profile = PROFILE_TYPES[config.profile];
    const prompt = `Tu es ANAGKAZO en mode simulation. Tu vas jouer le rôle d'une personne avec ce profil :
Profil : ${profile?.label} — ${profile?.description}
Contexte : ${config.context || "Rencontre informelle"}
Difficulté : ${config.difficulty}

Tu dois répondre COMME cette personne, pas comme un assistant. Sois réaliste, naturel, avec les résistances et réactions typiques de ce profil.
Commence la conversation en disant quelque chose de typique pour ce profil. Une ou deux phrases maximum, naturelles.
Réponds UNIQUEMENT avec le dialogue de la personne, sans indication scénique ni explication.`;

    const aiResponse = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages([{ role: "ai", content: aiResponse }]);
    setPhase("conversation");
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    const profile = PROFILE_TYPES[config.profile];
    const history = newMessages.map(m => `${m.role === "user" ? "Évangéliste" : "Personne"}: ${m.content}`).join("\n");

    const prompt = `Tu es en mode simulation d'évangélisation. Tu joues le rôle d'une personne avec ce profil :
Profil : ${profile?.label} — ${profile?.description}
Contexte : ${config.context || "Rencontre informelle"}
Difficulté : ${config.difficulty}

Historique de la conversation :
${history}

Continue à jouer le rôle de cette personne. Réagis de façon réaliste à ce que l'évangéliste vient de dire. 
Sois naturel, avec les résistances ou ouvertures appropriées au profil.
Réponds UNIQUEMENT avec le dialogue de la personne (1-3 phrases).`;

    const aiResponse = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages([...newMessages, { role: "ai", content: aiResponse }]);
    setLoading(false);
  };

  const requestFeedback = async () => {
    setLoading(true);
    const profile = PROFILE_TYPES[config.profile];
    const history = messages.map(m => `${m.role === "user" ? "Évangéliste" : "Personne"}: ${m.content}`).join("\n");

    const prompt = `Tu es ANAGKAZO, formateur expert en évangélisation stratégique. Évalue cette simulation.

Profil joué : ${profile?.label}
Contexte : ${config.context}

Conversation :
${history}

Évalue en français avec cette structure :

## 1. Niveau que tu aurais dû détecter
(Quel niveau de conscience cette personne simulait)

## 2. Ce que tu as bien fait
(Points forts de l'approche de l'évangéliste)

## 3. Ce que tu as raté
(Opportunités manquées, erreurs commises)

## 4. Ce que la personne a probablement ressenti
(Impact émotionnel de chaque réponse)

## 5. Pourquoi tes réponses ont aidé ou bloqué
(Analyse stratégique)

## 6. Réponse améliorée
(Comment tu aurais dû répondre à des moments clés)

## 7. Ce que tu dois travailler
(Axes d'amélioration prioritaires)

## Scores
- Discernement : X/100
- Empathie : X/100
- Stratégie : X/100
- Clarté : X/100
- Score global : X/100`;

    const aiResponse = await base44.integrations.Core.InvokeLLM({ prompt });
    setFeedback(aiResponse);

    // Extract scores (rough parsing)
    const scoreMatch = aiResponse.match(/Score global\s*:\s*(\d+)/);
    const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 50;

    await base44.entities.SimulationAttempt.create({
      simulation_id: `${config.profile}_${Date.now()}`,
      simulation_title: `${profile?.label} — ${config.context}`,
      conversation_history: messages,
      ai_feedback: aiResponse,
      overall_score: overallScore,
      status: "completed",
    });

    setPhase("feedback");
    setLoading(false);
  };

  const reset = () => {
    setPhase("setup");
    setMessages([]);
    setFeedback(null);
    setConfig({ profile: "", context: "", difficulty: "intermediate" });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Swords className="w-6 h-6 text-primary" />
          Centre de simulation
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Entraîne-toi avec l'IA dans des mises en situation réalistes.
        </p>
      </div>

      {/* Setup Phase */}
      {phase === "setup" && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Configure ta simulation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Profil de la personne</Label>
                <Select value={config.profile} onValueChange={(v) => setConfig({ ...config, profile: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir un profil" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROFILE_TYPES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Contexte</Label>
                <Select value={config.context} onValueChange={(v) => setConfig({ ...config, context: v })}>
                  <SelectTrigger><SelectValue placeholder="Contexte" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTEXTS).map(([k, v]) => (
                      <SelectItem key={k} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Difficulté</Label>
                <Select value={config.difficulty} onValueChange={(v) => setConfig({ ...config, difficulty: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={startSimulation} disabled={!config.profile || loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Swords className="w-4 h-4 mr-2" />}
              {loading ? "Préparation..." : "Lancer la simulation"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Conversation Phase */}
      {phase === "conversation" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{PROFILE_TYPES[config.profile]?.label}</Badge>
              Simulation en cours
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={requestFeedback} disabled={loading || messages.length < 3}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Terminer et évaluer
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ta réponse..."
                className="min-h-[44px] max-h-32"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              <Button onClick={sendMessage} disabled={loading || !userInput.trim()} size="icon" className="shrink-0 h-11 w-11">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Phase */}
      {phase === "feedback" && feedback && (
        <>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Évaluation de ta simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => <h2 className="text-base font-bold text-primary mt-6 mb-2 first:mt-0">{children}</h2>,
                    p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                    ul: ({ children }) => <ul className="space-y-1 ml-4 list-disc text-sm text-muted-foreground">{children}</ul>,
                    li: ({ children }) => <li className="text-sm text-muted-foreground">{children}</li>,
                  }}
                >
                  {feedback}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button onClick={reset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" /> Nouvelle simulation
            </Button>
          </div>
        </>
      )}
    </div>
  );
}