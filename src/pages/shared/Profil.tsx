import React, { useState, useEffect, useRef } from "react";
import { 
  User, Mail, Lock, Camera, Calendar, Shield, 
  CheckCircle2, AlertCircle, Loader2, FileText, Sparkles 
} from "lucide-react";
import * as userService from "../../services/user.service"; // À adapter selon vos chemins

// ============================================================================
// INTERFACES
// ============================================================================
interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  bio: string | null;
  avatar_path: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage(): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS PRINCIPAUX ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // --- ÉTATS DES FORMULAIRES ---
  const [profileForm, setProfileForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    bio: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- ÉTATS DE SOUUMISSION & FEEDBACK ---
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Base URL pour les avatars (Ex: http://localhost:5000/)
  const API_BASE_URL = "http://localhost:3000";

  // --- CHARGEMENT INITIAL ---
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setGlobalError(null);
      const response = await userService.getMe();
      
      if (response?.success && response.user) {
        setUser(response.user);
        setProfileForm({
          username: response.user.username || "",
          first_name: response.user.first_name || "",
          last_name: response.user.last_name || "",
          email: response.user.email || "",
          bio: response.user.bio || ""
        });
      } else {
        setGlobalError("Impossible de décoder les données de votre profil.");
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Erreur lors de la récupération des données de votre profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- GESTIONNAIRES DE NOTIFICATIONS ALERTE ---
  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setFeedback(null), 5000);
  };

  // --- ACTION : MISE À JOUR DU PROFIL ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    try {
      const response = await userService.updateProfile(profileForm);
      if (response?.success) {
        setUser(response.user);
        showFeedback("success", "Votre profil a été mis à jour avec succès !");
      } else {
        showFeedback("error", response?.message || "Une erreur est survenue.");
      }
    } catch (err: any) {
      showFeedback("error", err?.response?.data?.message || "Erreur de connexion avec le serveur.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  // --- ACTION : CHANGEMENT DE MOT DE PASSE ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("error", "Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setPasswordSubmitting(true);
    try {
      const response = await userService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });
      
      if (response?.success) {
        showFeedback("success", "Votre mot de passe a été modifié avec succès.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showFeedback("error", response?.message || "Mot de passe actuel incorrect.");
      }
    } catch (err: any) {
      showFeedback("error", err?.response?.data?.message || "Échec de la mise à jour du mot de passe.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // --- ACTION : CHANGEMENT D'AVATAR (FILE) ---
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation basique de la taille (ex: 2Mo max)
    if (file.size > 2 * 1024 * 1024) {
      showFeedback("error", "L'image est trop lourde (Maximum 2 Mo).");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setAvatarUploading(true);
    try {
      const response = await userService.updateAvatar(file);
      if (response?.success) {
        // Met à jour uniquement la clé avatar_path dans l'état utilisateur local
        setUser(prev => prev ? { ...prev, avatar_path: response.avatar_path } : null);
        showFeedback("success", "Avatar mis à jour avec succès !");
      } else {
        showFeedback("error", "Impossible de téléverser l'avatar.");
      }
    } catch (err) {
      showFeedback("error", "Erreur réseau lors de l'envoi de l'image.");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">Chargement de vos paramètres de profil...</div>;
  }

  if (globalError || !user) {
    return <div className="text-center py-20 text-red-600 font-medium">{globalError || "Utilisateur introuvable."}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4 md:px-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <User className="w-40 h-40" />
        </div>
        <div className="space-y-1 z-10">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Mon Espace Profil</h1>
          <p className="text-gray-400 text-sm">Gérez l'identité visuelle de votre compte, vos détails de contact et la sécurité de vos accès.</p>
        </div>
      </div>

      {/* ZONE DE NOTIFICATIONS FEEDBACK */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
          feedback.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {/* STRUCTURE PRINCIPALE : 2 COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= COLONNE GAUCHE : AVATAR & INFOS ================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-6">
          
          {/* Avatar avec survol caméra */}
          <div className="relative group w-32 h-32">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center">
              {user.avatar_path ? (
                <img 
                  src={`${API_BASE_URL}/${user.avatar_path}`} 
                  alt="Avatar utilisateur" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-indigo-600 uppercase">
                  {user.first_name?.[0] || user.username[0]}
                </span>
              )}
            </div>
            
            {/* Overlay au survol */}
            <button 
              type="button"
              disabled={avatarUploading}
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {avatarUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Modifier</span>
                </>
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Métadonnées de l'utilisateur */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">
              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : `@${user.username}`}
            </h2>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full shadow-sm">
                <Shield className="w-3 h-3" /> {user.role}
              </span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 text-left space-y-3 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Membre depuis le {new Date(user.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* ================= COLONNE DROITE : FORMULAIRES ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* FORMULAIRE 1 : INFORMATIONS GÉNÉRALES */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Informations Générales</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Identifiant unique (Username)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="text"
                      required
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Prénom</label>
                  <input 
                    type="text"
                    required
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Nom</label>
                  <input 
                    type="text"
                    required
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase">
                  <FileText className="w-3.5 h-3.5" /> <span>Biographie / Parcours</span>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Racontez-nous brièvement votre parcours, vos technologies préférées ou vos ambitions..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed font-medium"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={profileSubmitting}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 disabled:bg-gray-400 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {profileSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>

          {/* FORMULAIRE 2 : SÉCURITÉ / MOT DE PASSE */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Lock className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-gray-900">Mot de passe et Sécurité</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">Mot de passe actuel</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={passwordSubmitting}
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {passwordSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}