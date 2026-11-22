import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth, UserPack } from "@/context/auth-context";

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

export default function PacksScreen() {
  const {
    user,
    logout,
    changePack,
    communityMembers,
    updateMemberPack,
    toggleCinVerification,
  } = useAuth();

  const [filterPack, setFilterPack] = useState<"all" | UserPack>("all");

  const activePack = user?.pack || "hybrid";
  const isAdmin = user?.role === "admin";

  const handleSwitchMyPack = (newPack: UserPack) => {
    changePack(newPack);
    const packLabels: Record<UserPack, string> = {
      seeker: "Pack Seeker (Demandeur)",
      provider: "Pack Provider (Prestataire)",
      hybrid: "Pack Hybride (Demandeur & Prestataire)",
    };
    Alert.alert(
      "Pack mis à jour !",
      `Votre compte est maintenant configuré sous le ${packLabels[newPack]}. Vos privilèges ont été actualisés.`
    );
  };

  const filteredMembers = communityMembers.filter((m) => {
    if (filterPack === "all") return true;
    return m.pack === filterPack;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* TOP HEADER AVEC LOGO MATCHY DANS L'INTERFACE */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/MATCHY_logo_principal_transparent (1).png")}
          style={styles.headerLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Matchy"
        />

        <View style={styles.headerActions}>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>
              {isAdmin ? "🛡️ Admin" : `⚡ ${activePack.toUpperCase()}`}
            </Text>
          </View>

          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutBtnText}>Déconnexion</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BANNIÈRE PROFIL & PACK ACTUEL */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user?.name || "Utilisateur Matchy"}</Text>
              <Text style={styles.userEmail}>{user?.email || "compte@matchy.tn"}</Text>
              <Text style={styles.userLocation}>📍 {user?.governorate || "Sousse"}, Tunisie</Text>
            </View>

            <View
              style={[
                styles.packStatusTag,
                activePack === "hybrid"
                  ? styles.packTagHybrid
                  : activePack === "provider"
                  ? styles.packTagProvider
                  : styles.packTagSeeker,
              ]}
            >
              <Text style={styles.packStatusTagText}>
                {activePack === "hybrid"
                  ? "⚡ Pack Hybride"
                  : activePack === "provider"
                  ? "🛠️ Pack Provider"
                  : "🙋‍♂️ Pack Seeker"}
              </Text>
            </View>
          </View>

          <View style={styles.packFeaturesBox}>
            <Text style={styles.packFeaturesTitle}>Privilèges Actifs de votre Pack :</Text>
            {activePack === "seeker" && (
              <Text style={styles.packFeatureLine}>
                ✓ Publication de demandes d'aide et dépannages illimités{"\n"}
                ✓ Accès au bouton SOS Dépannage Express en moins de 30 min{"\n"}
                ✓ Numéros de téléphone directs et messagerie des artisans
              </Text>
            )}
            {activePack === "provider" && (
              <Text style={styles.packFeatureLine}>
                ✓ Vitrine officielle sur l'annuaire des artisans vérifiés de Tunisie{"\n"}
                ✓ Réception des alertes de pannes et opportunités géolocalisées{"\n"}
                ✓ Envoi de devis chiffrés et contact client direct sans intermédiaire
              </Text>
            )}
            {activePack === "hybrid" && (
              <Text style={styles.packFeatureLine}>
                ✓ Accès complet combiné : Demandeur de services & Prestataire rémunéré{"\n"}
                ✓ Possibilité de poster des besoins et d'accepter des missions locales{"\n"}
                ✓ Priorité d'affichage dans les suggestions de matching
              </Text>
            )}
          </View>
        </View>

        {/* SÉLECTEUR DE PACK (CHANGER DE PACK) */}
        <Text style={styles.sectionTitle}>Changer ou mettre à niveau votre Pack</Text>
        <Text style={styles.sectionSubtitle}>
          Adaptez vos droits instantanément selon vos besoins actuels :
        </Text>

        <View style={styles.packsGrid}>
          {/* PACK SEEKER */}
          <View
            style={[
              styles.packOptionCard,
              activePack === "seeker" && styles.packOptionCardActive,
            ]}
          >
            <View style={styles.packCardHeader}>
              <Text style={styles.packCardIcon}>🙋‍♂️</Text>
              <View>
                <Text style={styles.packCardName}>Pack Seeker</Text>
                <Text style={styles.packCardRole}>Demandeur de Services</Text>
              </View>
            </View>
            <Text style={styles.packCardDescription}>
              Idéal pour les particuliers, locataires et propriétaires ayant besoin de réparations ou de travaux.
            </Text>
            <Pressable
              style={[
                styles.switchPackBtn,
                activePack === "seeker" && styles.switchPackBtnDisabled,
              ]}
              disabled={activePack === "seeker"}
              onPress={() => handleSwitchMyPack("seeker")}
            >
              <Text style={styles.switchPackBtnText}>
                {activePack === "seeker" ? "Pack Actuel ✓" : "Activer Pack Seeker"}
              </Text>
            </Pressable>
          </View>

          {/* PACK PROVIDER */}
          <View
            style={[
              styles.packOptionCard,
              activePack === "provider" && styles.packOptionCardActive,
            ]}
          >
            <View style={styles.packCardHeader}>
              <Text style={styles.packCardIcon}>🛠️</Text>
              <View>
                <Text style={styles.packCardName}>Pack Provider</Text>
                <Text style={styles.packCardRole}>Artisan & Prestataire</Text>
              </View>
            </View>
            <Text style={styles.packCardDescription}>
              Pour les électriciens, plombiers, techniciens et professionnels cherchant de nouveaux chantiers payants.
            </Text>
            <Pressable
              style={[
                styles.switchPackBtn,
                activePack === "provider" && styles.switchPackBtnDisabled,
              ]}
              disabled={activePack === "provider"}
              onPress={() => handleSwitchMyPack("provider")}
            >
              <Text style={styles.switchPackBtnText}>
                {activePack === "provider" ? "Pack Actuel ✓" : "Activer Pack Provider"}
              </Text>
            </Pressable>
          </View>

          {/* PACK HYBRIDE */}
          <View
            style={[
              styles.packOptionCard,
              styles.packOptionCardPopular,
              activePack === "hybrid" && styles.packOptionCardActive,
            ]}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>PLUS POPULAIRE EN TUNISIE 🇹🇳</Text>
            </View>
            <View style={styles.packCardHeader}>
              <Text style={styles.packCardIcon}>⚡</Text>
              <View>
                <Text style={styles.packCardName}>Pack Hybride</Text>
                <Text style={styles.packCardRole}>Seeker + Provider</Text>
              </View>
            </View>
            <Text style={styles.packCardDescription}>
              Le pack 2-en-1 : publiez des besoins pour votre maison ET décrochez des missions rémunérées pour vos compétences !
            </Text>
            <Pressable
              style={[
                styles.switchPackBtn,
                styles.switchPackBtnPopular,
                activePack === "hybrid" && styles.switchPackBtnDisabled,
              ]}
              disabled={activePack === "hybrid"}
              onPress={() => handleSwitchMyPack("hybrid")}
            >
              <Text style={styles.switchPackBtnText}>
                {activePack === "hybrid" ? "Pack Actuel ✓" : "Activer Pack Hybride"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* GESTION DES UTILISATEURS DE LA COMMUNAUTÉ SELON LE PACK */}
        <View style={styles.membersSectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {isAdmin ? "Gestion Globale des Utilisateurs (Admin)" : "Communauté Matchy selon le Pack"}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {isAdmin
                ? "Gérez les rôles, les packs et la vérification des identités des membres."
                : "Consultez les membres actifs selon leur pack (Provider, Seeker, Hybride)."}
            </Text>
          </View>
        </View>

        {/* FILTRES PAR PACK */}
        <View style={styles.filterPackRow}>
          {(["all", "provider", "seeker", "hybrid"] as const).map((pk) => (
            <Pressable
              key={pk}
              style={[styles.filterChip, filterPack === pk && styles.filterChipActive]}
              onPress={() => setFilterPack(pk)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterPack === pk && styles.filterChipTextActive,
                ]}
              >
                {pk === "all"
                  ? "Tous"
                  : pk === "provider"
                  ? "🛠️ Providers"
                  : pk === "seeker"
                  ? "🙋‍♂️ Seekers"
                  : "⚡ Hybrides"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* LISTE DES UTILISATEURS */}
        <View style={styles.membersList}>
          {filteredMembers.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberTopRow}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.memberNameLine}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.cinVerified ? (
                      <Text style={styles.cinVerifiedBadge}>🪪 CIN Vérifié</Text>
                    ) : (
                      <Text style={styles.cinPendingBadge}>⏳ En attente</Text>
                    )}
                  </View>

                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <Text style={styles.memberGov}>
                    📍 {member.governorate} {member.profession ? `· ${member.profession}` : ""}
                  </Text>
                </View>

                <View
                  style={[
                    styles.packBadgeMini,
                    member.pack === "hybrid"
                      ? styles.packTagHybrid
                      : member.pack === "provider"
                      ? styles.packTagProvider
                      : styles.packTagSeeker,
                  ]}
                >
                  <Text style={styles.packBadgeMiniText}>
                    {member.pack === "hybrid"
                      ? "⚡ Hybride"
                      : member.pack === "provider"
                      ? "🛠️ Provider"
                      : "🙋‍♂️ Seeker"}
                  </Text>
                </View>
              </View>

              {/* ACTIONS ADMIN SUPPLÉMENTAIRES */}
              {isAdmin && (
                <View style={styles.adminActionRow}>
                  <Pressable
                    style={styles.adminActionBtn}
                    onPress={() => toggleCinVerification(member.id)}
                  >
                    <Text style={styles.adminActionBtnText}>
                      {member.cinVerified ? "Révoquer CIN" : "Valider CIN ✓"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.adminActionBtn}
                    onPress={() => {
                      const nextPack: UserPack =
                        member.pack === "seeker"
                          ? "provider"
                          : member.pack === "provider"
                          ? "hybrid"
                          : "seeker";
                      updateMemberPack(member.id, nextPack);
                    }}
                  >
                    <Text style={styles.adminActionBtnText}>Changer Pack</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    width: 140,
    height: 48,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  userBadgeText: {
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
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.muted,
  },
  userLocation: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  packStatusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  packTagHybrid: {
    backgroundColor: "#EDE4FF",
  },
  packTagProvider: {
    backgroundColor: "#DCFCE7",
  },
  packTagSeeker: {
    backgroundColor: "#E0F2FE",
  },
  packStatusTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },
  packFeaturesBox: {
    backgroundColor: "#F9F6FE",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  packFeaturesTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  packFeatureLine: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 12,
  },
  packsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  packOptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  packOptionCardPopular: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  packOptionCardActive: {
    backgroundColor: "#FAF6FF",
    borderColor: COLORS.primaryDark,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  popularBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  packCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  packCardIcon: {
    fontSize: 26,
  },
  packCardName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  packCardRole: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },
  packCardDescription: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 17,
    marginBottom: 12,
  },
  switchPackBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  switchPackBtnPopular: {
    backgroundColor: COLORS.primaryDark,
  },
  switchPackBtnDisabled: {
    backgroundColor: "#D8C7F8",
  },
  switchPackBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
  membersSectionHeader: {
    marginBottom: 8,
  },
  filterPackRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  membersList: {
    gap: 10,
  },
  memberCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  memberTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  memberAvatarText: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: "700",
  },
  memberNameLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  cinVerifiedBadge: {
    fontSize: 9,
    backgroundColor: "#DCFCE7",
    color: "#166534",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: "700",
  },
  cinPendingBadge: {
    fontSize: 9,
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: "600",
  },
  memberEmail: {
    fontSize: 11,
    color: COLORS.muted,
  },
  memberGov: {
    fontSize: 10,
    color: COLORS.muted,
  },
  packBadgeMini: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  packBadgeMiniText: {
    fontSize: 10,
    fontWeight: "700",
  },
  adminActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3EEFA",
    justifyContent: "flex-end",
  },
  adminActionBtn: {
    backgroundColor: "#EDE4FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  adminActionBtnText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
});
