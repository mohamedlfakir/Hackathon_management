import { useRef, useState, useLayoutEffect } from "react";
import { Sparkles } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthMode = "login" | "register";

interface AuthCardProps {
  onLogin?: (data: { email: string; password: string }) => void;
  onRegister?: (data: { name: string; email: string; password: string }) => void;
}

export default function AuthCard({ onLogin, onRegister }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const active = mode === "login" ? loginRef.current : registerRef.current;
    if (active) setHeight(active.offsetHeight);
  }, [mode]);

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2 mb-10 lg:hidden">
        <div className="rounded-md flex items-center justify-center" style={{ width: 30, height: 30, background: colors.accent }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <span style={{ fontFamily: fonts.heading, color: colors.text, fontWeight: 700, fontSize: 17 }}>
          Hackathon<span style={{ color: colors.accent }}>Manager</span>
        </span>
      </div>

      <div style={{ height: height ? `${height}px` : "auto", transition: "height 350ms ease", overflow: "hidden" }}>
        <div
          className="flex"
          style={{ width: "200%", transform: `translateX(${mode === "login" ? "0%" : "-50%"})`, transition: "transform 450ms ease" }}
        >
          <div style={{ width: "50%", flexShrink: 0 }} ref={loginRef} className="pr-2">
            <LoginForm onSwitch={() => setMode("register")} onSubmit={onLogin} />
          </div>
          <div style={{ width: "50%", flexShrink: 0 }} ref={registerRef} className="pl-2">
            <RegisterForm onSwitch={() => setMode("login")} onSubmit={onRegister} />
          </div>
        </div>
      </div>
    </div>
  );
}
