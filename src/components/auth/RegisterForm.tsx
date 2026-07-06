import { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { colors, fonts, gradients } from "../../theme/tokens";
import Field from "./Field";

interface RegisterFormProps {
  onSwitch: () => void;
  onSubmit?: (data: { name: string; email: string; password: string }) => void;
}

export default function RegisterForm({ onSwitch, onSubmit }: RegisterFormProps) {
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value ?? "";
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value ?? "";
    onSubmit?.({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 26, fontWeight: 700 }}>Créer votre compte</h2>
        <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="mt-1.5">
          Rejoignez la communauté et inscrivez-vous à votre premier hackathon.
        </p>
      </div>

      <Field icon={User} label="Nom complet" placeholder="Votre nom" />
      <Field icon={Mail} label="Adresse e-mail" type="email" placeholder="vous@exemple.com" />
      <Field icon={Lock} label="Mot de passe" showToggle show={show} onToggle={() => setShow(!show)} placeholder="••••••••" />

      <label className="flex items-start gap-2" style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }}>
        <input type="checkbox" className="rounded mt-0.5" />
        J'accepte les conditions d'utilisation et la politique de confidentialité
      </label>

      <button
        type="submit"
        style={{ fontFamily: fonts.body, color: "#fff", background: gradients.ctaButton, fontWeight: 600, fontSize: 15 }}
        className="py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
      >
        Créer mon compte <ArrowRight size={16} />
      </button>

      <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="text-center">
        Déjà un compte ?{" "}
        <button type="button" onClick={onSwitch} style={{ color: colors.accent, fontWeight: 600 }}>
          Se connecter
        </button>
      </p>
    </form>
  );
}
