export const LEVELS = [
  {
    id: 1,
    name: "Inconscience",
    nameEn: "Unaware",
    color: "from-red-500/20 to-red-900/20",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    bgBadge: "bg-red-500/15 text-red-400",
    description: "La personne ne sait pas qu'elle a un problème ou un manque. C'est le segment le plus important — la majorité des gens s'y trouvent.",
    internalState: "Sentiment de contrôle, fausse paix, déni fonctionnel. La personne construit sa vie sur des bases fragiles sans le savoir.",
    behaviors: [
      "Évite les sujets profonds",
      "Change de sujet quand on parle de sens",
      "Se montre autosuffisante",
      "Utilise l'humour pour esquiver"
    ],
    commonPhrases: [
      "Je n'ai besoin de rien",
      "Ma vie va très bien",
      "Chacun son truc",
      "Je ne suis pas intéressé"
    ],
    hiddenNeed: "Être éveillé doucement à un besoin qu'il ne perçoit pas encore.",
    strategy: "Ne pas apporter de solution. Parler des symptômes, du problème existentiel, des points douloureux universels (solitude, mort, sens) — de manière éduquée et éclairée. Se limiter à cela : l'objectif est de créer une prise de conscience, pas de convertir.",
    whatToSay: "Tu as déjà eu un moment où tu t'es demandé s'il n'y avait pas plus que ce que tu vis ?",
    whatNotToSay: "Tu as besoin de Dieu, tu vis dans le péché.",
    mistakes: ["Prêcher trop tôt", "Citer la Bible directement", "Condamner le style de vie", "Proposer une solution avant d'avoir révélé le problème"],
    keyPoints: [
      "Aborder les symptômes (vide, manque de sens, peur de la mort)",
      "Nommer le problème sans l'imposer",
      "Identifier les points douloureux cachés",
      "Révéler les causes sans accuser"
    ],
    signsOfProgress: "La personne pose une question, même ironique. Elle reste dans la conversation plus longtemps."
  },
  {
    id: 2,
    name: "Minimisation",
    nameEn: "Minimizing",
    color: "from-orange-500/20 to-orange-900/20",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-400",
    bgBadge: "bg-orange-500/15 text-orange-400",
    description: "La personne a conscience qu'il y a un problème, mais le minimise. Elle pose des questions mais n'est pas encore prête à agir.",
    internalState: "Anxiété sous-jacente, tentative de maintenir une façade. La personne sent le besoin mais refuse de lui donner du poids.",
    behaviors: [
      "Admet un problème puis le minimise",
      "Compare sa situation à pire",
      "Rationalise ses choix",
      "Dit 'oui mais' fréquemment"
    ],
    commonPhrases: [
      "C'est pas si grave",
      "Il y a pire que moi",
      "Je gère, t'inquiète",
      "Un jour peut-être"
    ],
    hiddenNeed: "Que quelqu'un valide la gravité réelle sans le juger.",
    strategy: "Répondre aux questions de la personne en la faisant se sentir comprise. Explorer avec elle : C'est quoi exactement son vide ? D'où vient-il ? Y a-t-il des effets dont elle n'est pas consciente ? D'autres vivent-ils la même chose ? Que peut-elle faire ?",
    whatToSay: "Si c'est vraiment pas grave, pourquoi ça revient toujours dans tes pensées ?",
    whatNotToSay: "Tu minimises, c'est plus grave que tu crois.",
    mistakes: ["Être accusateur", "Insister lourdement", "Donner des ultimatums"],
    keyPoints: [
      "Ils veulent en savoir plus ET se sentir compris — priorise l'écoute",
      "Poser les questions qu'ils posent intérieurement (origine du vide, solutions possibles)",
      "Valider leur expérience avant d'avancer",
      "Parler des symptômes, du problème, des causes sans condamner"
    ],
    signsOfProgress: "La personne arrête de comparer, commence à parler de SA situation spécifiquement."
  },
  {
    id: 3,
    name: "Recherche",
    nameEn: "Seeking",
    color: "from-blue-500/20 to-blue-900/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    bgBadge: "bg-blue-500/15 text-blue-400",
    description: "La personne sait qu'il y a un problème et cherche des solutions.",
    internalState: "Ouverture mêlée de confusion. La personne explore mais peut être vulnérable aux fausses réponses.",
    behaviors: [
      "Pose des questions sincères",
      "Explore différentes options",
      "Lit, écoute, regarde des contenus",
      "Compare les approches"
    ],
    commonPhrases: [
      "Qu'est-ce que tu en penses ?",
      "J'ai essayé beaucoup de choses",
      "Il doit y avoir quelque chose de plus",
      "Comment tu fais, toi ?"
    ],
    hiddenNeed: "Une direction claire et sincère, pas une formule religieuse.",
    strategy: "Proposer Dieu comme réponse vivante. Partager avec authenticité. Structurer la réponse.",
    whatToSay: "Ce que tu cherches, je l'ai trouvé. Pas dans une religion, mais dans une relation vivante. Tu veux que je te raconte ?",
    whatNotToSay: "Viens à l'église dimanche, tu verras.",
    mistakes: ["Répondre de façon superficielle", "Donner une solution sans explication", "Être trop pressé"],
    signsOfProgress: "La personne demande des détails, veut en savoir plus, revient vers toi."
  },
  {
    id: 4,
    name: "Évaluation",
    nameEn: "Evaluating",
    color: "from-purple-500/20 to-purple-900/20",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400",
    bgBadge: "bg-purple-500/15 text-purple-400",
    description: "La personne te voit comme une solution possible, mais n'est pas certaine.",
    internalState: "Intérêt réel mais peur de l'engagement. La personne pèse le pour et le contre, observe ta cohérence.",
    behaviors: [
      "Pose des questions de vérification",
      "Teste ta sincérité",
      "Observe ton comportement",
      "Exprime des objections mesurées"
    ],
    commonPhrases: [
      "Ça marche vraiment ?",
      "Et toi, ça t'a changé quoi ?",
      "Je ne suis pas sûr que ce soit pour moi",
      "J'ai besoin de temps"
    ],
    hiddenNeed: "De la confiance, de la cohérence, et la preuve que c'est réel.",
    strategy: "Bâtir la confiance par la transparence. Répondre aux objections avec patience. Montrer par ta vie.",
    whatToSay: "Je comprends tes doutes. Moi aussi j'en avais. Ce qui m'a convaincu, c'est pas un argument, c'est une expérience.",
    whatNotToSay: "Arrête de douter et crois tout simplement.",
    mistakes: ["Forcer la décision", "Ignorer les objections", "Paraître impatient"],
    signsOfProgress: "La personne accepte un rendez-vous, demande à en reparler, baisse ses défenses."
  },
  {
    id: 5,
    name: "Confiance",
    nameEn: "Trusting",
    color: "from-emerald-500/20 to-emerald-900/20",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    bgBadge: "bg-emerald-500/15 text-emerald-400",
    description: "La personne est prête à te suivre et être guidée.",
    internalState: "Confiance établie, prête à s'engager. La personne a besoin d'être accueillie et intégrée.",
    behaviors: [
      "Accepte les invitations",
      "Demande comment commencer",
      "Partage ses craintes ouvertement",
      "Te considère comme un guide"
    ],
    commonPhrases: [
      "Je veux essayer",
      "Montre-moi comment faire",
      "Je suis prêt(e)",
      "Qu'est-ce que je dois faire ?"
    ],
    hiddenNeed: "Être accompagné(e) concrètement dans les premiers pas.",
    strategy: "Structurer le suivi. Inviter dans un cadre. Ne pas abandonner après la première rencontre.",
    whatToSay: "C'est magnifique. On va avancer ensemble, pas à pas. Je serai là.",
    whatNotToSay: "Super, à bientôt alors.",
    mistakes: ["Abandonner après la conversion", "Laisser la personne seule", "Ne pas structurer le suivi"],
    signsOfProgress: "La personne vient régulièrement, pose des questions de croissance, commence à partager avec d'autres."
  }
];

export const PROFILE_TYPES = {
  atheist: { label: "Athée", description: "Ne croit pas en Dieu" },
  skeptic: { label: "Sceptique", description: "Doute de tout" },
  church_hurt: { label: "Blessé par l'église", description: "A vécu une mauvaise expérience" },
  proud: { label: "Orgueilleux", description: "Se croit au-dessus du besoin" },
  curious: { label: "Curieux", description: "Ouvert mais pas convaincu" },
  broken: { label: "Brisé émotionnellement", description: "En souffrance profonde" },
  religious_closed: { label: "Religieux fermé", description: "Croit mais est figé" },
  distracted: { label: "Distrait", description: "Pas le temps, pas d'intérêt visible" },
  morally_resistant: { label: "Résistant moral", description: "Refuse pour des raisons morales" }
};

export const CONTEXTS = {
  street: "Rue",
  campus: "Campus",
  social_media: "Réseaux sociaux",
  family: "Famille",
  work: "Travail",
  friend: "Ami(e)"
};

export function getLevelBadge(level) {
  return LEVELS.find(l => l.id === level) || LEVELS[0];
}