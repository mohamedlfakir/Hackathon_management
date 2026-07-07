import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { colors, fonts } from "../../theme/tokens";
import {  Sparkles } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';

// Slider/Carousel data definition for Hackathon concept
interface Slide {
    id: number;
    title: string;
    description: string;
    badge: string;
    graphicType: 'teams' | 'milestones' | 'judging';
}

const CAROUSEL_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Formation d'Équipes Intelligente",
        description: "Trouvez des cofondateurs, des développeurs et des designers basés sur des compétences technologiques communes ou des concepts de pitch grâce à des suggestions de mise en relation en temps réel.",
        badge: "CONSTITUTION D'ÉQUIPES",
        graphicType: "teams"
    },
    {
        id: 2,
        title: "Suivi Automatisé des Jalons",
        description: "Connectez votre dépôt pour suivre automatiquement la progression. Soumettez vos livrables de manière fluide avant la fin du compte à rebours.",
        badge: "PIPELINE DE SOUMISSION",
        graphicType: "milestones"
    },
    {
        id: 3,
        title: "Évaluation en Direct Transparente",
        description: "Suivez l'évolution des critères d'évaluation en temps réel pendant que les juges examinent les projets selon l'innovation, le design et la qualité du code.",
        badge: "ÉVALUATIONS",
        graphicType: "judging"
    }
];

export default function AuthPage(): React.JSX.Element {
    const navigate = useNavigate();

    const { login, register } = useAuth();

    // UI and Slide Toggle States
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    // Login Form State
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    // Register Form State
    const [regUsername, setRegUsername] = useState("");
    const [regFirstName, setRegFirstName] = useState("");
    const [regLastName, setRegLastName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [regError, setRegError] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    // Auto-run slide carousel every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // Form handlers
   const handleLoginSubmit = async (
    e: React.FormEvent<HTMLFormElement>
): Promise<void> => {

    e.preventDefault();

    setLoginError("");
    setIsLoggingIn(true);

    try {

        await login({
            email: loginEmail,
            password: loginPassword,
        });

        navigate("/myspace");

    } catch (err: unknown) {

        if (axios.isAxiosError(err)) {

            setLoginError(
                err.response?.data?.message ??
                "Email or password is incorrect."
            );

        } else {

            setLoginError(
                "An unexpected error occurred."
            );

        }

    } finally {

        setIsLoggingIn(false);

    }

};

   const handleRegisterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
): Promise<void> => {

    e.preventDefault();

    setRegError("");

    if (regPassword !== regConfirmPassword) {

        setRegError("Passwords do not match.");

        return;

    }

    setIsRegistering(true);

    try {

        await register({

            username: regUsername,
            first_name: regFirstName,
            last_name: regLastName,
            email: regEmail,
            password: regPassword,

        });

        navigate("/myspace");

    } catch (err: unknown) {

        if (axios.isAxiosError(err)) {

            setRegError(
                err.response?.data?.message ??
                "Registration failed."
            );

        } else {

            setRegError(
                "An unexpected error occurred."
            );

        }

    } finally {

        setIsRegistering(false);

    }

};

    // Rendering dynamic vector illustrations tailored for a hackathon light-mode vibe
    const renderSlideGraphic = (type: 'teams' | 'milestones' | 'judging') => {
        switch (type) {
            case 'teams':
                return (
                    <svg className="w-80 h-64 text-indigo-600" fill="none" viewBox="0 0 240 180" stroke="currentColor" strokeWidth="1.5">
                        {/* Connected team cluster layout */}
                        <circle cx="120" cy="50" r="16" fill="#f5f3ff" stroke="#6366f1" strokeWidth="2" />
                        <circle cx="60" cy="120" r="16" fill="#f5f3ff" stroke="#4f46e5" strokeWidth="2" />
                        <circle cx="180" cy="120" r="16" fill="#f5f3ff" stroke="#4f46e5" strokeWidth="2" />
                        
                        {/* Network Connector Lines */}
                        <path d="M 108 60 L 72 110" stroke="#818cf8" strokeDasharray="3 3" />
                        <path d="M 132 60 L 168 110" stroke="#818cf8" strokeDasharray="3 3" />
                        <path d="M 76 120 L 164 120" stroke="#ced4da" />

                        {/* Tiny code symbols on nodes */}
                        <path d="M 116 46 L 120 54 M 124 46 L 120 54" stroke="#6366f1" strokeLinecap="round"/>
                        <circle cx="60" cy="120" r="4" fill="#10b981" />
                        <circle cx="180" cy="120" r="4" fill="#3b82f6" />
                    </svg>
                );
            case 'milestones':
                return (
                    <svg className="w-80 h-64 text-indigo-600" fill="none" viewBox="0 0 240 180" stroke="currentColor" strokeWidth="1.5">
                        {/* Git Tree / Code Pipelines */}
                        <rect x="20" y="35" width="200" height="110" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                        
                        {/* Pipeline tracks */}
                        <line x1="40" y1="90" x2="200" y2="90" stroke="#e2e8f0" strokeWidth="3" />
                        <path d="M 80 90 Q 110 55 140 55 L 170 55" stroke="#a5b4fc" strokeWidth="2" />
                        
                        {/* Status Nodes */}
                        <circle cx="50" cy="90" r="6" fill="#4f46e5" />
                        <circle cx="110" cy="90" r="6" fill="#10b981" />
                        <circle cx="140" cy="55" r="6" fill="#6366f1" />
                        <circle cx="180" cy="90" r="6" fill="#e2e8f0" stroke="#cbd5e1" />
                        
                        {/* Success Badge check */}
                        <rect x="75" y="115" width="90" height="18" rx="4" fill="#ecfdf5" stroke="#a7f3d0" />
                        <circle cx="85" cy="124" r="4" fill="#10b981" />
                        <line x1="98" y1="124" x2="155" y2="124" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'judging':
                return (
                    <svg className="w-80 h-64 text-indigo-600" fill="none" viewBox="0 0 240 180" stroke="currentColor" strokeWidth="1.5">
                        {/* Score Board and Evaluation Metrics */}
                        <rect x="40" y="30" width="160" height="120" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                        
                        {/* Metric Row 1 */}
                        <line x1="60" y1="60" x2="110" y2="60" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                        <line x1="130" y1="60" x2="180" y2="60" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                        <line x1="130" y1="60" x2="170" y2="60" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />
                        
                        {/* Metric Row 2 */}
                        <line x1="60" y1="90" x2="100" y2="90" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                        <line x1="130" y1="90" x2="180" y2="90" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                        <line x1="130" y1="90" x2="175" y2="90" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />

                        {/* Metric Row 3 */}
                        <line x1="60" y1="120" x2="115" y2="120" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                        <line x1="130" y1="120" x2="180" y2="120" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                        <line x1="130" y1="120" x2="155" y2="120" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                );
        }
    };

    return (
        <div className="w-full py-8 md:py-16 px-4 bg-slate-50 font-sans">
            
            {/* Embedded Container designed to sit cleanly inside Header/Footer Layout */}
            <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[620px]">
                
                {/* LEFT SIDE: Sliding Dual-Form Panel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 bg-white">
                    
                    {/* Master Card Frame with custom overflow handler */}
                    <div className="w-full max-w-sm overflow-hidden relative py-2">
                        
                        {/* Header Details */}
                        <div className="flex flex-col items-center mb-8">
                            <div
                              className="rounded-md flex items-center justify-center mb-2"
                              style={{ width: 40, height: 40, background: colors.accent }}
                            >
                              <Sparkles size={24} color="#fff" />
                            </div>
                            <span style={{ fontFamily: fonts.heading, color: colors.text, fontWeight: 700, fontSize: 24 }}>
                                        Hackathon<span style={{ color: colors.accent }}>Manager</span>
                                      </span>
                            <p className="text-slate-500 text-xs mt-1">Plateforme d'Innovation Unifiée</p>
                        </div>

                        {/* Dual Form Container with Slide Animation */}
                        <div 
                            className="flex transition-transform duration-500 ease-out" 
                            style={{ 
                                width: '200%', 
                                transform: isLogin ? 'translateX(0%)' : 'translateX(-50%)' 
                            }}
                        >
                            
                            {/* COMPONENT 1: LOGIN FORM PANEL */}
                            <div className="w-1/2 pr-4 pl-0.5">
                                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Bienvenue</h2>
                                <p className="text-slate-500 text-xs mb-5">Connectez-vous pour reprendre votre session</p>

                                {loginError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs mb-4">
                                        {loginError}
                                    </div>
                                )}

                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Adresse Email</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="hacker@hackspark.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mot de Passe</label>
                                        <input 
                                            type="password" 
                                            required
                                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isLoggingIn}
                                        className="w-full py-2.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                    >
                                        {isLoggingIn ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : 'Entrer sur la plateforme'}
                                    </button>
                                </form>

                                <p className="text-center text-xs text-slate-500 mt-6">
                                    N'avez-vous pas de compte ?{' '}
                                    <button 
                                        onClick={() => setIsLogin(false)}
                                        className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors focus:outline-none"
                                    >
                                        Créer un profil
                                    </button>
                                </p>
                            </div>

                            {/* COMPONENT 2: REGISTER FORM PANEL */}
                            <div className="w-1/2 pl-4 pr-0.5">
                                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Inscription</h2>
                                <p className="text-slate-500 text-xs mb-5">Créer un compte pour l'événement</p>

                                {regError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-xs mb-4">
                                        {regError}
                                    </div>
                                )}

                                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Nom d'utilisateur
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="john_doe"
                                            value={regUsername}
                                            onChange={(e) => setRegUsername(e.target.value)}
                                        />
                                        </div>
                                    <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Prénom
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="John"
                                            value={regFirstName}
                                            onChange={(e) => setRegFirstName(e.target.value)}
                                        />
                                    </div> 
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Nom
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="Doe"
                                            value={regLastName}
                                            onChange={(e) => setRegLastName(e.target.value)}
                                        />
                                    </div> 
                                    </div>      
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Addresse Email</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="ada@dev.com"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mot de Passe</label>
                                        <input 
                                            type="password" 
                                            required
                                            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="Min 8 characters"
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmer le Mot de Passe</label>
                                        <input 
                                            type="password" 
                                            required
                                            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-sm"
                                            placeholder="Retype password"
                                            value={regConfirmPassword}
                                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isRegistering}
                                        className="w-full py-2.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                    >
                                        {isRegistering ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Création du compte...
                                            </>
                                        ) : 'Créer mon compte'}
                                    </button>
                                </form>

                                <p className="text-center text-xs text-slate-500 mt-5">
                                    Déjà inscrit?{' '}
                                    <button 
                                        onClick={() => setIsLogin(true)}
                                        className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors focus:outline-none"
                                    >
                                        Connectez-vous ici
                                    </button>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Animated Showcase & Info Carousel (Light Mode Setup) */}
                <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative bg-gradient-to-tr from-slate-50 via-indigo-50/30 to-violet-50/50 border-l border-slate-100 overflow-hidden">
                    
                    {/* Grid Ambient Accents adapted for high-contrast light setup */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-40"></div>

                    {/* Accent subtle light blur elements */}
                    <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-200/40 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-violet-200/40 rounded-full blur-[100px]"></div>

                    {/* Visual Content Wrapper */}
                    <div className="my-auto flex flex-col items-center relative z-10">
                        
                        {/* Carousel Graphics with Active State Transitions */}
                        <div className="h-64 flex items-center justify-center relative">
                            {CAROUSEL_SLIDES.map((slide, index) => (
                                <div 
                                    key={slide.id}
                                    className={`absolute transition-all duration-700 ease-in-out transform ${
                                        index === currentSlide 
                                            ? 'opacity-100 scale-100 translate-y-0' 
                                            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                                    }`}
                                >
                                    {renderSlideGraphic(slide.graphicType)}
                                </div>
                            ))}
                        </div>

                        {/* Carousel Card Slider Content */}
                        <div className="text-center max-w-sm mt-4">
                            
                            {/* Slide Indicator Tag */}
                            <div className="inline-block px-2.5 py-0.5 mb-3 text-[9px] font-black tracking-widest text-indigo-700 bg-indigo-100/70 border border-indigo-200 rounded-full uppercase">
                                {CAROUSEL_SLIDES[currentSlide].badge}
                            </div>

                            {/* Carousel Title & Description */}
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight h-12 flex items-center justify-center">
                                {CAROUSEL_SLIDES[currentSlide].title}
                            </h3>
                            
                            <p className="text-slate-500 text-xs leading-relaxed mt-2">
                                {CAROUSEL_SLIDES[currentSlide].description}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Dot indicators */}
                    <div className="flex justify-center gap-2 relative z-10 mt-auto">
                        {CAROUSEL_SLIDES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'w-7 bg-indigo-600' 
                                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                                }`}
                            ></button>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
}