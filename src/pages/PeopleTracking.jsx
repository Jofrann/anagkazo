import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, ArrowRight } from "lucide-react";
import LevelBadge from "@/components/ui/LevelBadge";
import { LEVELS } from "@/lib/levelsData";

const trustLabels = { cold: "Froid", warming: "En réchauffement", open: "Ouvert", trusting: "Confiant", committed: "Engagé" };
const trustColors = { cold: "text-blue-400", warming: "text-orange-400", open: "text-yellow-400", trusting: "text-emerald-400", committed: "text-primary" };

export default function PeopleTracking() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nickname: "", approximate_age: "", gender: "unknown", meeting_context: "", estimated_level: "", trust_status: "cold", description: "" });
  const queryClient = useQueryClient();

  const { data: people = [], isLoading } = useQuery({
    queryKey: ["people"],
    queryFn: () => base44.entities.Person.list("-updated_date"),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Person.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["people"] }); setOpen(false); setForm({ nickname: "", approximate_age: "", gender: "unknown", meeting_context: "", estimated_level: "", trust_status: "cold", description: "" }); },
  });

  const filtered = people.filter(p => p.nickname?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            Suivi des personnes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{people.length} personne{people.length > 1 ? "s" : ""} suivie{people.length > 1 ? "s" : ""}</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Nouvelle personne</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Nom / Surnom *</Label>
                <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="Ex: Marc du campus" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Âge approximatif</Label>
                  <Input type="number" value={form.approximate_age} onChange={(e) => setForm({ ...form, approximate_age: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Genre</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                      <SelectItem value="unknown">Non précisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Contexte de rencontre</Label>
                <Input value={form.meeting_context} onChange={(e) => setForm({ ...form, meeting_context: e.target.value })} placeholder="Ex: Campus, rue, travail..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Niveau estimé</Label>
                  <Select value={form.estimated_level} onValueChange={(v) => setForm({ ...form, estimated_level: v })}>
                    <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => (<SelectItem key={l.id} value={String(l.id)}>Niv. {l.id} — {l.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Confiance</Label>
                  <Select value={form.trust_status} onValueChange={(v) => setForm({ ...form, trust_status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(trustLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Notes sur la personne..." />
              </div>
              <Button 
                onClick={() => createMutation.mutate({ ...form, approximate_age: form.approximate_age ? Number(form.approximate_age) : undefined, estimated_level: form.estimated_level ? Number(form.estimated_level) : undefined })} 
                disabled={!form.nickname.trim()}
                className="w-full"
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une personne..." className="pl-10" />
      </div>

      {/* List */}
      <div className="grid gap-3">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            {search ? "Aucun résultat" : "Aucune personne ajoutée"}
          </div>
        ) : filtered.map((person) => (
          <Link key={person.id} to={`/people/${person.id}`}>
            <Card className="hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {person.nickname?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{person.nickname}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      {person.meeting_context && <span className="text-xs text-muted-foreground">{person.meeting_context}</span>}
                      {person.trust_status && (
                        <span className={`text-xs font-medium ${trustColors[person.trust_status] || "text-muted-foreground"}`}>
                          {trustLabels[person.trust_status] || person.trust_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {person.estimated_level && <LevelBadge level={person.estimated_level} />}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}