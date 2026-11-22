import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";

const COLORS = {
  primary: "#640FCD",
  primaryDark: "#4B0A9F",
  primaryLight: "#EDE4FF",
  background: "#F8F5FF",
  white: "#FFFFFF",
  text: "#251638",
  muted: "#786B88",
  border: "#E5DCF2",
  danger: "#DC2626",
  warning: "#EA580C",
  success: "#16A34A",
  card: "#FFFFFF",
};

// ==========================================
// 📦 TYPES POUR LES DEUX TYPES DE PUBLICATION
// ==========================================

// TYPE 1 : CELUI QUI CHERCHE UN SERVICE (DEMANDEUR / SEEKER)
export interface ServiceDemand {
  id: string;
  type: "demand";
  title: string;
  category: string;
  governorate: string;
  delegation: string;
  budget: string;
  urgency: "urgent" | "today" | "flexible";
  clientName: string;
  distance: string;
  time: string;
  description: string;
  accessConstraint?: string;
}

// TYPE 2 : CELUI QUI OFFRE UN SERVICE (PRESTATAIRE / PROVIDER)
export interface ServiceOffer {
  id: string;
  type: "offer";
  title: string;
  category: string;
  governorate: string;
  coverageArea: string;
  pricingType: "hourly" | "fixed" | "quote";
  priceValue: string;
  availability: "immediate" | "scheduled";
  providerName: string;
  experience: string;
  guarantee: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  time: string;
  description: string;
}

const CATEGORIES = [
  { id: "all", label: "Tous", icon: "✨" },
  { id: "electricite", label: "Électricité", icon: "⚡" },
  { id: "plomberie", label: "Plomberie", icon: "🚰" },
  { id: "bricolage", label: "Bricolage", icon: "🔨" },
  { id: "climatisation", label: "Climatisation", icon: "❄️" },
  { id: "mecanique", label: "Mécanique", icon: "🚗" },
  { id: "peinture", label: "Peinture", icon: "🎨" },
  { id: "informatique", label: "Informatique", icon: "💻" },
];

const GOVERNORATES = ["Toutes", "Sousse", "Tunis", "Sfax", "Monastir", "Nabeul", "Ariana"];

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Mode d'affichage du flux : "demands" (Besoins clients) ou "offers" (Offres de pros)
  const [feedMode, setFeedMode] = useState<"demands" | "offers">("demands");
  const [selectedGovernorate, setSelectedGovernorate] = useState(user?.governorate || "Sousse");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // 📋 DONNÉES LOCALES : BESOINS CLIENTS (DEMANDES)
  // ==========================================
  const [demands, setDemands] = useState<ServiceDemand[]>([
    {
      id: "dem-1",
      type: "demand",
      title: "Panne générale de disjoncteur",
      category: "electricite",
      governorate: "Sousse",
      delegation: "Sahloul",
      budget: "50 DT",
      urgency: "urgent",
      clientName: "Amine K.",
      distance: "1.8 km",
      time: "Il y a 10 min",
      description: "Le disjoncteur principal saute dès qu'on allume le chauffe-eau. Besoin urgent ce matin.",
      accessConstraint: "Appartement 2ème étage avec ascenseur.",
    },
    {
      id: "dem-2",
      type: "demand",
      title: "Fuite d'eau importante sous évier",
      category: "plomberie",
      governorate: "Sousse",
      delegation: "Kantaoui",
      budget: "45 DT",
      urgency: "urgent",
      clientName: "Nadia B.",
      distance: "3.2 km",
      time: "Il y a 25 min",
      description: "Robinet d'arrêt bloqué et tuyau percé. Infiltration dans le meuble de cuisine.",
      accessConstraint: "Pièce de rechange non fournie, à apporter.",
    },
    {
      id: "dem-3",
      type: "demand",
      title: "Installation 2 climatiseurs 12000 BTU",
      category: "climatisation",
      governorate: "Tunis",
      delegation: "El Menzah 6",
      budget: "170 DT",
      urgency: "flexible",
      clientName: "Farouk M.",
      distance: "Tunis",
      time: "Il y a 1h",
      description: "Pose complète avec équerres et passage de goulottes dans appartement neuf.",
    },
    {
      id: "dem-4",
      type: "demand",
      title: "Montage dressing 4 portes Ikea",
      category: "bricolage",
      governorate: "Sfax",
      delegation: "Route de Téniour",
      budget: "80 DT",
      urgency: "today",
      clientName: "Sonia G.",
      distance: "Sfax",
      time: "Il y a 2h",
      description: "Meuble encore dans les cartons avec plan. Tout l'outillage standard est disponible.",
    },
  ]);

  // ==========================================
  // 🛠️ DONNÉES LOCALES : OFFRES DES ARTISANS
  // ==========================================
  const [offers, setOffers] = useState<ServiceOffer[]>([
    {
      id: "off-1",
      type: "offer",
      title: "Électricien Agréé : Dépannage 24/7 & Mise aux Normes",
      category: "electricite",
      governorate: "Sousse",
      coverageArea: "Sousse, Sahloul, Hammam Sousse & Kantaoui",
      pricingType: "hourly",
      priceValue: "25 DT / h",
      availability: "immediate",
      providerName: "Mohamed Ben Salem",
      experience: "9 ans d'expérience",
      guarantee: "Garantie 6 mois sur les pièces et main d'œuvre",
      phone: "+216 98 421 800",
      rating: 4.9,
      reviewsCount: 52,
      time: "Il y a 30 min",
      description: "Diagnostic rapide de court-circuit, remplacement de disjoncteurs, câblage et tableaux électriques. Outillage professionnel complet.",
    },
    {
      id: "off-2",
      type: "offer",
      title: "Plomberie Sanitaire & Détection de Fuite par Caméra",
      category: "plomberie",
      governorate: "Sousse",
      coverageArea: "Grand Sousse et rayon de 30 km",
      pricingType: "fixed",
      priceValue: "40 DT / intervention",
      availability: "immediate",
      providerName: "Karim Trabelsi",
      experience: "12 ans d'expérience",
      guarantee: "Intervention rapide certifiée",
      phone: "+216 22 109 432",
      rating: 4.8,
      reviewsCount: 44,
      time: "Il y a 1h",
      description: "Dégorgement de canalisations, remplacement de robinetterie, chauffe-eau et raccordements lave-linge. Déplacement en moins de 30 min.",
    },
    {
      id: "off-3",
      type: "offer",
      title: "Entretien & Recharge Gaz Climatiseurs",
      category: "climatisation",
      governorate: "Tunis",
      coverageArea: "Tunis, Ariana, Ben Arous & La Marsa",
      pricingType: "fixed",
      priceValue: "50 DT / unité",
      availability: "scheduled",
      providerName: "Houssem Jaziri",
      experience: "7 ans d'expérience",
      guarantee: "Gaz R410A / R32 certifié d'origine",
      phone: "+216 50 334 112",
      rating: 4.9,
      reviewsCount: 39,
      time: "Il y a 2h",
      description: "Nettoyage complet antibactérien, contrôle d'étanchéité et recharge gaz pour climatiseurs toutes marques.",
    },
  ]);

  // ==========================================
  // 📝 MODAL D'ACTION : CHOIX & FORMULAIRE DÉDIÉ
  // ==========================================
  const [modalMode, setModalMode] = useState<"demand" | "offer" | null>(null);

  // Formulaire 1 : Spécificités Demandeur (Seeker)
  const [demandTitle, setDemandTitle] = useState("");
  const [demandCategory, setDemandCategory] = useState("electricite");
  const [demandGov, setDemandGov] = useState(user?.governorate || "Sousse");
  const [demandDelegation, setDemandDelegation] = useState("Centre-ville");
  const [demandBudget, setDemandBudget] = useState("");
  const [demandUrgency, setDemandUrgency] = useState<"urgent" | "today" | "flexible">("urgent");
  const [demandDescription, setDemandDescription] = useState("");
  const [demandConstraint, setDemandConstraint] = useState("");

  // Formulaire 2 : Spécificités Prestataire (Provider)
  const [offerTitle, setOfferTitle] = useState("");
  const [offerCategory, setOfferCategory] = useState("electricite");
  const [offerGov, setOfferGov] = useState(user?.governorate || "Sousse");
  const [offerCoverage, setOfferCoverage] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerAvailability, setOfferAvailability] = useState<"immediate" | "scheduled">("immediate");
  const [offerExperience, setOfferExperience] = useState("");
  const [offerGuarantee, setOfferGuarantee] = useState("");
  const [offerDescription, setOfferDescription] = useState("");

  // Modal de contact
  const [selectedDemandToMatch, setSelectedDemandToMatch] = useState<ServiceDemand | null>(null);
  const [selectedOfferToContact, setSelectedOfferToContact] = useState<ServiceOffer | null>(null);

  // SOUMISSION TYPE 1 : PUBLIER UN BESOIN
  const handlePublishDemand = () => {
    if (!demandTitle.trim()) {
      Alert.alert("Champ manquant", "Veuillez préciser le titre de votre besoin.");
      return;
    }

    const newDemand: ServiceDemand = {
      id: `dem-${Date.now()}`,
      type: "demand",
      title: demandTitle.trim(),
      category: demandCategory,
      governorate: demandGov,
      delegation: demandDelegation.trim() || "Centre",
      budget: demandBudget.trim() ? `${demandBudget.trim()} DT` : "À convenir",
      urgency: demandUrgency,
      clientName: user?.name || "Vous",
      distance: "0 km (Votre demande)",
      time: "À l'instant",
      description: demandDescription.trim() || "Aucune description complémentaire.",
      accessConstraint: demandConstraint.trim() || undefined,
    };

    setDemands([newDemand, ...demands]);
    setFeedMode("demands");
    setModalMode(null);
    setDemandTitle("");
    setDemandBudget("");
    setDemandDescription("");
    setDemandConstraint("");

    Alert.alert(
      "Demande de service publiée !",
      `Votre besoin a été diffusé aux artisans du gouvernorat de ${demandGov}. Vous recevrez des devis sous peu.`
    );
  };

  // SOUMISSION TYPE 2 : PUBLIER UNE OFFRE
  const handlePublishOffer = () => {
    if (!offerTitle.trim() || !offerPrice.trim()) {
      Alert.alert("Champs manquants", "Veuillez renseigner le titre de votre prestation et votre tarif.");
      return;
    }

    const newOffer: ServiceOffer = {
      id: `off-${Date.now()}`,
      type: "offer",
      title: offerTitle.trim(),
      category: offerCategory,
      governorate: offerGov,
      coverageArea: offerCoverage.trim() || `${offerGov} et environs`,
      pricingType: "fixed",
      priceValue: offerPrice.trim().includes("DT") ? offerPrice.trim() : `${offerPrice.trim()} DT`,
      availability: offerAvailability,
      providerName: user?.name || "Artisan Pro",
      experience: offerExperience.trim() || "Expérience confirmée",
      guarantee: offerGuarantee.trim() || "Travail soigné et garanti",
      phone: user?.phone || "+216 98 *** ***",
      rating: 5.0,
      reviewsCount: 1,
      time: "À l'instant",
      description: offerDescription.trim() || "Prestation professionnelle de qualité.",
    };

    setOffers([newOffer, ...offers]);
    setFeedMode("offers");
    setModalMode(null);
    setOfferTitle("");
    setOfferPrice("");
    setOfferCoverage("");
    setOfferExperience("");
    setOfferGuarantee("");
    setOfferDescription("");

    Alert.alert(
      "Offre de service en ligne !",
      "Votre prestation est désormais visible par tous les clients et demandeurs de Matchy."
    );
  };

  // FILTRAGE
  const filteredDemands = demands.filter((d) => {
    const matchesCat = selectedCategory === "all" || d.category === selectedCategory;
    const matchesGov =
      selectedGovernorate === "Toutes" ||
      d.governorate.toLowerCase() === selectedGovernorate.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesGov && matchesSearch;
  });

  const filteredOffers = offers.filter((o) => {
    const matchesCat = selectedCategory === "all" || o.category === selectedCategory;
    const matchesGov =
      selectedGovernorate === "Toutes" ||
      o.governorate.toLowerCase() === selectedGovernorate.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesGov && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* TOP HEADER AVEC LOGO MATCHY */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/MATCHY_logo_principal_transparent (1).png")}
          style={styles.headerLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Matchy"
        />

        <View style={styles.headerActions}>
          <Pressable
            style={styles.packBadgePill}
            onPress={() => router.push("/packs" as any)}
          >
            <Text style={styles.packBadgePillText}>
              {user?.role === "admin"
                ? "🛡️ Admin"
                : user?.pack === "hybrid"
                ? "⚡ Hybride"
                : user?.pack === "provider"
                ? "🛠️ Provider"
                : "🙋‍♂️ Seeker"}
            </Text>
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Quitter</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BANNIÈRE DE BIENVENUE */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeTitle}>
            Bonjour, {user?.name || "Membre Matchy"} 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Plateforme de mise en relation :{" "}
            <Text style={{ fontWeight: "700", color: COLORS.primaryDark }}>
              Moins de recherche. Plus de matching.
            </Text>
          </Text>
        </View>

        {/* DOUBLE BOUTON D'ACTION : DEUX TYPES DE PUBLICATION */}
        <View style={styles.publishDualContainer}>
          <Text style={styles.publishDualLabel}>QUE SOUHAITEZ-VOUS PUBLIER AUJOURD'HUI ?</Text>
          <View style={styles.publishDualRow}>
            {/* TYPE 1 : CHERCHER UN SERVICE (DEMANDEUR) */}
            <Pressable
              style={styles.publishSeekerBtn}
              onPress={() => setModalMode("demand")}
            >
              <Text style={styles.publishBtnIcon}>🙋‍♂️</Text>
              <View>
                <Text style={styles.publishSeekerBtnTitle}>Chercher un service</Text>
                <Text style={styles.publishSeekerBtnSub}>Publier un besoin ou dépannage</Text>
              </View>
            </Pressable>

            {/* TYPE 2 : OFFRIR UN SERVICE (PRESTATAIRE) */}
            <Pressable
              style={styles.publishProviderBtn}
              onPress={() => setModalMode("offer")}
            >
              <Text style={styles.publishBtnIcon}>🛠️</Text>
              <View>
                <Text style={styles.publishProviderBtnTitle}>Offrir un service</Text>
                <Text style={styles.publishProviderBtnSub}>Proposer mes compétences</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* BANNIÈRE SOS EXPRESS */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>Dépannage d'Urgence Express SOS</Text>
              <Text style={styles.emergencySubtitle}>
                Plombier, électricien ou serrurier chez vous en moins de 30 minutes.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.emergencyButton}
            onPress={() => {
              setDemandUrgency("urgent");
              setModalMode("demand");
            }}
          >
            <Text style={styles.emergencyButtonText}>⚡ Demander une intervention SOS immédiate</Text>
          </Pressable>
        </View>

        {/* SÉLECTEUR DE GOUVERNORAT */}
        <View style={styles.govSection}>
          <Text style={styles.sectionMiniLabel}>📍 FILTRER PAR GOUVERNORAT :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {GOVERNORATES.map((gov) => (
              <Pressable
                key={gov}
                style={[
                  styles.govChip,
                  selectedGovernorate === gov && styles.govChipActive,
                ]}
                onPress={() => setSelectedGovernorate(gov)}
              >
                <Text
                  style={[
                    styles.govChipText,
                    selectedGovernorate === gov && styles.govChipTextActive,
                  ]}
                >
                  {gov === "Toutes" ? "Toute la Tunisie" : gov}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* BARRE DE RECHERCHE */}
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Rechercher par mot-clé, panne ou compétence..."
          placeholderTextColor="#A29AAB"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* CAROUSEL CATÉGORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* SÉLECTEUR D'ONGLET DU FLUX : DEMANDES VS OFFRES */}
        <View style={styles.feedSwitchRow}>
          <Pressable
            style={[
              styles.feedSwitchTab,
              feedMode === "demands" && styles.feedSwitchTabActive,
            ]}
            onPress={() => setFeedMode("demands")}
          >
            <Text
              style={[
                styles.feedSwitchText,
                feedMode === "demands" && styles.feedSwitchTextActive,
              ]}
            >
              📋 Besoins Clients ({filteredDemands.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.feedSwitchTab,
              feedMode === "offers" && styles.feedSwitchTabActive,
            ]}
            onPress={() => setFeedMode("offers")}
          >
            <Text
              style={[
                styles.feedSwitchText,
                feedMode === "offers" && styles.feedSwitchTextActive,
              ]}
            >
              🛠️ Offres des Pros ({filteredOffers.length})
            </Text>
          </Pressable>
        </View>

        {/* AFFICHAGE DU FLUX SÉLECTIONNÉ */}
        {feedMode === "demands" ? (
          // FLUX 1 : DEMANDES CLIENTS
          filteredDemands.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 36 }}>🔍</Text>
              <Text style={styles.emptyTitle}>Aucune demande pour ce filtre</Text>
              <Text style={styles.emptySubtitle}>
                Soyez le premier à publier un besoin dans cette catégorie !
              </Text>
              <Pressable
                style={styles.emptyButton}
                onPress={() => setModalMode("demand")}
              >
                <Text style={styles.emptyButtonText}>+ Publier un besoin</Text>
              </Pressable>
            </View>
          ) : (
            filteredDemands.map((dem) => (
              <View key={dem.id} style={styles.oppCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.typeBadgeDemand}>
                    <Text style={styles.typeBadgeDemandText}>🙋‍♂️ BESOIN CLIENT</Text>
                  </View>

                  <View
                    style={[
                      styles.urgencyBadge,
                      dem.urgency === "urgent"
                        ? styles.urgencyRed
                        : dem.urgency === "today"
                        ? styles.urgencyOrange
                        : styles.urgencyGreen,
                    ]}
                  >
                    <Text style={styles.urgencyBadgeText}>
                      {dem.urgency === "urgent"
                        ? "🚨 URGENT"
                        : dem.urgency === "today"
                        ? "📅 AUJOURD'HUI"
                        : "⏳ FLEXIBLE"}
                    </Text>
                  </View>
                </View>

                <View style={styles.titlePriceRow}>
                  <Text style={styles.oppTitle}>{dem.title}</Text>
                  <Text style={styles.budgetText}>{dem.budget}</Text>
                </View>

                <Text style={styles.oppDescription}>{dem.description}</Text>

                {dem.accessConstraint ? (
                  <View style={styles.constraintBox}>
                    <Text style={styles.constraintText}>
                      ℹ️ Précision : {dem.accessConstraint}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.cardMetaRow}>
                  <Text style={styles.metaLocation}>
                    📍 {dem.governorate} · {dem.delegation} ({dem.distance})
                  </Text>
                  <Text style={styles.metaTime}>⏱️ {dem.time}</Text>
                </View>

                <View style={styles.cardBottomRow}>
                  <View style={styles.clientProfile}>
                    <View style={styles.avatarMini}>
                      <Text style={styles.avatarMiniText}>{dem.clientName.charAt(0)}</Text>
                    </View>
                    <Text style={styles.clientNameText}>{dem.clientName}</Text>
                  </View>

                  <Pressable
                    style={styles.matchActionBtn}
                    onPress={() => setSelectedDemandToMatch(dem)}
                  >
                    <Text style={styles.matchActionBtnText}>Postuler / Devis</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )
        ) : (
          // FLUX 2 : OFFRES DES PRESTATAIRES
          filteredOffers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 36 }}>🛠️</Text>
              <Text style={styles.emptyTitle}>Aucune offre de pro pour ce filtre</Text>
              <Text style={styles.emptySubtitle}>
                Artisans : proposez vos compétences dès maintenant !
              </Text>
              <Pressable
                style={styles.emptyButton}
                onPress={() => setModalMode("offer")}
              >
                <Text style={styles.emptyButtonText}>+ Offrir un service</Text>
              </Pressable>
            </View>
          ) : (
            filteredOffers.map((off) => (
              <View key={off.id} style={styles.oppCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.typeBadgeOffer}>
                    <Text style={styles.typeBadgeOfferText}>🛠️ PRESTATION ARTISAN</Text>
                  </View>

                  <View style={styles.availBadge}>
                    <Text style={styles.availBadgeText}>
                      {off.availability === "immediate"
                        ? "🟢 DISPONIBLE MAINTENANT"
                        : "📅 SUR RENDEZ-VOUS"}
                    </Text>
                  </View>
                </View>

                <View style={styles.titlePriceRow}>
                  <Text style={styles.oppTitle}>{off.title}</Text>
                  <Text style={styles.budgetText}>{off.priceValue}</Text>
                </View>

                <Text style={styles.oppDescription}>{off.description}</Text>

                <View style={styles.offerDetailsBox}>
                  <Text style={styles.offerDetailLine}>
                    📍 Zone : {off.coverageArea}
                  </Text>
                  <Text style={styles.offerDetailLine}>
                    💼 Expérience : {off.experience} · 🛡️ {off.guarantee}
                  </Text>
                </View>

                <View style={styles.cardBottomRow}>
                  <View style={styles.clientProfile}>
                    <View style={[styles.avatarMini, { backgroundColor: "#DCFCE7" }]}>
                      <Text style={[styles.avatarMiniText, { color: "#166534" }]}>
                        {off.providerName.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.clientNameText}>{off.providerName}</Text>
                      <Text style={{ fontSize: 10, color: COLORS.warning, fontWeight: "700" }}>
                        ⭐ {off.rating} ({off.reviewsCount} avis)
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={styles.contactOfferBtn}
                    onPress={() => setSelectedOfferToContact(off)}
                  >
                    <Text style={styles.contactOfferBtnText}>Réserver / Appeler</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ==================================================== */}
      {/* MODAL TYPE 1 : PUBLIER UN BESOIN (DEMANDEUR / SEEKER) */}
      {/* ==================================================== */}
      <Modal visible={modalMode === "demand"} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>🙋‍♂️ Publier un Besoin (Demandeur)</Text>
                <Text style={styles.modalSub}>
                  Décrivez la panne ou les travaux dont vous avez besoin.
                </Text>
              </View>
              <Pressable onPress={() => setModalMode(null)} hitSlop={10}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Intitulé du besoin / problème *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Réparation fuite d'eau sous évier de cuisine"
                placeholderTextColor="#A29AAB"
                value={demandTitle}
                onChangeText={setDemandTitle}
              />

              <Text style={styles.modalLabel}>Métier recherché *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.modalCatChip,
                      demandCategory === cat.id && styles.modalCatChipActive,
                    ]}
                    onPress={() => setDemandCategory(cat.id)}
                  >
                    <Text style={{ fontSize: 13 }}>
                      {cat.icon} {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Gouvernorat d'intervention *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {GOVERNORATES.filter((g) => g !== "Toutes").map((gov) => (
                  <Pressable
                    key={gov}
                    style={[
                      styles.modalCatChip,
                      demandGov === gov && styles.modalCatChipActive,
                    ]}
                    onPress={() => setDemandGov(gov)}
                  >
                    <Text style={{ fontSize: 13 }}>{gov}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Délégation / Quartier *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Sahloul, Kantaoui, El Menzah, Médina..."
                placeholderTextColor="#A29AAB"
                value={demandDelegation}
                onChangeText={setDemandDelegation}
              />

              <Text style={styles.modalLabel}>Niveau d'urgence du besoin</Text>
              <View style={styles.urgencySelectRow}>
                {(["urgent", "today", "flexible"] as const).map((urg) => (
                  <Pressable
                    key={urg}
                    style={[
                      styles.urgencyChoice,
                      demandUrgency === urg && styles.urgencyChoiceActive,
                    ]}
                    onPress={() => setDemandUrgency(urg)}
                  >
                    <Text
                      style={[
                        styles.urgencyChoiceText,
                        demandUrgency === urg && styles.urgencyChoiceTextActive,
                      ]}
                    >
                      {urg === "urgent"
                        ? "🚨 Urgent < 30m"
                        : urg === "today"
                        ? "📅 Aujourd'hui"
                        : "⏳ Flexible"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.modalLabel}>Budget estimé proposé (DT)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: 50 DT (ou laisser vide pour devis)"
                placeholderTextColor="#A29AAB"
                keyboardType="numeric"
                value={demandBudget}
                onChangeText={setDemandBudget}
              />

              <Text style={styles.modalLabel}>Contrainte d'accès ou outillage requis</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Matériel déjà acheté, échelle requise, 3ème étage..."
                placeholderTextColor="#A29AAB"
                value={demandConstraint}
                onChangeText={setDemandConstraint}
              />

              <Text style={styles.modalLabel}>Description détaillée du problème</Text>
              <TextInput
                style={[styles.modalInput, { height: 75, textAlignVertical: "top" }]}
                placeholder="Détaillez la panne, l'ancienneté de l'installation..."
                placeholderTextColor="#A29AAB"
                multiline
                value={demandDescription}
                onChangeText={setDemandDescription}
              />

              <Pressable style={styles.submitModalBtn} onPress={handlePublishDemand}>
                <Text style={styles.submitModalBtnText}>
                  Diffuser mon besoin aux artisans Matchy
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================================================== */}
      {/* MODAL TYPE 2 : PUBLIER UNE OFFRE (PRESTATAIRE / PROVIDER) */}
      {/* ==================================================== */}
      <Modal visible={modalMode === "offer"} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>🛠️ Offrir un Service (Prestataire / Pro)</Text>
                <Text style={styles.modalSub}>
                  Proposez vos compétences et attirez de nouveaux clients.
                </Text>
              </View>
              <Pressable onPress={() => setModalMode(null)} hitSlop={10}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Titre de votre prestation / métier *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Artisan Électricien : Dépannage 24/7 & Câblage"
                placeholderTextColor="#A29AAB"
                value={offerTitle}
                onChangeText={setOfferTitle}
              />

              <Text style={styles.modalLabel}>Spécialité / Métier *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.modalCatChip,
                      offerCategory === cat.id && styles.modalCatChipActive,
                    ]}
                    onPress={() => setOfferCategory(cat.id)}
                  >
                    <Text style={{ fontSize: 13 }}>
                      {cat.icon} {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Gouvernorat de base *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {GOVERNORATES.filter((g) => g !== "Toutes").map((gov) => (
                  <Pressable
                    key={gov}
                    style={[
                      styles.modalCatChip,
                      offerGov === gov && styles.modalCatChipActive,
                    ]}
                    onPress={() => setOfferGov(gov)}
                  >
                    <Text style={{ fontSize: 13 }}>{gov}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Zone & Rayon de déplacement</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Tout Sousse + rayon 25 km (Kantaoui, Kalâa, Hammam Sousse)"
                placeholderTextColor="#A29AAB"
                value={offerCoverage}
                onChangeText={setOfferCoverage}
              />

              <Text style={styles.modalLabel}>Tarif proposé *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: 25 DT / h ou 40 DT / forfait intervention"
                placeholderTextColor="#A29AAB"
                value={offerPrice}
                onChangeText={setOfferPrice}
              />

              <Text style={styles.modalLabel}>Votre disponibilité réelle</Text>
              <View style={styles.urgencySelectRow}>
                <Pressable
                  style={[
                    styles.urgencyChoice,
                    offerAvailability === "immediate" && styles.urgencyChoiceActive,
                  ]}
                  onPress={() => setOfferAvailability("immediate")}
                >
                  <Text
                    style={[
                      styles.urgencyChoiceText,
                      offerAvailability === "immediate" && styles.urgencyChoiceTextActive,
                    ]}
                  >
                    🟢 Immédiate / SOS 24h
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.urgencyChoice,
                    offerAvailability === "scheduled" && styles.urgencyChoiceActive,
                  ]}
                  onPress={() => setOfferAvailability("scheduled")}
                >
                  <Text
                    style={[
                      styles.urgencyChoiceText,
                      offerAvailability === "scheduled" && styles.urgencyChoiceTextActive,
                    ]}
                  >
                    📅 Sur Rendez-vous
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.modalLabel}>Années d'expérience & Diplômes</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: 8 ans d'expérience, diplôme BTP certifié"
                placeholderTextColor="#A29AAB"
                value={offerExperience}
                onChangeText={setOfferExperience}
              />

              <Text style={styles.modalLabel}>Garantie offerte au client</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ex: Garantie 6 mois, devis gratuit, matériel aux normes"
                placeholderTextColor="#A29AAB"
                value={offerGuarantee}
                onChangeText={setOfferGuarantee}
              />

              <Text style={styles.modalLabel}>Description de vos compétences & matériel</Text>
              <TextInput
                style={[styles.modalInput, { height: 75, textAlignVertical: "top" }]}
                placeholder="Décrivez votre savoir-faire, les types de pannes résolues..."
                placeholderTextColor="#A29AAB"
                multiline
                value={offerDescription}
                onChangeText={setOfferDescription}
              />

              <Pressable
                style={[styles.submitModalBtn, { backgroundColor: COLORS.primaryDark }]}
                onPress={handlePublishOffer}
              >
                <Text style={styles.submitModalBtnText}>
                  Mettre en ligne mon offre de prestataire
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DE RÉPONSE À UNE DEMANDE (POUR PRESTATAIRE) */}
      <Modal visible={!!selectedDemandToMatch} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Postuler à ce besoin client</Text>
              <Pressable onPress={() => setSelectedDemandToMatch(null)} hitSlop={10}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            {selectedDemandToMatch && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}>
                  {selectedDemandToMatch.title}
                </Text>

                <View style={styles.modalInfoBox}>
                  <Text style={{ fontSize: 13, color: COLORS.muted }}>
                    📍 Lieu : {selectedDemandToMatch.governorate} ({selectedDemandToMatch.delegation})
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.primaryDark, fontWeight: "700" }}>
                    💰 Budget client : {selectedDemandToMatch.budget}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.muted }}>
                    👤 Client : {selectedDemandToMatch.clientName}
                  </Text>
                </View>

                <Pressable
                  style={styles.actionCallBtn}
                  onPress={() => {
                    Alert.alert(
                      "Mise en relation directe",
                      `Numéro transmis pour le client ${selectedDemandToMatch.clientName}. Vous pouvez intervenir de suite !`
                    );
                    setSelectedDemandToMatch(null);
                  }}
                >
                  <Text style={styles.actionCallBtnText}>📞 Appeler le client pour confirmation</Text>
                </Pressable>

                <Pressable
                  style={styles.actionQuoteBtn}
                  onPress={() => {
                    Alert.alert(
                      "Devis express transmis",
                      `Votre proposition de tarif basé sur ${selectedDemandToMatch.budget} a été envoyée au client !`
                    );
                    setSelectedDemandToMatch(null);
                  }}
                >
                  <Text style={styles.actionQuoteBtnText}>💬 Envoyer une offre chiffrée</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONTACT POUR UNE OFFRE D'ARTISAN (POUR CLIENT) */}
      <Modal visible={!!selectedOfferToContact} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Réserver cet artisan vérifié</Text>
              <Pressable onPress={() => setSelectedOfferToContact(null)} hitSlop={10}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            {selectedOfferToContact && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}>
                  {selectedOfferToContact.title}
                </Text>

                <View style={[styles.modalInfoBox, { backgroundColor: "#DCFCE7" }]}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#166534" }}>
                    👤 {selectedOfferToContact.providerName} (⭐ {selectedOfferToContact.rating}/5)
                  </Text>
                  <Text style={{ fontSize: 12, color: "#166534" }}>
                    💰 Tarif : {selectedOfferToContact.priceValue} · 📍 Zone : {selectedOfferToContact.coverageArea}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#166534" }}>
                    🛡️ {selectedOfferToContact.guarantee}
                  </Text>
                </View>

                <Pressable
                  style={styles.actionCallBtn}
                  onPress={() => {
                    Alert.alert(
                      "Appel en cours",
                      `Composition du ${selectedOfferToContact.phone} vers ${selectedOfferToContact.providerName}...`
                    );
                    setSelectedOfferToContact(null);
                  }}
                >
                  <Text style={styles.actionCallBtnText}>
                    📞 Appeler {selectedOfferToContact.phone}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionQuoteBtn}
                  onPress={() => {
                    Alert.alert(
                      "Message envoyé",
                      `Votre demande de rendez-vous a été transmise à ${selectedOfferToContact.providerName}.`
                    );
                    setSelectedOfferToContact(null);
                  }}
                >
                  <Text style={styles.actionQuoteBtnText}>💬 Envoyer un message dans l'app</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLogo: {
    width: 135,
    height: 46,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  packBadgePill: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  packBadgePillText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: "800",
  },
  logoutBtn: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  logoutBtnText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  welcomeBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  welcomeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  publishDualContainer: {
    marginBottom: 14,
  },
  publishDualLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  publishDualRow: {
    flexDirection: "row",
    gap: 8,
  },
  publishSeekerBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  publishProviderBtn: {
    flex: 1,
    backgroundColor: "#1E1B4B",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#1E1B4B",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  publishBtnIcon: {
    fontSize: 22,
  },
  publishSeekerBtnTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },
  publishSeekerBtnSub: {
    color: "#E9D5FF",
    fontSize: 9,
    marginTop: 1,
  },
  publishProviderBtnTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },
  publishProviderBtnSub: {
    color: "#C7D2FE",
    fontSize: 9,
    marginTop: 1,
  },
  emergencyCard: {
    backgroundColor: "#7B1FA2",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  emergencyIcon: {
    fontSize: 26,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
  },
  emergencySubtitle: {
    fontSize: 11,
    color: "#E1BEE7",
    marginTop: 2,
    lineHeight: 15,
  },
  emergencyButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  emergencyButtonText: {
    color: "#7B1FA2",
    fontSize: 12,
    fontWeight: "800",
  },
  govSection: {
    marginBottom: 10,
  },
  sectionMiniLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  govChip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  govChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  govChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
  },
  govChipTextActive: {
    color: COLORS.white,
  },
  searchInput: {
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingBottom: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
    gap: 4,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  categoryChipIcon: {
    fontSize: 12,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  feedSwitchRow: {
    flexDirection: "row",
    backgroundColor: "#EFE8FA",
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    gap: 4,
  },
  feedSwitchTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  feedSwitchTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  feedSwitchText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },
  feedSwitchTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  oppCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  typeBadgeDemand: {
    backgroundColor: "#EDE4FF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  typeBadgeDemandText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  typeBadgeOffer: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  typeBadgeOfferText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#166534",
  },
  availBadge: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  availBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#166534",
  },
  urgencyBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  urgencyRed: {
    backgroundColor: "#FEE2E2",
  },
  urgencyOrange: {
    backgroundColor: "#FFEDD5",
  },
  urgencyGreen: {
    backgroundColor: "#DCFCE7",
  },
  urgencyBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.text,
  },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  oppTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  budgetText: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.primary,
  },
  oppDescription: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 17,
    marginBottom: 8,
  },
  constraintBox: {
    backgroundColor: "#FFFBEB",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  constraintText: {
    fontSize: 11,
    color: "#B45309",
    fontWeight: "600",
  },
  offerDetailsBox: {
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    gap: 3,
  },
  offerDetailLine: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: "500",
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3EEFA",
    paddingTop: 8,
    marginBottom: 8,
  },
  metaLocation: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "500",
  },
  metaTime: {
    fontSize: 10,
    color: COLORS.muted,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarMini: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMiniText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: "700",
  },
  clientNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  matchActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  matchActionBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
  contactOfferBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  contactOfferBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  emptyButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  modalCloseText: {
    fontSize: 18,
    color: COLORS.muted,
    fontWeight: "700",
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 5,
  },
  modalInput: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: "#FCFAFF",
    marginBottom: 10,
  },
  modalCatChip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 14,
    backgroundColor: "#F3EEFA",
    marginRight: 6,
  },
  modalCatChipActive: {
    backgroundColor: COLORS.primary,
  },
  urgencySelectRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  urgencyChoice: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FCFAFF",
  },
  urgencyChoiceActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  urgencyChoiceText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.muted,
  },
  urgencyChoiceTextActive: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  submitModalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  submitModalBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
  modalInfoBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  actionCallBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: "center",
  },
  actionCallBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  actionQuoteBtn: {
    backgroundColor: "#F3EEFA",
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: "center",
  },
  actionQuoteBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: "700",
  },
});
