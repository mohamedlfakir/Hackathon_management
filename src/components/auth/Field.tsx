import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";

interface FieldProps {
  icon: LucideIcon;
  label: string;
  type?: string;
  placeholder?: string;
  showToggle?: boolean;
  show?: boolean;
  onToggle?: () => void;
}

export default function Field({ icon: Icon, label, type = "text", placeholder, showToggle, show, onToggle }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: fonts.body, color: colors.text, fontSize: 13, fontWeight: 500 }}>{label}</label>
      <div className="flex items-center gap-2 rounded-lg px-3.5 py-2.5" style={{ border: `1px solid ${colors.border}`, background: "#fff" }}>
        <Icon size={16} color={colors.muted} />
        <input
          type={showToggle ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          style={{ fontFamily: fonts.body, color: colors.text, fontSize: 14 }}
          className="flex-1 outline-none bg-transparent"
        />
        {showToggle && (
          <button type="button" onClick={onToggle} style={{ color: colors.muted }} aria-label="Afficher/masquer le mot de passe">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
