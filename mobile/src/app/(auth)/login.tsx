import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth, UserRole, UserPack } from "@/context/auth-context";

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
};

export default function LoginScreen() {
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>("user");
  const [pack, setPack] = useState<UserPack>("hybrid");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Veuillez remplir votre e-mail et votre mot de passe.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!validEmail) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const name = role === "admin" ? "Administrateur Matchy" : email.split("@")[0];
      login(role, pack, email, name);
    }, 450);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* IDENTITÉ MATCHY & LOGO */}
        <View style={styles.brandSection}>
          <Image
            source={require("../../../assets/images/MATCHY_logo_principal_transparent (1).png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo Matchy"
          />

          <Text style={styles.slogan}>
            Les bonnes personnes,{"\n"}
            au bon endroit, au bon moment.
          </Text>
        </View>

        {/* CHOIX DU RÔLE : ADMIN OU USER */}
        <View style={styles.roleHeaderContainer}>
          <Text style={styles.roleSectionLabel}>CHOISISSEZ VOTRE RÔLE DE CONNEXION :</Text>
          <View style={styles.roleContainer}>
            <Pressable
              style={[
                styles.roleTab,
                role === "user" && styles.roleTabActive,
              ]}
              onPress={() => setRole("user")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "user" && styles.roleTextActive,
                ]}
              >
                👤 Utilisateur (User)
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.roleTab,
                role === "admin" && styles.roleTabActive,
              ]}
              onPress={() => setRole("admin")}
            >
              <Text
                style={[
                  styles.roleText,
                  role === "admin" && styles.roleTextActive,
                ]}
              >
                🛡️ Administrateur (Admin)
              </Text>
            </Pressable>
          </View>
        </View>

        {/* PACK CHOOSER (UNIQUEMENT POUR USER) */}
        {role === "user" && (
          <View style={styles.packSection}>
            <Text style={styles.roleSectionLabel}>VOTRE PACK MATCHY :</Text>
            <View style={styles.packRow}>
              <Pressable
                style={[styles.packCard, pack === "seeker" && styles.packCardActive]}
                onPress={() => setPack("seeker")}
              >
                <Text style={styles.packEmoji}>🙋‍♂️</Text>
                <Text style={[styles.packTitle, pack === "seeker" && styles.packTitleActive]}>
                  Pack Seeker
                </Text>
                <Text style={styles.packDesc}>Je cherche des services</Text>
              </Pressable>

              <Pressable
                style={[styles.packCard, pack === "provider" && styles.packCardActive]}
                onPress={() => setPack("provider")}
              >
                <Text style={styles.packEmoji}>🛠️</Text>
                <Text style={[styles.packTitle, pack === "provider" && styles.packTitleActive]}>
                  Pack Provider
                </Text>
                <Text style={styles.packDesc}>Je suis artisan / pro</Text>
              </Pressable>

              <Pressable
                style={[styles.packCard, pack === "hybrid" && styles.packCardActive]}
                onPress={() => setPack("hybrid")}
              >
                <Text style={styles.packEmoji}>⚡</Text>
                <Text style={[styles.packTitle, pack === "hybrid" && styles.packTitleActive]}>
                  Pack Hybride
                </Text>
                <Text style={styles.packDesc}>Demandeur & Prestataire</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        <View style={styles.card}>
          <View style={styles.accentLine} />

          <Text style={styles.title}>
            {role === "admin" ? "Espace Administration" : "Espace Utilisateur"}
          </Text>

          <Text style={styles.subtitle}>
            {role === "admin"
              ? "Accès sécurisé pour la gestion de la communauté et des packs."
              : `Connecté sous le Pack ${pack === "hybrid" ? "Hybride ⚡" : pack === "provider" ? "Provider 🛠️" : "Seeker 🙋‍♂️"}.`}
          </Text>

          {/* EMAIL */}
          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            style={[
              styles.input,
              focused === "email" && styles.inputFocused,
            ]}
            placeholder={role === "admin" ? "admin@matchy.tn" : "utilisateur@matchy.tn"}
            placeholderTextColor="#A29AAB"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused("")}
            accessibilityLabel="Adresse e-mail"
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Mot de passe</Text>
          <View
            style={[
              styles.passwordContainer,
              focused === "password" && styles.inputFocused,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Votre mot de passe"
              placeholderTextColor="#A29AAB"
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              accessibilityLabel="Mot de passe"
            />

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              accessibilityRole="button"
              hitSlop={10}
            >
              <Text style={styles.toggleText}>
                {showPassword ? "Masquer" : "Afficher"}
              </Text>
            </Pressable>
          </View>

          {error ? (
            <Text style={styles.error} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          {/* BOUTON SE CONNECTER */}
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>
                {role === "admin" ? "Connexion Administrateur" : "Accéder à l'application"}
              </Text>
            )}
          </Pressable>

          <Text style={styles.securityText}>
            🔒 Authentification sécurisée obligatoire avant l'accès aux interfaces
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Un besoin ? Un talent ? Matchy vous connecte.
          </Text>

          <Text style={styles.copyright}>
            © Matchy · Sousse, Tunisie
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 32,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: "100%",
    maxWidth: 290,
    height: 95,
  },
  slogan: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  roleHeaderContainer: {
    marginBottom: 14,
  },
  roleSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#EFE8FA",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  roleTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  roleTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  packSection: {
    marginBottom: 16,
  },
  packRow: {
    flexDirection: "row",
    gap: 6,
  },
  packCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  packCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  packEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  packTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  packTitleActive: {
    color: COLORS.primaryDark,
    fontWeight: "800",
  },
  packDesc: {
    fontSize: 9,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  accentLine: {
    width: 45,
    height: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 11,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: "#FCFAFF",
    marginBottom: 14,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  passwordContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFAFF",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: COLORS.text,
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "600",
  },
  loginButton: {
    marginTop: 18,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: COLORS.primaryDark,
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  securityText: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  copyright: {
    color: COLORS.muted,
    fontSize: 11,
  },
});
