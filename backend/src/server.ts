import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🛡️ SECURITY MEASUREMENTS & HARDENING
// ==========================================

// 1. HTTP Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';"
  );
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  res.removeHeader("X-Powered-By");
  next();
});

// 2. Controlled CORS Whitelisting
const ALLOWED_ORIGINS = [
  "http://localhost:8081",
  "http://localhost:19006",
  "http://localhost:3000",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps, Postman (origin is undefined), and local browser testing
      if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Accès refusé par la politique de sécurité CORS Matchy."));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 3. Request Payload Size Limiting
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// 4. In-Memory Rate Limiting
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown_client";
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    clientRecord.count += 1;

    if (clientRecord.count > maxRequests) {
      const retryAfterSec = Math.ceil((clientRecord.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec);
      return res.status(429).json({
        status: "error",
        code: "RATE_LIMIT_EXCEEDED",
        message: `Trop de requêtes. Veuillez patienter ${retryAfterSec} secondes avant de réessayer.`,
      });
    }

    next();
  };
}

// General limiter: 200 req / minute
app.use(createRateLimiter(200, 60 * 1000));

// Stricter auth limiter: 30 attempts / 10 minutes
const authRateLimiter = createRateLimiter(30, 10 * 60 * 1000);

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [MATCHY_POSTMAN] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// 📦 DATA MODELS & IN-MEMORY STORE
// ==========================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  popular: boolean;
}

export interface Opportunity {
  id: string;
  type: "demand" | "offer";
  title: string;
  category: string;
  governorate: string;
  delegation?: string;
  budget?: string;
  priceValue?: string;
  urgency?: "urgent" | "today" | "flexible";
  availability?: "immediate" | "scheduled";
  clientName?: string;
  providerName?: string;
  phone: string;
  description: string;
  accessConstraint?: string;
  coverageArea?: string;
  experience?: string;
  guarantee?: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  profession: string;
  category: string;
  governorate: string;
  city: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  hourlyRate: string;
  availableNow: boolean;
  verifiedCin: boolean;
  certified: boolean;
  avatar: string;
}

export interface Proposal {
  id: string;
  opportunityId: string;
  providerName: string;
  providerPhone: string;
  priceQuote: string;
  estimatedDuration: string;
  availabilityDate: string;
  message: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  pack: "provider" | "seeker" | "hybrid";
  governorate: string;
  phone: string;
  cinVerified: boolean;
  status: "actif" | "en_attente" | "suspendu";
}

const CATEGORIES: Category[] = [
  { id: "electricite", name: "Électricité", icon: "⚡", count: 48, popular: true },
  { id: "plomberie", name: "Plomberie", icon: "🚰", count: 37, popular: true },
  { id: "bricolage", name: "Bricolage & Menuiserie", icon: "🔨", count: 29, popular: true },
  { id: "climatisation", name: "Climatisation", icon: "❄️", count: 21, popular: false },
  { id: "peinture", name: "Peinture & Plâtre", icon: "🎨", count: 18, popular: false },
  { id: "mecanique", name: "Mécanique & Dépannage", icon: "🚗", count: 15, popular: true },
  { id: "informatique", name: "Informatique & Réseau", icon: "💻", count: 24, popular: false },
  { id: "menage", name: "Nettoyage & Ménage", icon: "✨", count: 31, popular: false },
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    type: "demand",
    title: "Panne générale de disjoncteur",
    category: "electricite",
    governorate: "Sousse",
    delegation: "Sahloul",
    budget: "50 DT",
    urgency: "urgent",
    clientName: "Amine K.",
    phone: "+216 98 111 222",
    description: "Le disjoncteur principal saute sans arrêt dès qu'on allume le chauffe-eau.",
    accessConstraint: "Appartement 2ème étage.",
    createdAt: "Il y a 12 min",
  },
  {
    id: "opp-2",
    type: "demand",
    title: "Fuite d'eau sous l'évier de cuisine",
    category: "plomberie",
    governorate: "Sousse",
    delegation: "Kantaoui",
    budget: "40 DT",
    urgency: "today",
    clientName: "Nadia B.",
    phone: "+216 22 333 444",
    description: "Le siphon fuit et inonde le meuble bas. Matériel standard requis.",
    createdAt: "Il y a 35 min",
  },
  {
    id: "opp-3",
    type: "offer",
    title: "Électricien Agréé : Dépannage 24/7 & Câblage",
    category: "electricite",
    governorate: "Sousse",
    coverageArea: "Sousse, Sahloul, Hammam Sousse & Kantaoui",
    priceValue: "25 DT / h",
    availability: "immediate",
    providerName: "Mohamed Ben Salem",
    experience: "9 ans d'expérience",
    guarantee: "Garantie 6 mois sur les pièces et main d'œuvre",
    phone: "+216 98 421 800",
    description: "Diagnostic de court-circuit, remplacement de disjoncteurs et mise aux normes.",
    createdAt: "Il y a 40 min",
  },
  {
    id: "opp-4",
    type: "demand",
    title: "Installation de 2 climatiseurs 12000 BTU",
    category: "climatisation",
    governorate: "Tunis",
    delegation: "El Menzah 6",
    budget: "160 DT",
    urgency: "flexible",
    clientName: "Farouk M.",
    phone: "+216 55 666 777",
    description: "Installation complète avec support mural dans un appartement neuf.",
    createdAt: "Il y a 1h",
  },
  {
    id: "opp-5",
    type: "offer",
    title: "Plomberie Sanitaire & Détection de Fuite par Caméra",
    category: "plomberie",
    governorate: "Sousse",
    coverageArea: "Grand Sousse et rayon de 30 km",
    priceValue: "40 DT / intervention",
    availability: "immediate",
    providerName: "Karim Trabelsi",
    experience: "12 ans d'expérience",
    guarantee: "Intervention rapide certifiée",
    phone: "+216 22 109 432",
    description: "Dégorgement de canalisations, robinetterie et chauffe-eau.",
    createdAt: "Il y a 1h",
  },
];

let opportunitiesStore: Opportunity[] = [...INITIAL_OPPORTUNITIES];

const PROVIDERS: Provider[] = [
  {
    id: "prov-1",
    name: "Mohamed Ben Salem",
    profession: "Artisan Électricien Agréé",
    category: "electricite",
    governorate: "Sousse",
    city: "Sousse Ville & Sahloul",
    rating: 4.9,
    reviewsCount: 52,
    phone: "+216 98 421 800",
    hourlyRate: "25 DT / h",
    availableNow: true,
    verifiedCin: true,
    certified: true,
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prov-2",
    name: "Karim Trabelsi",
    profession: "Maître Plombier Chauffagiste",
    category: "plomberie",
    governorate: "Sousse",
    city: "Kantaoui & Hammam Sousse",
    rating: 4.8,
    reviewsCount: 44,
    phone: "+216 22 109 432",
    hourlyRate: "30 DT / h",
    availableNow: true,
    verifiedCin: true,
    certified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "prov-3",
    name: "Houssem Jaziri",
    profession: "Technicien Climatisation & Frigo",
    category: "climatisation",
    governorate: "Tunis",
    city: "Ariana & El Menzah",
    rating: 4.9,
    reviewsCount: 39,
    phone: "+216 50 334 112",
    hourlyRate: "40 DT / intervention",
    availableNow: false,
    verifiedCin: true,
    certified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
];

let proposalsStore: Proposal[] = [
  {
    id: "prop-1",
    opportunityId: "opp-1",
    providerName: "Mohamed Ben Salem",
    providerPhone: "+216 98 421 800",
    priceQuote: "45 DT",
    estimatedDuration: "45 minutes",
    availabilityDate: "Immédiate (en 20 min)",
    message: "Je suis à Sahloul avec mon testeur et disjoncteurs neufs de rechange.",
    createdAt: "Il y a 5 min",
  },
];

let usersStore: UserAccount[] = [
  {
    id: "usr-1",
    name: "Mohamed Ben Salem",
    email: "mohamed.salem@matchy.tn",
    role: "user",
    pack: "provider",
    governorate: "Sousse",
    phone: "+216 98 421 800",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "usr-2",
    name: "Sonia Gharbi",
    email: "sonia.gh@gmail.com",
    role: "user",
    pack: "seeker",
    governorate: "Sfax",
    phone: "+216 29 881 742",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "usr-3",
    name: "Karim Trabelsi",
    email: "karim.plombier@yahoo.fr",
    role: "user",
    pack: "hybrid",
    governorate: "Sousse",
    phone: "+216 22 109 432",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "usr-admin",
    name: "Administrateur Matchy",
    email: "admin@matchy.tn",
    role: "admin",
    pack: "hybrid",
    governorate: "Sousse",
    phone: "+216 73 000 000",
    cinVerified: true,
    status: "actif",
  },
];

// Current session user (for Postman testing state)
let currentUserSession: UserAccount = { ...usersStore[2] }; // Defaults to Karim (Pack Hybrid)

// ==========================================
// 🚀 REST API ENDPOINTS (FOR POSTMAN TESTING)
// ==========================================

// 1. SYSTEM HEALTH
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    service: "Matchy Core API",
    version: "1.0.0",
    securityStatus: "active",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 2. AUTHENTICATION & SESSION
app.post("/api/auth/register", authRateLimiter, (req: Request, res: Response) => {
  const { name, email, password, role, pack, phone, governorate } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_FIELDS",
      message: "Nom, e-mail et mot de passe sont obligatoires.",
    });
  }

  const assignedRole = role === "admin" ? "admin" : "user";
  const assignedPack = pack === "provider" ? "provider" : pack === "seeker" ? "seeker" : "hybrid";

  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: String(name),
    email: String(email).toLowerCase(),
    role: assignedRole,
    pack: assignedRole === "admin" ? "hybrid" : assignedPack,
    governorate: governorate || "Sousse",
    phone: phone || "+216 00 000 000",
    cinVerified: false,
    status: "actif",
  };

  usersStore.push(newUser);
  currentUserSession = newUser;

  return res.status(201).json({
    status: "success",
    message: "Compte utilisateur créé avec succès sur Matchy !",
    token: `matchy_jwt_${Buffer.from(email + ":" + Date.now()).toString("base64")}`,
    user: newUser,
  });
});

app.post("/api/auth/login", authRateLimiter, (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      code: "MISSING_CREDENTIALS",
      message: "Veuillez renseigner un e-mail et un mot de passe valides.",
    });
  }

  const existingUser = usersStore.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  const user = existingUser || {
    id: `usr-${Date.now()}`,
    name: email.split("@")[0],
    email: String(email).toLowerCase(),
    role: email.includes("admin") ? ("admin" as const) : ("user" as const),
    pack: "hybrid" as const,
    governorate: "Sousse",
    phone: "+216 98 123 456",
    cinVerified: true,
    status: "actif" as const,
  };

  currentUserSession = user;

  return res.status(200).json({
    status: "success",
    message: "Connexion réussie à Matchy !",
    token: `matchy_jwt_${Buffer.from(email + ":" + Date.now()).toString("base64")}`,
    user,
  });
});

app.get("/api/auth/me", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    user: currentUserSession,
  });
});

app.put("/api/auth/profile", (req: Request, res: Response) => {
  const { name, phone, governorate, pack } = req.body;

  if (name) currentUserSession.name = String(name);
  if (phone) currentUserSession.phone = String(phone);
  if (governorate) currentUserSession.governorate = String(governorate);
  if (pack && (pack === "provider" || pack === "seeker" || pack === "hybrid")) {
    currentUserSession.pack = pack;
  }

  res.status(200).json({
    status: "success",
    message: "Profil mis à jour avec succès !",
    user: currentUserSession,
  });
});

// 3. PACKS SYSTEM (SEEKER, PROVIDER, HYBRID)
app.get("/api/packs", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    currentActivePack: currentUserSession.pack,
    packs: [
      {
        id: "seeker",
        name: "Pack Seeker",
        subtitle: "Demandeur de Services",
        tagline: "Pour les particuliers ayant besoin d'interventions rapides",
        pricing: "Gratuit / 0 DT",
        features: [
          "Publication illimitée de demandes de services",
          "Bouton d'intervention express SOS < 30 min",
          "Consultation des avis et contacts directs des artisans",
          "Messagerie instantanée sécurisée",
        ],
      },
      {
        id: "provider",
        name: "Pack Provider",
        subtitle: "Artisan & Prestataire Professionnel",
        tagline: "Pour les artisans et techniciens cherchant de nouveaux chantiers",
        pricing: "Formule Pro / Sans commission",
        features: [
          "Vitrine officielle sur l'annuaire de Tunisie",
          "Réception des alertes de pannes géolocalisées",
          "Badge officiel 🪪 CIN Vérifié",
          "Envoi de devis chiffrés directement aux clients",
        ],
      },
      {
        id: "hybrid",
        name: "Pack Hybride (2-en-1)",
        subtitle: "Seeker + Provider",
        tagline: "Le pack le plus populaire en Tunisie : demandez & offrez des services !",
        pricing: "Pack Recommandé",
        popular: true,
        features: [
          "Tous les avantages du Pack Seeker ET du Pack Provider",
          "Bascule instantanée en 1 clic entre mode Client et mode Artisan",
          "Affichage prioritaire dans les résultats de recherche",
          "Accès aux statistiques de matching local",
        ],
      },
    ],
  });
});

app.post("/api/packs/switch", (req: Request, res: Response) => {
  const { pack } = req.body;

  if (!pack || !["provider", "seeker", "hybrid"].includes(pack)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_PACK",
      message: "Le pack doit être 'provider', 'seeker' ou 'hybrid'.",
    });
  }

  currentUserSession.pack = pack;

  res.status(200).json({
    status: "success",
    message: `Félicitations ! Vous êtes maintenant sous le Pack ${pack.toUpperCase()}. Vos privilèges sont actifs.`,
    user: currentUserSession,
  });
});

// 4. OPPORTUNITIES & SERVICES (DUAL FLOW: DEMANDS & OFFERS)
app.get("/api/opportunities", (req: Request, res: Response) => {
  const { governorate, category, urgency, type, search } = req.query;

  let results = [...opportunitiesStore];

  if (type && (type === "demand" || type === "offer")) {
    results = results.filter((opp) => opp.type === type);
  }

  if (governorate && typeof governorate === "string" && governorate !== "Toutes") {
    results = results.filter(
      (opp) => opp.governorate.toLowerCase() === governorate.toLowerCase()
    );
  }

  if (category && typeof category === "string" && category !== "all") {
    results = results.filter(
      (opp) => opp.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (urgency && typeof urgency === "string") {
    results = results.filter((opp) => opp.urgency === urgency);
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase();
    results = results.filter(
      (opp) =>
        opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        (opp.clientName && opp.clientName.toLowerCase().includes(q)) ||
        (opp.providerName && opp.providerName.toLowerCase().includes(q))
    );
  }

  res.status(200).json({
    status: "success",
    total: results.length,
    filters: { type: type || "all", governorate: governorate || "all", category: category || "all" },
    data: results,
  });
});

app.get("/api/opportunities/:id", (req: Request, res: Response) => {
  const oppId = String(req.params.id);
  const opp = opportunitiesStore.find((o) => o.id === oppId);

  if (!opp) {
    return res.status(404).json({
      status: "error",
      code: "NOT_FOUND",
      message: `Aucune opportunité trouvée avec l'ID ${req.params.id}.`,
    });
  }

  res.status(200).json({
    status: "success",
    data: opp,
  });
});

app.post("/api/opportunities", (req: Request, res: Response) => {
  const {
    type,
    title,
    category,
    governorate,
    delegation,
    budget,
    priceValue,
    urgency,
    availability,
    description,
    clientName,
    providerName,
    coverageArea,
    experience,
    guarantee,
    accessConstraint,
  } = req.body;

  if (!title || !category || !governorate) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_PAYLOAD",
      message: "Titre, catégorie et gouvernorat sont obligatoires.",
    });
  }

  const isOffer = type === "offer";
  const newOpp: Opportunity = {
    id: `opp-${Date.now()}`,
    type: isOffer ? "offer" : "demand",
    title: String(title).slice(0, 100),
    category: String(category).toLowerCase(),
    governorate: String(governorate),
    delegation: delegation ? String(delegation) : "Centre-ville",
    budget: budget ? (String(budget).includes("DT") ? String(budget) : `${budget} DT`) : undefined,
    priceValue: priceValue ? (String(priceValue).includes("DT") ? String(priceValue) : `${priceValue} DT`) : undefined,
    urgency: isOffer ? undefined : urgency === "urgent" ? "urgent" : urgency === "today" ? "today" : "flexible",
    availability: isOffer ? (availability === "scheduled" ? "scheduled" : "immediate") : undefined,
    clientName: isOffer ? undefined : clientName ? String(clientName) : currentUserSession.name,
    providerName: isOffer ? providerName ? String(providerName) : currentUserSession.name : undefined,
    phone: currentUserSession.phone || "+216 98 123 456",
    description: String(description || "Aucune description complémentaire.").slice(0, 500),
    coverageArea: coverageArea ? String(coverageArea) : undefined,
    experience: experience ? String(experience) : undefined,
    guarantee: guarantee ? String(guarantee) : undefined,
    accessConstraint: accessConstraint ? String(accessConstraint) : undefined,
    createdAt: "À l'instant",
  };

  opportunitiesStore.unshift(newOpp);

  res.status(201).json({
    status: "success",
    message: isOffer
      ? "Votre offre artisanale a été publiée avec succès !"
      : "Votre demande client a été diffusée avec succès !",
    data: newOpp,
  });
});

app.delete("/api/opportunities/:id", (req: Request, res: Response) => {
  const oppId = String(req.params.id);
  const index = opportunitiesStore.findIndex((o) => o.id === oppId);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      code: "NOT_FOUND",
      message: "Opportunité introuvable.",
    });
  }

  const removed = opportunitiesStore.splice(index, 1)[0];
  res.status(200).json({
    status: "success",
    message: "Opportunité supprimée avec succès.",
    data: removed,
  });
});

// 5. PROPOSALS & QUOTES (DEVIS)
app.post("/api/opportunities/:id/proposals", (req: Request, res: Response) => {
  const { priceQuote, estimatedDuration, availabilityDate, message } = req.body;
  const oppId = String(req.params.id);

  const opp = opportunitiesStore.find((o) => o.id === oppId);
  if (!opp) {
    return res.status(404).json({
      status: "error",
      code: "OPPORTUNITY_NOT_FOUND",
      message: "Impossible de postuler : l'opportunité n'existe pas.",
    });
  }

  const newProposal: Proposal = {
    id: `prop-${Date.now()}`,
    opportunityId: oppId,
    providerName: currentUserSession.name,
    providerPhone: currentUserSession.phone,
    priceQuote: priceQuote ? `${priceQuote} DT` : "Sur devis",
    estimatedDuration: estimatedDuration || "1 heure",
    availabilityDate: availabilityDate || "Immédiate",
    message: message || "Bonjour, je suis disponible pour réaliser cette intervention.",
    createdAt: "À l'instant",
  };

  proposalsStore.unshift(newProposal);

  res.status(201).json({
    status: "success",
    message: "Votre proposition chiffrée a été transmise au client !",
    data: newProposal,
  });
});

app.get("/api/opportunities/:id/proposals", (req: Request, res: Response) => {
  const oppId = String(req.params.id);
  const list = proposalsStore.filter((p) => p.opportunityId === oppId);
  res.status(200).json({
    status: "success",
    count: list.length,
    data: list,
  });
});

// 6. PROVIDERS DIRECTORY
app.get("/api/providers", (req: Request, res: Response) => {
  const { governorate, category, availableNow } = req.query;

  let results = [...PROVIDERS];

  if (governorate && typeof governorate === "string" && governorate !== "Toutes") {
    results = results.filter(
      (p) => p.governorate.toLowerCase() === governorate.toLowerCase()
    );
  }

  if (category && typeof category === "string" && category !== "all") {
    results = results.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (availableNow === "true") {
    results = results.filter((p) => p.availableNow);
  }

  res.status(200).json({
    status: "success",
    count: results.length,
    data: results,
  });
});

app.get("/api/providers/:id", (req: Request, res: Response) => {
  const provId = String(req.params.id);
  const provider = PROVIDERS.find((p) => p.id === provId);

  if (!provider) {
    return res.status(404).json({
      status: "error",
      code: "NOT_FOUND",
      message: "Artisan introuvable.",
    });
  }

  res.status(200).json({
    status: "success",
    data: provider,
  });
});

// 7. CATEGORIES & TRADES
app.get("/api/categories", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    count: CATEGORIES.length,
    data: CATEGORIES,
  });
});

// 8. ADMIN MANAGEMENT ENDPOINTS
app.get("/api/admin/users", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    count: usersStore.length,
    data: usersStore,
  });
});

app.patch("/api/admin/users/:id/cin", (req: Request, res: Response) => {
  const userId = String(req.params.id);
  const user = usersStore.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "Utilisateur introuvable.",
    });
  }

  user.cinVerified = !user.cinVerified;

  res.status(200).json({
    status: "success",
    message: `Statut CIN mis à jour : ${user.cinVerified ? "Vérifié ✓" : "Non vérifié"}`,
    user,
  });
});

app.patch("/api/admin/users/:id/pack", (req: Request, res: Response) => {
  const { pack } = req.body;
  const userId = String(req.params.id);
  const user = usersStore.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "Utilisateur introuvable.",
    });
  }

  if (pack && ["provider", "seeker", "hybrid"].includes(pack)) {
    user.pack = pack;
  }

  res.status(200).json({
    status: "success",
    message: `Pack de l'utilisateur ${user.name} modifié avec succès en ${user.pack.toUpperCase()}.`,
    user,
  });
});

app.get("/api/admin/stats", (_req: Request, res: Response) => {
  const totalUsers = usersStore.length;
  const providersCount = usersStore.filter((u) => u.pack === "provider").length;
  const seekersCount = usersStore.filter((u) => u.pack === "seeker").length;
  const hybridsCount = usersStore.filter((u) => u.pack === "hybrid").length;
  const demandsCount = opportunitiesStore.filter((o) => o.type === "demand").length;
  const offersCount = opportunitiesStore.filter((o) => o.type === "offer").length;

  res.status(200).json({
    status: "success",
    stats: {
      totalUsers,
      breakdownByPack: {
        providers: providersCount,
        seekers: seekersCount,
        hybrids: hybridsCount,
      },
      content: {
        totalDemands: demandsCount,
        totalOffers: offersCount,
        totalOpportunities: opportunitiesStore.length,
        totalProposals: proposalsStore.length,
      },
    },
  });
});

// 9. POSTMAN COLLECTION EXPORT ENDPOINT (DIRECT IMPORT)
app.get("/api/postman-collection", (_req: Request, res: Response) => {
  const collection = {
    info: {
      name: "MATCHY API - Postman Collection 🇹🇳",
      description: "Collection complète des routes de Matchy pour les tests et la démo hackathon.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [
      {
        name: "1. Health & Telemetry",
        request: { method: "GET", url: "http://localhost:3000/api/health" },
      },
      {
        name: "2. Authentification - Connexion (User / Admin)",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify({ email: "karim.plombier@yahoo.fr", password: "password123" }, null, 2),
          },
          url: "http://localhost:3000/api/auth/login",
        },
      },
      {
        name: "3. Authentification - Inscription",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify(
              {
                name: "Tarek Mansouri",
                email: "tarek.menuisier@matchy.tn",
                password: "password123",
                role: "user",
                pack: "provider",
                phone: "+216 29 881 742",
                governorate: "Sfax",
              },
              null,
              2
            ),
          },
          url: "http://localhost:3000/api/auth/register",
        },
      },
      {
        name: "4. Profil Session Actuelle",
        request: { method: "GET", url: "http://localhost:3000/api/auth/me" },
      },
      {
        name: "5. Packs Matchy (Seeker, Provider, Hybride)",
        request: { method: "GET", url: "http://localhost:3000/api/packs" },
      },
      {
        name: "6. Changer de Pack (Bascule en 1 clic)",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify({ pack: "hybrid" }, null, 2),
          },
          url: "http://localhost:3000/api/packs/switch",
        },
      },
      {
        name: "7. Liste des Catégories de Métiers",
        request: { method: "GET", url: "http://localhost:3000/api/categories" },
      },
      {
        name: "8. Besoins & Offres - Tout le flux",
        request: { method: "GET", url: "http://localhost:3000/api/opportunities" },
      },
      {
        name: "9. Besoins Clients Uniquement (type=demand)",
        request: { method: "GET", url: "http://localhost:3000/api/opportunities?type=demand&governorate=Sousse" },
      },
      {
        name: "10. Offres Artisans Uniquement (type=offer)",
        request: { method: "GET", url: "http://localhost:3000/api/opportunities?type=offer" },
      },
      {
        name: "11. Publier un Besoin Client (Type Seeker)",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify(
              {
                type: "demand",
                title: "Panne chauffe-eau électrique urgent",
                category: "electricite",
                governorate: "Sousse",
                delegation: "Sahloul",
                budget: 60,
                urgency: "urgent",
                description: "Le voyant s'allume mais l'eau reste froide.",
                accessConstraint: "Pièce déjà achetée.",
              },
              null,
              2
            ),
          },
          url: "http://localhost:3000/api/opportunities",
        },
      },
      {
        name: "12. Publier une Offre de Service (Type Provider)",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify(
              {
                type: "offer",
                title: "Artisan Menuisier : Agencement & Montage Meubles",
                category: "bricolage",
                governorate: "Sfax",
                coverageArea: "Sfax et rayon de 30 km",
                priceValue: "30 DT / h",
                availability: "immediate",
                experience: "10 ans d'expérience",
                guarantee: "Travail soigné garanti 1 an",
                description: "Montage de cuisines, dressings, réparations de portes.",
              },
              null,
              2
            ),
          },
          url: "http://localhost:3000/api/opportunities",
        },
      },
      {
        name: "13. Soumettre un Devis à une Demande",
        request: {
          method: "POST",
          header: [{ key: "Content-Type", value: "application/json" }],
          body: {
            mode: "raw",
            raw: JSON.stringify(
              {
                priceQuote: 45,
                estimatedDuration: "30 minutes",
                availabilityDate: "Immédiate",
                message: "Bonjour, je suis disponible à Sahloul pour intervenir tout de suite.",
              },
              null,
              2
            ),
          },
          url: "http://localhost:3000/api/opportunities/opp-1/proposals",
        },
      },
      {
        name: "14. Annuaire des Artisans Vérifiés",
        request: { method: "GET", url: "http://localhost:3000/api/providers?governorate=Sousse" },
      },
      {
        name: "15. Admin - Liste des Utilisateurs & Packs",
        request: { method: "GET", url: "http://localhost:3000/api/admin/users" },
      },
      {
        name: "16. Admin - Valider / Révoquer CIN d'un membre",
        request: { method: "PATCH", url: "http://localhost:3000/api/admin/users/usr-2/cin" },
      },
      {
        name: "17. Admin - Statistiques de la plateforme",
        request: { method: "GET", url: "http://localhost:3000/api/admin/stats" },
      },
    ],
  };

  res.status(200).json(collection);
});

// ==========================================
// ⚠️ SAFE FALLBACK & ERROR HANDLERS
// ==========================================

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: "Cette route n'existe pas sur l'API Matchy. Consultez /api/postman-collection pour la liste complète.",
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[MATCHY_ERROR]", err.message);
  res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "Une erreur interne est survenue sur le serveur Matchy.",
  });
});

// ==========================================
// 🚀 START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MATCHY BACKEND IS RUNNING FOR POSTMAN`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📥 Postman Collection JSON: http://localhost:${PORT}/api/postman-collection`);
  console.log(`🛡️ Security Headers & Rate Limiting: ACTIVE`);
  console.log(`🇹🇳 Localized for: Sousse, Tunis, Sfax, Monastir`);
  console.log(`===============================================`);
});
