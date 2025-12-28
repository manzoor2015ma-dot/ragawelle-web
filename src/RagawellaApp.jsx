import React, { useState, useEffect } from 'react';
import {
    Mic,
    Music,
    Headphones,
    Settings,
    Users,
    ChevronRight,
    Menu,
    X,
    Play,
    MapPin,
    Mail,
    Phone,
    Instagram,
    Twitter,
    Facebook,
    Clock,
    CheckCircle2,
    Zap,
    Volume2,
    Cpu,
    Layers,
    Guitar,
    Info,
    Star,
    Sparkles,
    Trophy,
    Send,
    Smartphone,
    Wand2,
    Loader2
} from 'lucide-react';

const RagawellaApp = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Gemini AI State
    const [aiInput, setAiInput] = useState("");
    const [aiResult, setAiResult] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // Magenta Theme Color from Screenshot
    const themeColor = "#c40860";
    const apiKey = ""; // Wird von der Umgebung bereitgestellt

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Gemini API Call with Exponential Backoff
    const callGemini = async (prompt, retryCount = 0) => {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: {
                        parts: [{ text: "Du bist ein erfahrener Songwriter und Musikproduzent im RagaWelle Studio Magdeburg. Antworte in kreativem Deutsch mit Studio-Slang (Bretter, Abriss, Mische, Recorden, fette Hook). Erstelle Songideen mit Titel, Hook-Konzept und Vibe-Check." }]
                    }
                })
            });

            if (!response.ok) {
                if (response.status === 429 && retryCount < 5) {
                    const delay = Math.pow(2, retryCount) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return callGemini(prompt, retryCount + 1);
                }
                throw new Error('API-Anfrage fehlgeschlagen');
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
        } catch (err) {
            if (retryCount < 5) {
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return callGemini(prompt, retryCount + 1);
            }
            throw err;
        }
    };

    const handleGenerateIdea = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        setIsAiLoading(true);
        setAiError(null);
        setAiResult(null);

        const prompt = `Erstelle ein Song-Konzept für das Thema/Genre: ${aiInput}.`;

        try {
            const result = await callGemini(prompt);
            setAiResult(result);
        } catch (err) {
            setAiError("Sorry Digga, die KI hat gerade Sendepause. Versuchs gleich nochmal!");
        } finally {
            setIsAiLoading(false);
        }
    };

    const navLinks = [
        { name: 'Studios', href: '#studios' },
        { name: 'Services', href: '#services' },
        { name: 'KI-Vibe ✨', href: '#ai-generator' },
        { name: 'Preise', href: '#pricing' },
        { name: 'Kontakt', href: '#contact' },
    ];

    const services = [
        { title: 'Recorden', icon: <Mic className="w-8 h-8" />, desc: 'Wir ziehen deine Vocals und Instrumente so clean, dass es im Ohr kitzelt.' },
        { title: 'Die Mische', icon: <Settings className="w-8 h-8" />, desc: 'Fette Mische mit ordentlich Druck, damit dein Track im Club alles abreißt.' },
        { title: 'Der Schliff', icon: <Headphones className="w-8 h-8" />, desc: 'High-End Mastering. Wir machen dein Ding radio-ready und Spotify-tauglich.' },
        { title: 'Beat Bau', icon: <Music className="w-8 h-8" />, desc: 'Zusammen mit unseren Killa-Produzenten basteln wir dir dein nächstes Brett.' },
    ];

    const equipment = [
        { title: 'Mics', icon: <Mic className="w-6 h-6" />, desc: 'Vom Röhren-Klassiker bis zum modernen High-End Mic – purer Gold-Sound.' },
        { title: 'Preamps & Krams', icon: <Cpu className="w-6 h-6" />, desc: 'Interfaces und Wandler, die jedes Signal veredeln.' },
        { title: 'Monitoring', icon: <Volume2 className="w-6 h-6" />, desc: 'Ehrlicher Sound im akustisch optimierten Raum.' },
        { title: 'Kopfhörer', icon: <Headphones className="w-6 h-6" />, desc: 'Präziser Cue-Mix für maximale Performance beim Einsingen.' },
        { title: 'DAW & Plugins', icon: <Layers className="w-6 h-6" />, desc: 'Alles am Start, was in der Industrie gerade State-of-the-art ist.' },
        { title: 'Amps & Klampfen', icon: <Guitar className="w-6 h-6" />, desc: 'Vielseitiges Arsenal für spontane Sessions und kreative Ausbrüche.' },
    ];

    const coreRates = [
        { name: "Session (Self)", price: "€35/h", detail: "Zieh dein Ding alleine durch (Min. 2h).", icon: <Clock size={18} /> },
        { name: "Pro-Recording", price: "€60/h", detail: "Inklusive Engineer, der dein Signal poliert.", icon: <Mic size={18} /> },
        { name: "Full Day Abriss", price: "€390", detail: "8 Stunden volle Power inkl. Engineer.", icon: <Zap size={18} /> },
        { name: "Mixing (Basic)", price: "€200/Song", detail: "Bis zu 30 Spuren, inkl. 2 Revisions-Runden.", icon: <Settings size={18} /> },
        { name: "Mastering Snapper", price: "€50/Song", detail: "Das finale Finish für alle Plattformen.", icon: <Trophy size={18} /> },
        { name: "Voiceover & Pods", price: "€70/h", detail: "Inkl. RX-Cleanup für kristallklare Stimmen.", icon: <Volume2 size={18} /> },
    ];

    const bundlePackets = [
        {
            category: "Bundles",
            name: "Single-Song Schnapper",
            price: "€249",
            details: "Das Rundum-Sorglos Paket: 3h Recorden, präzises Tuning sowie die volle Mische & Mastering.",
            tag: "Beliebt",
            highlighted: true,
            icon: <Star className="w-5 h-5" />
        },
        {
            category: "Bundles",
            name: "Das Killa-Paket",
            price: "€700",
            details: "4h intensive Recording- & Produktionszeit, gefolgt von einem Full-Service Mix & Master für den ultimativen Chart-Sound.",
            tag: "Premium",
            highlighted: true,
            icon: <Sparkles className="w-5 h-5" />
        },
        { category: "Bundles", name: "EP-Marathon (8h)", price: "€360", details: "2-3 Dinger einrappen und die Rohmixe direkt eintüten." },
        { category: "Bundles", name: "Full Production", price: "ab €300", details: "Vom ersten Beat-Entwurf bis zum fertigen Master." },
        { category: "Bundles", name: "10h Flex-Card", price: "€520", details: "Prepaid-Guthaben für flexible Sessions. Stabiles Geschenk." },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#c40860] selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src="https://i.imgur.com/3vddARu.png"
                            alt="Ragawella Logo"
                            className="h-16 w-16 md:h-24 md:w-24 rounded-full border-2 border-white/20 object-cover hover:scale-110 transition-all duration-300 cursor-pointer shadow-xl shadow-[#c40860]/20"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold uppercase tracking-widest hover:text-[#c40860] transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <button className="bg-[#c40860] text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all transform hover:scale-105">
                            Anfragen
                        </button>
                    </div>

                    <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-10 z-40 animate-in fade-in duration-300">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-4xl font-black uppercase tracking-tighter hover:text-[#c40860] transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <button className="bg-[#c40860] text-white px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-wider shadow-2xl shadow-[#c40860]/40">
                            Jetzt Buchen
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-end justify-center overflow-hidden text-center pb-20 md:pb-32">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10" />
                    <img
                        src="https://i.imgur.com/arygzcT.jpeg"
                        className="w-full h-full object-cover opacity-100 scale-105 animate-slow-zoom brightness-110"
                        alt="Ragawella Studio Atmosphäre"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"; }}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-6xl mx-auto flex flex-col items-center">
                        <h1 className="hero-text-3d text-4xl md:text-6xl lg:text-[5rem] font-black leading-[1] tracking-tighter mb-4 uppercase text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                            DEIN SOUND.<br />
                            <span className="relative inline-block">
                                <span className="text-[#c40860] italic">RICHTIGER ABRISS.</span>
                                <span className="absolute -inset-1 blur-xl bg-[#c40860]/10 -z-10 rounded-full"></span>
                            </span>
                        </h1>

                        <p className="text-xs md:text-lg text-gray-100 mb-8 max-w-2xl font-bold tracking-tight leading-snug glass-text p-3 px-6 rounded-xl shadow-2xl">
                            RagaWelle ist das Headquarter für High-End Mucke.<br />
                            <span className="text-white text-base md:text-xl">Wir basteln keine 08/15-Tracks – wir ballern Bretter für die Ewigkeit.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto px-10 sm:px-0 mb-4">
                            <button className="group relative bg-[#c40860] text-white px-10 py-4 rounded-xl font-black text-sm uppercase overflow-hidden transition-all transform hover:scale-105 active:scale-95 shadow-[0_5px_25px_-5px_rgba(0,0,0,0.6)]">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Studio klarmachen <ChevronRight size={18} />
                                </span>
                                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10"></div>
                            </button>

                            <button className="group border border-white/40 backdrop-blur-md bg-black/30 hover:bg-[#c40860] hover:border-[#c40860] px-10 py-4 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                                <Play size={18} className="fill-white group-hover:fill-white" />
                                <span>Showreel checken</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Gemini AI Song Idea Generator */}
            <section id="ai-generator" className="py-20 md:py-24 bg-[#080808] border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h2 className="text-[#c40860] text-sm font-black uppercase tracking-[0.4em] mb-4">Inspiration auf Knopfdruck</h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-tight">KI SONG-CONCEPT <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c40860] to-white italic">GENERATOR ✨</span></h3>
                            <p className="text-gray-400 text-lg mb-10 max-w-xl">
                                Kreative Blockade? Kein Stress. Unsere hauseigene KI bastelt dir die Hook und das Vibe-Konzept für dein nächstes Brett – natürlich im RagaWelle-Style.
                            </p>

                            <form onSubmit={handleGenerateIdea} className="relative group">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="Thema (z.B. Herzschmerz, Club-Abriss, 80er-Synth)..."
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-8 py-6 pr-40 focus:outline-none focus:border-[#c40860] transition-all font-medium text-lg placeholder:text-gray-600"
                                />
                                <button
                                    disabled={isAiLoading}
                                    className="absolute right-3 top-3 bottom-3 bg-[#c40860] text-white px-8 rounded-xl font-black uppercase text-sm flex items-center gap-3 hover:bg-white hover:text-black transition-all disabled:opacity-50"
                                >
                                    {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                                    <span>Ballern ✨</span>
                                </button>
                            </form>
                        </div>

                        <div className="relative min-h-[300px] flex items-center justify-center p-8 bg-black/50 border border-white/10 rounded-[2.5rem] backdrop-blur-md overflow-hidden">
                            {!aiResult && !isAiLoading && !aiError && (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#c40860]/10 rounded-full flex items-center justify-center text-[#c40860] mx-auto mb-6">
                                        <Music size={32} />
                                    </div>
                                    <p className="text-gray-500 font-bold italic tracking-wide uppercase">Gib ein Thema ein und lass es krachen...</p>
                                </div>
                            )}

                            {isAiLoading && (
                                <div className="text-center animate-pulse">
                                    <Sparkles size={48} className="text-[#c40860] mx-auto mb-6 animate-bounce" />
                                    <p className="text-[#c40860] font-black uppercase tracking-widest">Die KI mischt gerade dein Brett...</p>
                                </div>
                            )}

                            {aiError && (
                                <div className="text-center text-red-500 bg-red-500/10 p-8 rounded-3xl border border-red-500/20">
                                    <Info size={32} className="mx-auto mb-4" />
                                    <p className="font-bold">{aiError}</p>
                                </div>
                            )}

                            {aiResult && (
                                <div className="w-full text-left animate-in slide-in-from-bottom duration-500">
                                    <div className="flex items-center gap-3 text-[#c40860] mb-6">
                                        <Zap size={24} fill="currentColor" />
                                        <span className="font-black uppercase tracking-[0.2em] text-sm">Das nächste RagaWelle-Brett</span>
                                    </div>
                                    <div className="text-gray-200 font-medium whitespace-pre-wrap leading-relaxed text-lg bg-white/5 p-6 rounded-2xl border border-white/5 max-h-[400px] overflow-y-auto no-scrollbar">
                                        {aiResult}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-[#111] border-y border-white/5 py-10 md:py-12">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { label: 'Studio Suites', val: '04' },
                        { label: 'Goldene Platten', val: '12' },
                        { label: 'Jahre am Start', val: '15+' },
                        { label: 'Künstler betreut', val: '2K' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <div className="text-[#c40860] text-3xl md:text-4xl font-black">{stat.val}</div>
                            <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Studios Showcase */}
            <section id="studios" className="py-20 md:py-24 bg-[#0a0a0a]">
                <div className="container mx-auto px-6 text-left">
                    <div className="mb-12 md:mb-16">
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 uppercase text-white leading-none">DIE SUITES</h2>
                        <div className="w-20 h-1.5 md:w-24 md:h-2 bg-[#c40860]"></div>
                    </div>

                    <div className="space-y-20 md:space-y-24">
                        <div className="flex flex-col lg:flex-row gap-10 md:gap-12 items-center">
                            <div className="w-full lg:w-2/3 aspect-video bg-[#222] overflow-hidden rounded-2xl group relative border border-white/5 shadow-2xl">
                                <img
                                    src="https://i.imgur.com/i0qj0Jk.jpeg"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt="Studio A Innenansicht"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                            </div>
                            <div className="w-full lg:w-1/3 text-left">
                                <span className="text-[#c40860] font-black text-lg md:text-xl mb-2 block tracking-widest uppercase italic">STUDIO A</span>
                                <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 uppercase text-white">Das Flaggschiff</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    Ausgestattet mit einer SSL Duality Konsole und Custom Augspurger Monitoren. Studio A ist das Nonplusultra für Tracking und Mixing.
                                </p>
                                <ul className="space-y-3 md:space-y-4 mb-8">
                                    {['SSL Duality Delta 48', 'Augspurger Duo 15', 'Pro Tools Ultimate', 'Legendary Gear'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-300">
                                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#c40860] rounded-full"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="text-white text-xs md:text-sm border-b-2 border-[#c40860] pb-1 font-black uppercase tracking-widest hover:text-[#c40860] transition-colors">
                                    Details abchecken
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-20 md:py-24 bg-black overflow-hidden">
                <div className="container mx-auto px-6 text-left">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="text-left">
                            <h2 className="text-[#c40860] text-sm font-black uppercase tracking-[0.4em] mb-4">Unser Craft</h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">SERVICES</h3>
                        </div>
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="bg-[#c40860]/10 text-[#c40860] px-3 py-1.5 rounded-full flex items-center gap-2 font-black text-[10px] uppercase animate-pulse">
                                <Smartphone size={14} /> Swipe den Vibe
                            </div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                        {services.map((service, i) => (
                            <div
                                key={i}
                                className="flex-none w-[280px] md:w-auto snap-center group p-10 border border-white/10 hover:border-[#c40860] bg-[#080808] transition-all duration-500 cursor-default text-left rounded-3xl md:rounded-2xl"
                            >
                                <div className="text-[#c40860] mb-8 transform group-hover:scale-110 transition-transform duration-500">
                                    {service.icon}
                                </div>
                                <h4 className="text-2xl font-black mb-4 tracking-tight uppercase text-white leading-none italic">{service.title}</h4>
                                <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors leading-relaxed font-medium">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Studio & Equipment Section */}
            <section id="equipment" className="py-20 md:py-24 bg-[#080808] border-t border-white/5">
                <div className="container mx-auto px-6 text-left">
                    <div className="max-w-3xl mb-12 md:mb-16">
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 uppercase text-white leading-tight">
                            STUDIO & <span className="text-[#c40860]">TECHNIK</span>
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg font-medium italic">
                            Vollständige Liste auf Anfrage. Nur stabiles Gear.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {equipment.map((item, i) => (
                            <div
                                key={i}
                                className="group p-10 md:p-12 bg-black border border-white/5 hover:border-[#c40860]/30 transition-all duration-500 text-left"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#c40860]/10 rounded-full flex items-center justify-center text-[#c40860] mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-black uppercase mb-4 tracking-tight text-white leading-none">{item.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors font-medium">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 md:py-24 bg-black border-t border-white/5 overflow-hidden">
                <div className="container mx-auto px-6 text-left">
                    <div className="text-left mb-12 md:mb-16">
                        <h2 className="text-[#c40860] text-sm font-black uppercase tracking-[0.4em] mb-4">Investition</h2>
                        <h3 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">PREISE & <span className="text-[#c40860]">DEALS</span></h3>
                    </div>

                    {/* Core Rates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20 md:mb-24">
                        {coreRates.map((rate, i) => (
                            <div key={i} className="group flex items-center gap-5 md:gap-6 p-6 md:p-8 bg-[#080808] border border-white/5 hover:border-[#c40860]/50 transition-all duration-500 rounded-[2rem] text-left shadow-lg">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 group-hover:bg-[#c40860]/10 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#c40860] transition-colors shrink-0 shadow-lg">
                                    {rate.icon}
                                </div>
                                <div>
                                    <h4 className="text-[10px] md:text-sm font-black uppercase tracking-widest text-gray-500 group-hover:text-white mb-1 transition-colors">
                                        {rate.name}
                                    </h4>
                                    <div className="text-xl md:text-2xl font-black text-white group-hover:text-[#c40860] tracking-tighter mb-1 transition-colors">
                                        {rate.price}
                                    </div>
                                    <p className="text-[9px] md:text-[11px] font-bold text-gray-600 uppercase tracking-widest leading-none">
                                        {rate.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar -mx-6 px-6">
                        {bundlePackets.map((pkg, i) => (
                            <div
                                key={i}
                                className={`flex-none w-[300px] md:w-[420px] p-10 md:p-12 rounded-[2.5rem] snap-center transition-all duration-700 flex flex-col justify-between group
                ${pkg.highlighted
                                        ? 'bg-gradient-to-br from-[#c40860] to-[#900647] text-white shadow-2xl shadow-[#c40860]/30 scale-[1.02] z-10 border-none'
                                        : 'bg-[#0a0a0a] border border-white/10 text-white hover:border-[#c40860] hover:bg-[#0d0d0d]'
                                    }`}
                            >
                                <div className="text-left">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${pkg.highlighted ? 'bg-black/20 text-white' : 'bg-white/5 text-gray-500'}`}>
                                            {pkg.icon ? pkg.icon : <Layers size={14} />}
                                            {pkg.category}
                                        </div>
                                        {pkg.tag && (
                                            <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-sm
                        ${pkg.highlighted ? 'bg-white text-[#c40860]' : 'bg-[#c40860] text-white'}`}>
                                                {pkg.tag}
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tighter leading-[0.9] italic">{pkg.name}</h4>
                                    <div className={`text-5xl md:text-6xl font-black tracking-tighter mb-8 ${pkg.highlighted ? 'text-white' : 'text-[#c40860]'}`}>
                                        {pkg.price}
                                    </div>
                                    <p className={`text-sm md:text-base font-medium leading-relaxed mb-12 ${pkg.highlighted ? 'text-white/80' : 'text-gray-400'}`}>
                                        {pkg.details}
                                    </p>
                                </div>

                                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all text-xs md:text-sm transform group-hover:-translate-y-1
                  ${pkg.highlighted
                                        ? 'bg-white text-[#c40860] hover:bg-black hover:text-white shadow-xl'
                                        : 'border-2 border-white/20 text-white hover:border-[#c40860] hover:text-[#c40860]'
                                    }`}
                                >
                                    Paket Anfragen
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kontakt & Standort */}
            <section id="contact" className="py-20 md:py-24 bg-[#080808] border-t border-white/5">
                <div className="container mx-auto px-6 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div className="w-full h-[400px] md:h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-[#c40860]/5 pointer-events-none z-10"></div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2433.883733051443!2d11.626451077227447!3d52.127413065159194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47af608249852f8d%3A0xc3d5b06822a96753!2sLeibnizstra%C3%9Fe%2025%2C%2039104%20Magdeburg!5e0!3m2!1sde!2sde!4v1735368523030!5m2!1sde!2sde"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(1)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="RagaWelle Location"
                            ></iframe>
                            <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-[#c40860]/30 z-20 hidden md:block text-left text-white">
                                <h5 className="font-black uppercase tracking-widest text-xs mb-2 italic text-[#c40860]">Anfahrt</h5>
                                <p className="text-gray-400 text-sm font-medium">Leibnizstraße 25<br />39104 Magdeburg</p>
                            </div>
                        </div>

                        <div className="text-left">
                            <h2 className="text-[#c40860] text-sm font-black uppercase tracking-[0.4em] mb-4">Bereit für deine Session?</h2>
                            <h3 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-12 leading-none text-white">KONTAKT <br />AUFNEHMEN</h3>

                            <form className="space-y-4 md:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4 text-left block">Name</label>
                                        <input type="text" placeholder="VOR- & NACHNAME" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c40860] transition-colors font-medium text-white text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4 text-left block">Email</label>
                                        <input type="email" placeholder="DEINE@MAIL.DE" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c40860] transition-colors font-medium text-white text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4 text-left block">Dein Vorhaben</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c40860] transition-colors font-medium text-white appearance-none text-sm">
                                        <option className="bg-black">RECORDING / TRACKING</option>
                                        <option className="bg-black">DIE MISCHE & MASTERING</option>
                                        <option className="bg-black">FULL SONG PACKAGE</option>
                                        <option className="bg-black">SONSTIGER ABRISS</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4 text-left block">Nachricht</label>
                                    <textarea rows="4" placeholder="Schreib uns kurz von deinem Projekt..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#c40860] transition-colors font-medium text-white resize-none text-sm"></textarea>
                                </div>
                                <button className="w-full bg-[#c40860] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-xl shadow-[#c40860]/20 transform active:scale-95 text-xs md:text-sm">
                                    Anfrage Senden <Send size={18} />
                                </button>
                            </form>

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5 text-left">
                                <div>
                                    <h6 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c40860] mb-3">Direct Line</h6>
                                    <p className="font-black text-white text-lg md:text-xl">+49 155 6551 7800</p>
                                </div>
                                <div>
                                    <h6 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c40860] mb-3 text-left">Schreib uns</h6>
                                    <p className="font-black text-white text-lg md:text-xl underline italic">info@ragawelle.de</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-24 bg-[#c40860]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-white text-4xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-[0.8]">
                        BEREIT FÜR DEINEN <br />NÄCHSTEN HIT?
                    </h2>
                    <button className="bg-white text-[#c40860] px-10 py-5 md:px-12 md:py-6 rounded-full font-black text-lg md:text-2xl uppercase tracking-tighter hover:bg-black hover:text-white transition-all transform hover:scale-105 shadow-2xl">
                        Jetzt Session buchen
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black pt-20 md:pt-24 pb-12 border-t border-white/5 text-left">
                <div className="container mx-auto px-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 lg:col-span-1">
                            <div className="mb-8">
                                <img
                                    src="https://i.imgur.com/3vddARu.png"
                                    alt="Ragawella Logo"
                                    className="h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-[#c40860] object-cover shadow-xl shadow-black"
                                />
                            </div>
                            <p className="text-gray-500 mb-8 leading-relaxed font-medium text-sm text-left">
                                Wir heben Deinen Sound auf ein neues Level – durch Präzision, Leidenschaft und modernste Technik. Join the RagaWelle legacy.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="p-2 border border-white/10 rounded-full hover:border-[#c40860] hover:text-[#c40860] transition-all"><Instagram size={18} /></a>
                                <a href="#" className="p-2 border border-white/10 rounded-full hover:border-[#c40860] hover:text-[#c40860] transition-all"><Twitter size={18} /></a>
                                <a href="#" className="p-2 border border-white/10 rounded-full hover:border-[#c40860] hover:text-[#c40860] transition-all"><Facebook size={18} /></a>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-black uppercase tracking-widest text-sm mb-8 text-[#c40860]">Navigation</h5>
                            <ul className="space-y-4 text-white">
                                {navLinks.map(link => (
                                    <li key={link.name}><a href={link.href} className="text-gray-400 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">{link.name}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-black uppercase tracking-widest text-sm mb-8 text-[#c40860]">Kontakt</h5>
                            <ul className="space-y-6 text-sm">
                                <li className="flex items-start gap-4">
                                    <MapPin size={20} className="text-[#c40860] shrink-0" />
                                    <div className="text-gray-400 font-medium text-left">
                                        <span className="block font-black text-white uppercase tracking-wider mb-1">RagaWelle GmbH</span>
                                        Leibnizstraße 25,<br />39104 Magdeburg
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Phone size={20} className="text-[#c40860] shrink-0" />
                                    <span className="text-gray-400 font-medium">+49 155 6551 7800</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Mail size={20} className="text-[#c40860] shrink-0" />
                                    <span className="text-gray-400 font-medium underline italic">info@ragawelle.de</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-black uppercase tracking-widest text-sm mb-8 text-[#c40860]">Newsletter</h5>
                            <p className="text-gray-500 text-xs mb-6 uppercase font-bold tracking-wider leading-relaxed text-left">Immer Up-to-Date bleiben.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="DEINE E-MAIL"
                                    className="bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs w-full focus:outline-none focus:border-[#c40860] text-white font-medium"
                                />
                                <button className="bg-[#c40860] text-white p-3 rounded-xl font-bold hover:bg-white transition-colors">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-gray-600 text-[9px] uppercase font-bold tracking-[0.3em]">
                            © 2025 RagaWelle GmbH. ALLE RECHTE VORBEHALTEN.
                        </div>
                        <div className="flex gap-8 text-gray-600 text-[9px] uppercase font-bold tracking-[0.3em]">
                            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
                            <a href="#" className="hover:text-white transition-colors">Impressum & AGB</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <button className="bg-[#c40860] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group shadow-[#c40860]/40">
                    <Mail className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
        .hero-text-3d {
          text-shadow: 
            0 1px 0 #900647,
            0 2px 0 #7a053c,
            0 3px 0 #640431,
            0 4px 0 #4e0326;
        }
        .glass-text {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        ::selection {
          background-color: #c40860;
          color: white;
        }
        html {
          scroll-behavior: smooth;
        }
      ` }} />
        </div>
    );
};

export default RagawellaApp;
