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
  success: "#16A34A",
  warning: "#D97706",
};

interface ProviderItem {
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
  experience: string;
}

const PROVIDERS_DATA: ProviderItem[] = [
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
    experience: "9 ans d'expérience",
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
    experience: "12 ans d'expérience",
  },
  {
    id: "prov-3",
    name: "Houssem Jaziri",
    profession: "Technicien Climatisation & Froid",
    category: "climatisation",
    governorate: "Tunis",
    city: "Ariana & El Menzah",
    rating: 4.9,
    reviewsCount: 39,
    phone: "+216 50 334 112",
    hourlyRate: "40 DT / dépannage",
    availableNow: false,
    verifiedCin: true,
    certified: true,
    experience: "7 ans d'expérience",
  },
  {
    id: "prov-4",
    name: "Tarek Mansouri",
    profession: "Menuisier Poseur & Bricolage",
    category: "bricolage",
    governorate: "Sfax",
    city: "Sfax Médina & Téniour",
    rating: 4.7,
    reviewsCount: 28,
    phone: "+216 29 881 742",
    hourlyRate: "20 DT / h",
    availableNow: true,
    verifiedCin: true,
    certified: false,
    experience: "5 ans d'expérience",
  },
  {
    id: "prov-5",
    name: "Sofiane Ayari",
    profession: "Peintre Décorateur d'Intérieur",
    category: "peinture",
    governorate: "Sousse",
    city: "Khezama & Kalâa Kebira",
    rating: 4.8,
    reviewsCount: 31,
    phone: "+216 95 210 994",
    hourlyRate: "18 DT / m²",
    availableNow: true,
    verifiedCin: true,
    certified: true,
    experience: "8 ans d'expérience",
  },
  {
    id: "prov-6",
    name: "Bilel Dridi",
    profession: "Mécanicien & Dépannage Auto",
    category: "mecanique",
    governorate: "Monastir",
    city: "Monastir & Skanes",
    rating: 4.9,
    reviewsCount: 46,
    phone: "+216 24 551 092",
    hourlyRate: "35 DT / diag",
    availableNow: true,
    verifiedCin: true,
    certified: true,
    experience: "11 ans d'expérience",
  },
];

const GOVERNORATES = ["Toutes", "Sousse", "Tunis", "Sfax", "Monastir"];

const TRADE_FILTERS = [
  { id: "all", label: "Tous les métiers" },
  { id: "electricite", label: "⚡ Électriciens" },
  { id: "plomberie", label: "🚰 Plombiers" },
  { id: "climatisation", label: "❄️ Climatisation" },
  { id: "bricolage", label: "🔨 Menuiserie" },
  { id: "peinture", label: "🎨 Peintres" },
  { id: "mecanique", label: "🚗 Mécaniciens" },
];

export default function ExploreScreen() {
  const { user, logout } = useAuth();

  const [selectedGovernorate, setSelectedGovernorate] = useState("Toutes");
  const [selectedTrade, setSelectedTrade] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Contact Modal
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(null);

  const filteredProviders = PROVIDERS_DATA.filter((prov) => {
    const matchesTrade = selectedTrade === "all" || prov.category === selectedTrade;
    const matchesGov =
      selectedGovernorate === "Toutes" ||
      prov.governorate.toLowerCase() === selectedGovernorate.toLowerCase();
    const matchesAvailable = !onlyAvailable || prov.availableNow;
    const matchesSearch =
      searchQuery.trim() === "" ||
      prov.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prov.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prov.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrade && matchesGov && matchesAvailable && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* HEADER AVEC LOGO MATCHY DANS L'INTERFACE */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/MATCHY_logo_principal_transparent (1).png")}
          style={styles.headerLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Matchy"
        />

        <View style={styles.headerActions}>
          <View style={styles.packBadge}>
            <Text style={styles.packBadgeText}>
              {user?.pack === "hybrid"
                ? "⚡ Hybride"
                : user?.pack === "provider"
                ? "🛠️ Provider"
                : "🙋‍♂️ Seeker"}
            </Text>
          </View>

          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Quitter</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Annuaire Artisans & Pros 🇹🇳</Text>
        <Text style={styles.pageSubtitle}>
          Profils vérifiés, avis réels et disponibilité immédiate.
        </Text>

        {/* SEARCH BAR */}
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Rechercher un nom, métier ou ville..."
          placeholderTextColor="#A29AAB"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* GOVERNORATE SELECTOR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
        >
          {GOVERNORATES.map((gov) => (
            <Pressable
              key={gov}
              style={[
                styles.chip,
                selectedGovernorate === gov && styles.chipActive,
              ]}
              onPress={() => setSelectedGovernorate(gov)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedGovernorate === gov && styles.chipTextActive,
                ]}
              >
                📍 {gov}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* TRADE SELECTOR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
        >
          {TRADE_FILTERS.map((t) => (
            <Pressable
              key={t.id}
              style={[
                styles.chip,
                selectedTrade === t.id && styles.chipActive,
              ]}
              onPress={() => setSelectedTrade(t.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedTrade === t.id && styles.chipTextActive,
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* AVAILABILITY TOGGLE BUTTON */}
        <Pressable
          style={[
            styles.toggleAvailableBtn,
            onlyAvailable && styles.toggleAvailableBtnActive,
          ]}
          onPress={() => setOnlyAvailable(!onlyAvailable)}
        >
          <Text
            style={[
              styles.toggleAvailableText,
              onlyAvailable && styles.toggleAvailableTextActive,
            ]}
          >
            {onlyAvailable
              ? "🟢 Affichage: Uniquement disponibles immédiatement"
              : "⚪ Filtrer par: Disponibles maintenant"}
          </Text>
        </Pressable>

        {/* LIST HEADER */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>
            {filteredProviders.length} artisan(s) trouvé(s)
          </Text>
          <Text style={styles.trustBadge}>🛡️ 100% Identités Vérifiées</Text>
        </View>

        {/* PROVIDER CARDS */}
        {filteredProviders.map((prov) => (
          <View key={prov.id} style={styles.providerCard}>
            <View style={styles.cardMain}>
              {/* AVATAR */}
              <View style={styles.avatarBox}>
                <Text style={styles.avatarInitials}>
                  {prov.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
                {prov.availableNow ? <View style={styles.onlineDot} /> : null}
              </View>

              {/* INFO */}
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.providerName}>{prov.name}</Text>
                  <Text style={styles.rateBadge}>{prov.hourlyRate}</Text>
                </View>

                <Text style={styles.providerProfession}>{prov.profession}</Text>
                <Text style={styles.providerExperience}>💼 {prov.experience}</Text>

                <View style={styles.locationRow}>
                  <Text style={styles.providerLocation}>
                    📍 {prov.governorate} · {prov.city}
                  </Text>
                </View>

                {/* TRUST & RATING ROW */}
                <View style={styles.trustRow}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      ⭐ {prov.rating} ({prov.reviewsCount})
                    </Text>
                  </View>

                  {prov.verifiedCin && (
                    <View style={styles.verifiedCinBadge}>
                      <Text style={styles.verifiedCinText}>🪪 CIN Vérifié</Text>
                    </View>
                  )}

                  {prov.certified && (
                    <View style={styles.certBadge}>
                      <Text style={styles.certText}>🏆 Certifié</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* ACTION BAR */}
            <View style={styles.providerActionRow}>
              <View style={styles.availabilityStatus}>
                <Text
                  style={[
                    styles.availabilityStatusText,
                    { color: prov.availableNow ? COLORS.success : COLORS.muted },
                  ]}
                >
                  {prov.availableNow ? "🟢 Disponible maintenant" : "📅 Sur rendez-vous"}
                </Text>
              </View>

              <Pressable
                style={styles.contactBtn}
                onPress={() => setSelectedProvider(prov)}
              >
                <Text style={styles.contactBtnText}>Contacter</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CONTACT MODAL */}
      <Modal visible={!!selectedProvider} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Fiche Artisan Vérifié</Text>
              <Pressable onPress={() => setSelectedProvider(null)} hitSlop={10}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            {selectedProvider && (
              <View style={{ gap: 14 }}>
                <View style={styles.profileSummaryBox}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: COLORS.text }}>
                    {selectedProvider.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: "600" }}>
                    {selectedProvider.profession}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.muted }}>
                    📍 Zone d'intervention : {selectedProvider.governorate} ({selectedProvider.city})
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.muted }}>
                    ⭐ Note moyenne : {selectedProvider.rating}/5 basée sur {selectedProvider.reviewsCount} avis
                  </Text>
                </View>

                <Pressable
                  style={styles.callNowBtn}
                  onPress={() => {
                    Alert.alert(
                      "Appel Direct Matchy",
                      `Numéro direct : ${selectedProvider.phone}\nVous êtes mis en relation sécurisée avec l'artisan.`
                    );
                    setSelectedProvider(null);
                  }}
                >
                  <Text style={styles.callNowBtnText}>
                    📞 Appeler {selectedProvider.phone}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.msgBtn}
                  onPress={() => {
                    Alert.alert(
                      "Messagerie Matchy",
                      `Discussion instantanée ouverte avec ${selectedProvider.name}. Vos coordonnées ont été protégées.`
                    );
                    setSelectedProvider(null);
                  }}
                >
                  <Text style={styles.msgBtnText}>💬 Envoyer un message dans l'application</Text>
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
  packBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  packBadgeText: {
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
    paddingTop: 14,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  pageSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    marginBottom: 12,
  },
  searchInput: {
    height: 46,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 10,
  },
  chipsScroll: {
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  toggleAvailableBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    marginBottom: 14,
  },
  toggleAvailableBtnActive: {
    backgroundColor: "#DCFCE7",
    borderColor: COLORS.success,
  },
  toggleAvailableText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },
  toggleAvailableTextActive: {
    color: "#15803D",
    fontWeight: "700",
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  trustBadge: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: "700",
  },
  providerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardMain: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  providerName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  rateBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },
  providerProfession: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 2,
  },
  providerExperience: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  locationRow: {
    marginTop: 4,
  },
  providerLocation: {
    fontSize: 11,
    color: COLORS.muted,
  },
  trustRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    flexWrap: "wrap",
  },
  ratingBadge: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#92400E",
  },
  verifiedCinBadge: {
    backgroundColor: "#EDE4FF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  verifiedCinText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  certBadge: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  certText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#166534",
  },
  providerActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3EEFA",
    paddingTop: 10,
  },
  availabilityStatus: {
    flex: 1,
  },
  availabilityStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  contactBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  contactBtnText: {
    color: COLORS.white,
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
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  modalCloseText: {
    fontSize: 18,
    color: COLORS.muted,
    fontWeight: "700",
  },
  profileSummaryBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 12,
    gap: 4,
  },
  callNowBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  callNowBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  msgBtn: {
    backgroundColor: "#F3EEFA",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  msgBtnText: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: "700",
  },
});
