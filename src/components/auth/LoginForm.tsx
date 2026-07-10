import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { colors, fonts, gradients } from "../../theme/tokens";
import Field from "./Field";

interface LoginFormProps {
  onSwitch: () => void;
  onSubmit?: (data: { email: string; password: string }) => void;
}

export default function LoginForm({ onSwitch, onSubmit }: LoginFormProps) {
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "";
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
    onSubmit?.({ email, password });
  };
 
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 26, fontWeight: 700 }}>Bon retour parmi nous</h2>
        <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="mt-1.5">
          Connectez-vous pour retrouver votre équipe et vos projets.
        </p>
      </div>

      <Field icon={Mail} label="Adresse e-mail" type="email" placeholder="vous@exemple.com" />
      <Field icon={Lock} label="Mot de passe" showToggle show={show} onToggle={() => setShow(!show)} placeholder="••••••••" />

      <div className="flex items-center justify-between -mt-1">
        <label className="flex items-center gap-2" style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }}>
          <input type="checkbox" className="rounded" /> Se souvenir de moi
        </label>
        <a href="#" style={{ fontFamily: fonts.body, color: colors.accent, fontSize: 13, fontWeight: 500 }}>
          Mot de passe oublié ?
        </a>
      </div>

      <button
        type="submit"
        style={{ fontFamily: fonts.body, color: "#fff", background: gradients.ctaButton, fontWeight: 600, fontSize: 15 }}
        className="py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
      >
        Se connecter <ArrowRight size={16} />
      </button>

      <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="text-center">
        Pas encore de compte ?{" "}
        <button type="button" onClick={onSwitch} style={{ color: colors.accent, fontWeight: 600 }}>
          Créer un compte
        </button>
      </p>
    </form>
  );
}
