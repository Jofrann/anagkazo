import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, User, Plus, Loader2, Sparkles, MessageCircle, Calendar } from "lucide-react";
import LevelBadge from "@/components/ui/LevelBadge";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const trustLabels = { cold: "Froid", warming: "En réchauffement", open: "Ouvert", trusting: "Confiant", committed: "Engagé" };
const invitationLabels = { not_invited: "Pas encore invité", invited: "Invité", accepted: "Accepté", declined: "Décliné" };
const integrationLabels = { not_started: "Pas commencé", visiting: "En visite", regular: "Régulier", integrated: "Intégré", discipling: "En discipolat" };

export default function PersonDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const personId = window.location.pathname.split("/").pop();
  const queryClient = useQueryClient();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [interactionOpen, setInteractionOpen] = useState(false);
  const [interactionForm, setInteractionForm] = useState({ summary: "", phrases_heard: "", reaction_observed: "" });

  const { data: person, isLoading } = useQuery({
    queryKey: ["person", personId],
    queryFn: async () => {
      const list = await base44.entities.Person.filter({ id: personId });
      return list[0];
    },
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ["interactions", personId],
    queryFn: () => base44.entities.PersonInteraction.filter({ person_id: personId }, "-created_date"),
    initialData: [],
    enabled: !!personId,
  });

  const addInteractionMutation = useMutation({
    mutationFn: (data) => base44.entities.PersonInteraction.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["interactions", personId] }); setInteractionOpen(false); setInteractionForm({ summary: "", phrases_heard: "", reaction_observed: "" }); },
  });

  const getAiAdvice = async () => {
    if (!person) return;
    setAiLoading(true);
    const interactionsText = interactions.map(i => `- ${i.summary} | Réaction: ${i.reaction_observed || "Non notée"}`).join("\n");

    const prompt = `Tu es ANAGKAZO, stratège en évangélisation. Analyse cette personne et recommande la prochaine étape.

Nom : ${person.nickname}
Niveau estimé : ${person.estimated_level || "Non évalué"}
Confiance : ${person.trust_status || "Inconnue"}
État émotionnel : ${person.emotional_state || "Non renseigné"}
Description : ${person.description || "Aucune"}
Phrases clés : ${person.key_phrases || "Aucune"}
Contexte de rencontre : ${person.meeting_context || "Non précisé"}

Historique des interactions :
${interactionsText || "Aucune interaction enregistrée"}

Donne en français :
## Analyse du niveau actuel
## Lecture intérieure
## Progression observée
## Prochaine étape recommandée
## Ce que tu pourrais dire lors de la prochaine rencontre
## Erreurs à éviter avec cette personne`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setAiAdvice(result);
    setAiLoading(false);
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!person) return <div className="text-center py-12 text-muted-foreground">Personne non trouvée</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/people" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux personnes
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
          {person.nickname?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{person.nickname}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {person.estimated_level && <LevelBadge level={person.estimated_level} />}
            {person.trust_status && <span className="text-xs text-muted-foreground">{trustLabels[person.trust_status]}</span>}
            {person.meeting_context && <span className="text-xs text-muted-foreground">• {person.meeting_context}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Info */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Informations</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {person.approximate_age && <div className="flex justify-between"><span className="text-muted-foreground">Âge approximatif</span><span>{person.approximate_age} ans</span></div>}
            {person.gender && <div className="flex justify-between"><span className="text-muted-foreground">Genre</span><span>{person.gender === "male" ? "Homme" : person.gender === "female" ? "Femme" : "Non précisé"}</span></div>}
            {person.emotional_state && <div className="flex justify-between"><span className="text-muted-foreground">État émotionnel</span><span>{person.emotional_state}</span></div>}
            {person.invitation_status && <div className="flex justify-between"><span className="text-muted-foreground">Invitation</span><span>{invitationLabels[person.invitation_status]}</span></div>}
            {person.integration_status && <div className="flex justify-between"><span className="text-muted-foreground">Intégration</span><span>{integrationLabels[person.integration_status]}</span></div>}
            {person.next_action && <div><span className="text-muted-foreground block mb-1">Prochaine action</span><span className="text-primary text-xs">{person.next_action}</span></div>}
          </CardContent>
        </Card>

        {/* Description & Notes */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {person.description && <p>{person.description}</p>}
            {person.key_phrases && <div><span className="text-foreground font-medium block mb-1">Phrases clés :</span><p className="italic">"{person.key_phrases}"</p></div>}
            {person.notes && <p>{person.notes}</p>}
            {!person.description && !person.key_phrases && !person.notes && <p className="text-center opacity-50">Aucune note</p>}
          </CardContent>
        </Card>
      </div>

      {/* AI Advice */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Recommandations IA</CardTitle>
          <Button size="sm" variant="outline" onClick={getAiAdvice} disabled={aiLoading}>
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
            Analyser
          </Button>
        </CardHeader>
        <CardContent>
          {aiAdvice ? (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 className="text-sm font-bold text-primary mt-4 mb-1 first:mt-0">{children}</h2>,
                  p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-2">{children}</p>,
                  strong: ({ children }) => <strong className="text-foreground">{children}</strong>,
                }}
              >
                {aiAdvice}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4 opacity-50">Clique sur "Analyser" pour obtenir des recommandations personnalisées.</p>
          )}
        </CardContent>
      </Card>

      {/* Interactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> Interactions ({interactions.length})</CardTitle>
          <Dialog open={interactionOpen} onOpenChange={setInteractionOpen}>
            <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="w-3.5 h-3.5 mr-1" /> Ajouter</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle interaction</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1"><Label className="text-xs">Résumé *</Label><Textarea value={interactionForm.summary} onChange={(e) => setInteractionForm({ ...interactionForm, summary: e.target.value })} placeholder="Ce qui s'est passé..." /></div>
                <div className="space-y-1"><Label className="text-xs">Phrases entendues</Label><Textarea value={interactionForm.phrases_heard} onChange={(e) => setInteractionForm({ ...interactionForm, phrases_heard: e.target.value })} placeholder="Ce que la personne a dit..." /></div>
                <div className="space-y-1"><Label className="text-xs">Réaction observée</Label><Textarea value={interactionForm.reaction_observed} onChange={(e) => setInteractionForm({ ...interactionForm, reaction_observed: e.target.value })} placeholder="Comment la personne a réagi..." /></div>
                <Button onClick={() => addInteractionMutation.mutate({ ...interactionForm, person_id: personId, person_name: person.nickname, interaction_date: new Date().toISOString().split("T")[0] })} disabled={!interactionForm.summary.trim()} className="w-full">Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {interactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 opacity-50">Aucune interaction enregistrée</p>
          ) : (
            <div className="space-y-3">
              {interactions.map((inter) => (
                <div key={inter.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {inter.interaction_date ? format(new Date(inter.interaction_date), "d MMM yyyy", { locale: fr }) : "Date non précisée"}
                  </div>
                  <p className="text-sm">{inter.summary}</p>
                  {inter.phrases_heard && <p className="text-xs text-muted-foreground italic">"{inter.phrases_heard}"</p>}
                  {inter.reaction_observed && <p className="text-xs text-muted-foreground">Réaction : {inter.reaction_observed}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}