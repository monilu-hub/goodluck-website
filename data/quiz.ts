export type ArchetypeId =
  | "mirada-lenta"
  | "chispa-abierta"
  | "misterio-suave"
  | "calor-cercano"
  | "confianza-directa";

export type LocaleCopy = { es: string; en: string };

export type QuizOption = {
  id: string;
  label: LocaleCopy;
  weights: Partial<Record<ArchetypeId, number>>;
};

export type QuizQuestion = {
  id: string;
  axis: "occasion" | "attraction" | "socialization" | "signal";
  prompt: LocaleCopy;
  options: QuizOption[];
};

export type QuizArchetype = {
  id: ArchetypeId;
  name: LocaleCopy;
  tagline: LocaleCopy;
  profileNotes: LocaleCopy;
  phrase: LocaleCopy;
  productSlug: string;
  color: string;
};

/** Empate: mayor prioridad primero */
export const ARCHETYPE_TIEBREAK: ArchetypeId[] = [
  "confianza-directa",
  "chispa-abierta",
  "calor-cercano",
  "misterio-suave",
  "mirada-lenta",
];

export const QUIZ_ARCHETYPES: QuizArchetype[] = [
  {
    id: "mirada-lenta",
    name: { es: "Mirada lenta", en: "Slow gaze" },
    tagline: {
      es: "Slow-burn con intención. No persigues: dejas que se acerquen.",
      en: "Slow-burn with intent. You don't chase — you let them come closer.",
    },
    profileNotes: {
      es: "Ocasión íntima, perfil seguro y selectivo, socialización de pocas miradas precisas. Tu suerte en el amor es una invitación que no grita.",
      en: "Intimate occasion, secure and selective profile, precise low-key socialization. Your luck in love is an invitation that never shouts.",
    },
    phrase: {
      es: "buena suerte mirándome",
      en: "good luck looking at me",
    },
    productSlug: "camiseta-oversized-fit",
    color: "off-white",
  },
  {
    id: "chispa-abierta",
    name: { es: "Chispa abierta", en: "Open spark" },
    tagline: {
      es: "Juguetona, sociable, imposible de ignorar sin sonreír.",
      en: "Playful, social, impossible to ignore without smiling.",
    },
    profileNotes: {
      es: "Ocasión grupal o salida viva, perfil magnético y ligero, socialización que energiza la mesa. Tu good luck provoca y divierte.",
      en: "Group night or lively outing, magnetic light profile, socialization that lifts the table. Your good luck teases and entertains.",
    },
    phrase: {
      es: "good luck keeping up",
      en: "good luck keeping up",
    },
    productSlug: "camiseta-oversized-fit",
    color: "acid-negro",
  },
  {
    id: "misterio-suave",
    name: { es: "Misterio suave", en: "Soft mystery" },
    tagline: {
      es: "Reservado con magnetismo. Dices poco y quedas en la cabeza.",
      en: "Reserved with magnetism. You say little and stay in their head.",
    },
    profileNotes: {
      es: "Ocasión de primera impresión, perfil difícil de leer, socialización desde el borde. Tu frase abre una pregunta, no una respuesta.",
      en: "First-impression occasion, hard-to-read profile, edge-of-the-room socialization. Your line opens a question, not an answer.",
    },
    phrase: {
      es: "suerte si adivinas",
      en: "good luck guessing",
    },
    productSlug: "camiseta-algodon",
    color: "verde-caqui",
  },
  {
    id: "calor-cercano",
    name: { es: "Calor cercano", en: "Close warmth" },
    tagline: {
      es: "Cercanía con filo. Ternura que se siente a un paso.",
      en: "Closeness with an edge. Tenderness you feel one step away.",
    },
    profileNotes: {
      es: "Ocasión de conexión real, perfil afectuoso, socialización de círculo íntimo. Tu suerte en el amor suena a atracción suave y peligrosa.",
      en: "Real-connection occasion, affectionate profile, intimate-circle socialization. Your luck in love sounds soft — and a little dangerous.",
    },
    phrase: {
      es: "good luck no quererme",
      en: "good luck not wanting me",
    },
    productSlug: "camiseta-algodon",
    color: "rosado-apagado",
  },
  {
    id: "confianza-directa",
    name: { es: "Confianza directa", en: "Direct confidence" },
    tagline: {
      es: "Sin rodeos. Entrás, mirás y el mensaje queda claro.",
      en: "No detours. You walk in, look over, and the message is clear.",
    },
    profileNotes: {
      es: "Ocasión de tomar espacio, perfil asertivo, socialización que lidera. Tu good luck es seguridad sin disculpas — y eso atrae.",
      en: "Space-taking occasion, assertive profile, leadership socialization. Your good luck is unapologetic confidence — and that pulls.",
    },
    phrase: {
      es: "buena suerte resistiendo",
      en: "good luck resisting",
    },
    productSlug: "camiseta-tela-fria",
    color: "negro",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-occasion",
    axis: "occasion",
    prompt: {
      es: "Esta prenda sale a…",
      en: "This piece is going to…",
    },
    options: [
      {
        id: "first-date",
        label: {
          es: "Una primera cita donde el silencio también habla",
          en: "A first date where silence also speaks",
        },
        weights: {
          "mirada-lenta": 3,
          "misterio-suave": 2,
          "calor-cercano": 1,
        },
      },
      {
        id: "friends-night",
        label: {
          es: "Una noche con amigos donde alguien nuevo aparece",
          en: "A night with friends where someone new shows up",
        },
        weights: {
          "chispa-abierta": 3,
          "confianza-directa": 2,
          "calor-cercano": 1,
        },
      },
      {
        id: "mirror-check",
        label: {
          es: "Verte al espejo antes de salir — y gustarte",
          en: "Looking in the mirror before you leave — and liking it",
        },
        weights: {
          "confianza-directa": 3,
          "mirada-lenta": 2,
          "misterio-suave": 1,
        },
      },
      {
        id: "unplanned",
        label: {
          es: "Un plan que aún no existe, pero ya se siente",
          en: "A plan that doesn't exist yet, but already feels close",
        },
        weights: {
          "calor-cercano": 3,
          "misterio-suave": 2,
          "mirada-lenta": 1,
        },
      },
    ],
  },
  {
    id: "q-attraction",
    axis: "attraction",
    prompt: {
      es: "Cuando alguien te gusta, tu cuerpo…",
      en: "When you like someone, your body…",
    },
    options: [
      {
        id: "volume-down",
        label: {
          es: "Baja el volumen y observa más de lo que habla",
          en: "Turns the volume down and watches more than it talks",
        },
        weights: {
          "mirada-lenta": 3,
          "misterio-suave": 2,
        },
      },
      {
        id: "playful",
        label: {
          es: "Se pone juguetón y busca la chispa al instante",
          en: "Gets playful and looks for the spark right away",
        },
        weights: {
          "chispa-abierta": 3,
          "confianza-directa": 1,
          "calor-cercano": 1,
        },
      },
      {
        id: "hard-to-read",
        label: {
          es: "Se vuelve difícil de leer a propósito",
          en: "Becomes hard to read — on purpose",
        },
        weights: {
          "misterio-suave": 3,
          "mirada-lenta": 1,
          "confianza-directa": 1,
        },
      },
      {
        id: "leans-in",
        label: {
          es: "Se acerca sin aviso, como si el espacio fuera suyo",
          en: "Leans in without warning, as if the space were yours",
        },
        weights: {
          "calor-cercano": 3,
          "chispa-abierta": 1,
          "confianza-directa": 1,
        },
      },
      {
        id: "direct",
        label: {
          es: "Va al grano: mira, sonríe, decide",
          en: "Goes straight: looks, smiles, decides",
        },
        weights: {
          "confianza-directa": 3,
          "chispa-abierta": 1,
        },
      },
    ],
  },
  {
    id: "q-social",
    axis: "socialization",
    prompt: {
      es: "En un lugar lleno de gente, tú…",
      en: "In a crowded room, you…",
    },
    options: [
      {
        id: "choose-gaze",
        label: {
          es: "Eliges a quién mirar — y a quién no",
          en: "Choose who to look at — and who not to",
        },
        weights: {
          "mirada-lenta": 3,
          "misterio-suave": 1,
        },
      },
      {
        id: "energize",
        label: {
          es: "Energizas la mesa sin pedirlo",
          en: "Energize the table without being asked",
        },
        weights: {
          "chispa-abierta": 3,
          "confianza-directa": 1,
        },
      },
      {
        id: "edge",
        label: {
          es: "Observas desde el borde hasta que algo vale la pena",
          en: "Watch from the edge until something is worth it",
        },
        weights: {
          "misterio-suave": 3,
          "mirada-lenta": 2,
        },
      },
      {
        id: "intimate-circle",
        label: {
          es: "Creas un círculo íntimo en medio del ruido",
          en: "Build an intimate circle in the middle of the noise",
        },
        weights: {
          "calor-cercano": 3,
          "mirada-lenta": 1,
        },
      },
      {
        id: "take-space",
        label: {
          es: "Entras y tomas el espacio como si ya fuera tuyo",
          en: "Walk in and take the space like it's already yours",
        },
        weights: {
          "confianza-directa": 3,
          "chispa-abierta": 2,
        },
      },
    ],
  },
  {
    id: "q-signal",
    axis: "signal",
    prompt: {
      es: "Tu “good luck” en el amor debería sonar a…",
      en: "Your “good luck” in love should sound like…",
    },
    options: [
      {
        id: "slow-invite",
        label: {
          es: "Una invitación lenta que no se olvida",
          en: "A slow invitation they can't forget",
        },
        weights: {
          "mirada-lenta": 3,
          "calor-cercano": 1,
        },
      },
      {
        id: "light-tease",
        label: {
          es: "Una provocación ligera, casi un juego",
          en: "A light tease, almost a game",
        },
        weights: {
          "chispa-abierta": 3,
          "confianza-directa": 1,
        },
      },
      {
        id: "enigma",
        label: {
          es: "Un enigma que da ganas de resolver",
          en: "An enigma they want to solve",
        },
        weights: {
          "misterio-suave": 3,
          "mirada-lenta": 1,
        },
      },
      {
        id: "tender-edge",
        label: {
          es: "Ternura con filo — suave y peligrosa",
          en: "Tenderness with an edge — soft and dangerous",
        },
        weights: {
          "calor-cercano": 3,
          "chispa-abierta": 1,
        },
      },
      {
        id: "no-apology",
        label: {
          es: "Seguridad sin disculpas",
          en: "Confidence with no apology",
        },
        weights: {
          "confianza-directa": 3,
          "chispa-abierta": 1,
        },
      },
    ],
  },
];

export function getArchetypeById(id: ArchetypeId): QuizArchetype {
  const found = QUIZ_ARCHETYPES.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown archetype: ${id}`);
  return found;
}
