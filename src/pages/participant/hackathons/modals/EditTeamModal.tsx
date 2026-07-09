import React, { useState, useRef, useEffect } from "react";
import { X, Trash2, UserPlus, Camera, Loader2, AlertCircle, Users, Check, ChevronRight } from "lucide-react";
// Remplace le chemin d'import par celui de ton fichier de services actuel
import { addTeamMember, removeTeamMember, updateAvatar } from "../../../../services/team.service";

interface Member {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  email?: string;
}

interface TeamData {
  id: number;
  name: string;
  description?: string;
  avatarUrl?: string;
  leader: { id: number };
  members: Member[];
}

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTeam: TeamData | null;
  onSuccess: () => void; // Permet de recharger les données de la page parente
}

export default function EditTeamModal({
  isOpen,
  onClose,
  userTeam,
  onSuccess,
}: EditTeamModalProps): React.JSX.Element | null {
  // ÉTATS FLUIDES DE L'INTERFACE
  const [avatarPreview, setAvatarPreview] = useState<string | null>(userTeam?.avatarUrl || null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [memberIdentifier, setMemberIdentifier] = useState<string>("");
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);

  // ÉTATS DE CHARGEMENT GÉNÉRAUX
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // 'avatar' | 'add' | 'delete'
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarPreview(userTeam?.avatarUrl || null);
  }, [userTeam]);

  if (!isOpen) return null;

  // 1. GESTION DE L'AVATAR (Mise à jour et génération à la volée)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingAction("avatar");
    setError(null);

    try {
      // Exécute directement ta méthode d'envoi
      const updatedTeam = await updateAvatar(userTeam!.id, file);
      setAvatarPreview(URL.createObjectURL(file));
      onSuccess(); // Rafraîchit les données du layout parent
    } catch (err: any) {
      setError("Impossible de mettre à jour l'avatar de l'équipe.");
    } finally {
      setLoadingAction("avatar");
    }
  };

  // Générateur d'avatar temporaire basé sur le nom si aucun avatarUrl n'existe
  const renderAvatar = () => {
    if (avatarPreview) {
      return <img src={avatarPreview} alt={userTeam!.name} className="w-full h-full object-cover" />;
    }
    // Génère les initiales (2 premières lettres du nom d'équipe)
    const initials = userTeam!.name.slice(0, 2).toUpperCase();
    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xl tracking-wider">
        {initials}
      </div>
    );
  };

  // 2. ACTION : AJOUTER UN MEMBRE
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdentifier.trim()) return;

    setLoadingAction("add");
    setError(null);

    try {
      // Note : Comme convenu, tu adapteras la conversion de la String en ID numérique plus tard dans ton service.
      // Pour l'instant, on envoie directement l'identifiant saisi pour matcher ta signature
      const mockUserIdToPass = parseInt(memberIdentifier) || 999; 

      await addTeamMember(userTeam!.id, mockUserIdToPass);
      
      setMemberIdentifier("");
      setShowAddForm(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Utilisateur introuvable ou déjà inscrit dans une équipe.");
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. ACTION : SUPPRIMER UN MEMBRE
  const handleConfirmDelete = async (memberId: number) => {
    setLoadingAction(`delete-${memberId}`);
    setError(null);

    try {
      await removeTeamMember(userTeam!.id, memberId);
      setDeletingMemberId(null);
      onSuccess();
    } catch (err: any) {
      setError("Une erreur est survenue lors du retrait du membre.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[85vh]">
        
        {/* EN-TÊTE */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">Configuration de l'équipe</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENU */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-800 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ESPACE AVATAR ET NOM */}
          <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <div 
              className="relative group w-14 h-14 rounded-full border border-gray-200 overflow-hidden cursor-pointer shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              {renderAvatar()}
              {/* Overlay interactif visible en permanence au survol mobile & desktop */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {loadingAction === "avatar" ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate">{userTeam!.name}</h4>
              <p className="text-[11px] text-gray-400 truncate">{userTeam!.description || "Aucune description fournie."}</p>
            </div>
          </div>

          {/* COMPOSANT D'AJOUT DE MEMBRE ACTIONNABLE PAR ICONE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Équipiers ({userTeam!.members.length})</span>
              
              {!showAddForm && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Ajouter un membre
                </button>
              )}
            </div>

            {showAddForm && (
              <form onSubmit={handleAddMemberSubmit} className="flex gap-2 p-2 bg-indigo-50/40 border border-indigo-100 rounded-xl animate-slide-down">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Email ou Username"
                  value={memberIdentifier}
                  onChange={(e) => setMemberIdentifier(e.target.value)}
                  className="flex-1 px-2.5 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-600 bg-white"
                />
                <button
                  type="submit"
                  disabled={loadingAction === "add"}
                  className="p-1 px-2.5 bg-indigo-600 text-white text-[11px] font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {loadingAction === "add" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setMemberIdentifier(""); }}
                  className="p-1 text-gray-400 hover:text-gray-600 text-xs"
                >
                  Annuler
                </button>
              </form>
            )}
          </div>

          {/* LISTE DES MEMBRES ACTUELS AVEC DOUBLE CONFIRMATION SÉCURISÉE */}
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden">
            {userTeam!.members.map((member) => {
              const isLeader = member.id === userTeam!.leader.id;
              const isConfirmingDelete = deletingMemberId === member.id;
              const isDeletingThisMember = loadingAction === `delete-${member.id}`;

              return (
                <div key={member.id} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {member.first_name} {member.last_name || ""}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">@{member.username || member.email?.split("@")[0] || "participant"}</p>
                  </div>

                  <div className="shrink-0">
                    {isLeader ? (
                      <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        Leader
                      </span>
                    ) : isConfirmingDelete ? (
                      <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg border border-red-100">
                        <span className="text-[10px] text-red-700 font-medium px-1">Retirer ?</span>
                        <button
                          type="button"
                          disabled={isDeletingThisMember}
                          onClick={() => handleConfirmDelete(member.id)}
                          className="p-0.5 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          {isDeletingThisMember ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingMemberId(null)}
                          className="p-0.5 text-gray-400 hover:text-gray-600 text-[10px] font-bold"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingMemberId(member.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Retirer ce membre"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FERMETURE */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}