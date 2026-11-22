import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "user";
export type UserPack = "provider" | "seeker" | "hybrid";

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pack: UserPack;
  governorate: string;
  profession?: string;
  cinVerified: boolean;
  status: "actif" | "en_attente" | "suspendu";
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pack: UserPack;
  governorate: string;
  phone: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole, pack: UserPack, email: string, name?: string) => void;
  logout: () => void;
  changePack: (newPack: UserPack) => void;
  communityMembers: CommunityMember[];
  updateMemberPack: (memberId: string, pack: UserPack) => void;
  toggleCinVerification: (memberId: string) => void;
}

const INITIAL_MEMBERS: CommunityMember[] = [
  {
    id: "mem-1",
    name: "Mohamed Ben Salem",
    email: "mohamed.salem@matchy.tn",
    role: "user",
    pack: "provider",
    governorate: "Sousse",
    profession: "Électricien Bâtiment",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "mem-2",
    name: "Sonia Gharbi",
    email: "sonia.gh@gmail.com",
    role: "user",
    pack: "seeker",
    governorate: "Sfax",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "mem-3",
    name: "Karim Trabelsi",
    email: "karim.plombier@yahoo.fr",
    role: "user",
    pack: "hybrid",
    governorate: "Sousse",
    profession: "Plombier & Dépanneur Gaz",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "mem-4",
    name: "Farouk Mejri",
    email: "farouk.mejri@outlook.com",
    role: "user",
    pack: "seeker",
    governorate: "Tunis",
    cinVerified: false,
    status: "actif",
  },
  {
    id: "mem-5",
    name: "Houssem Jaziri",
    email: "houssem.clim@matchy.tn",
    role: "user",
    pack: "provider",
    governorate: "Tunis",
    profession: "Technicien Froid & Climatisation",
    cinVerified: true,
    status: "actif",
  },
  {
    id: "mem-6",
    name: "Admin Matchy",
    email: "admin@matchy.tn",
    role: "admin",
    pack: "hybrid",
    governorate: "Sousse",
    cinVerified: true,
    status: "actif",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>(INITIAL_MEMBERS);

  const login = (role: UserRole, pack: UserPack, email: string, name?: string) => {
    const defaultName = role === "admin" ? "Administrateur Matchy" : (name || "Utilisateur Matchy");
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: defaultName,
      email: email.trim().toLowerCase(),
      role,
      pack: role === "admin" ? "hybrid" : pack,
      governorate: "Sousse",
      phone: "+216 98 123 456",
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const changePack = (newPack: UserPack) => {
    if (user) {
      setUser({ ...user, pack: newPack });
    }
  };

  const updateMemberPack = (memberId: string, pack: UserPack) => {
    setCommunityMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, pack } : m))
    );
  };

  const toggleCinVerification = (memberId: string) => {
    setCommunityMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, cinVerified: !m.cinVerified } : m))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        changePack,
        communityMembers,
        updateMemberPack,
        toggleCinVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.");
  }
  return context;
}
