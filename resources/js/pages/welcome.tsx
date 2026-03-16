import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { useState, useEffect } from 'react';
import { 
    Code2, 
    Globe, 
    Rocket, 
    Users, 
    ArrowRight, 
    CheckCircle,
    Menu,
    X,
    Github,
    Twitter,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    ChevronRight
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="ITGen - Communauté Tech à Fianarantsoa">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700|space-grotesk:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#111111]">
                
                {/* Navigation fixe */}
                <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md shadow-md py-3' 
                        : 'bg-transparent py-5'
                }`}>
                    <nav className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                IT
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                                ITGen
                            </span>
                        </Link>

                        {/* Menu Desktop */}
                        <div className="hidden lg:flex items-center gap-8">
                            <a href="#accueil" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Accueil</a>
                            <a href="#a-propos" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">À propos</a>
                            <a href="#services" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Services</a>
                            <a href="#contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Contact</a>
                        </div>

                        {/* Boutons Auth Desktop */}
                        <div className="hidden lg:flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                                >
                                    Tableau de bord
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                    >
                                        Connexion
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Rejoindre
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Menu Burger Mobile */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden text-gray-700 dark:text-gray-200"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </nav>

                    {/* Menu Mobile */}
                    {isMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 shadow-lg py-4">
                            <div className="container mx-auto px-4 flex flex-col gap-4">
                                <a href="#accueil" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Accueil</a>
                                <a href="#a-propos" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>À propos</a>
                                <a href="#services" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Services</a>
                                <a href="#contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-2" onClick={() => setIsMenuOpen(false)}>Contact</a>
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col gap-3">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-xl text-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Tableau de bord
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={login()}
                                                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 py-2 text-center"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Connexion
                                            </Link>
                                            {canRegister && (
                                                <Link
                                                    href={register()}
                                                    className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-xl text-center"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    Rejoindre
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Hero Section */}
                <section id="accueil" className="pt-32 lg:pt-40 pb-20 lg:pb-32">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1 text-center lg:text-left">
                                <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
                                    🌍 Communauté Tech à Fianarantsoa
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                                        ITGen
                                    </span>
                                    <br />
                                    <span className="text-gray-900 dark:text-white">
                                        La nouvelle génération IT
                                    </span>
                                </h1>
                                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                                    ITGen (Next Generation Information Technology) est une communauté de jeunes passionnés de technologie à Fianarantsoa. Nous travaillons à former, connecter et inspirer la nouvelle génération de développeurs, ingénieurs et innovateurs IT à Madagascar.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={register()}
                                        className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                                    >
                                        Rejoindre la communauté
                                        <ArrowRight size={20} />
                                    </Link>
                                    <a
                                        href="#services"
                                        className="border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-600 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-xl font-medium text-lg transition-all inline-flex items-center justify-center"
                                    >
                                        Découvrir nos services
                                    </a>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Users className="w-8 h-8 text-blue-600" />
                                                    <span className="font-semibold text-lg">+10 membres</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300">Une communauté active et passionnée</p>
                                            </div>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                                                <Code2 className="w-8 h-8 text-blue-600 mb-2" />
                                                <span className="font-semibold">Développement</span>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                                                <Globe className="w-8 h-8 text-green-600 mb-2" />
                                                <span className="font-semibold">Réseaux</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* À propos */}
                <section id="a-propos" className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                                    À propos
                                </span>
                                <br />
                                <span className="text-gray-900 dark:text-white">
                                    de notre communauté
                                </span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                ITGen est née de la passion commune pour la technologie et l'innovation. Nous créons un espace où les jeunes talents peuvent grandir et s'épanouir.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Former</h3>
                                <p className="text-gray-600 dark:text-gray-300">Des formations pratiques et des ateliers pour développer vos compétences</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Connecter</h3>
                                <p className="text-gray-600 dark:text-gray-300">Un réseau de professionnels et de passionnés pour échanger et collaborer</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Rocket className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Inspirer</h3>
                                <p className="text-gray-600 dark:text-gray-300">Des projets innovants et des rencontres avec des experts du domaine</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className="py-20">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                                    Nos domaines
                                </span>
                                <br />
                                <span className="text-gray-900 dark:text-white">
                                    d'expertise
                                </span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                Nous couvrons les principaux domaines de l'informatique pour vous offrir une expérience complète.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                                    <Code2 className="w-7 h-7 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">💻 Développement web</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Frontend & Backend</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Frameworks modernes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Projets pratiques</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                                    <Globe className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">🌐 Réseaux & systèmes</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Administration réseau</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Sécurité informatique</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Cloud computing</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                                    <Rocket className="w-7 h-7 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">🚀 Innovation digitale</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Startups & entrepreneuriat</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>IA & Data science</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>IoT & technologies émergentes</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500 text-white">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-5xl font-bold mb-2">15+</div>
                                <div className="text-xl opacity-90">Membres actifs</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">20+</div>
                                <div className="text-xl opacity-90">Projets réalisés</div>
                            </div>
                            <div>
                                <div className="text-5xl font-bold mb-2">4+</div>
                                <div className="text-xl opacity-90">Événements organisés</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                                    Contactez-nous
                                </span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                Rejoignez notre communauté ou posez-nous vos questions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            <div>
                                <h3 className="text-xl font-semibold mb-6">Nos coordonnées</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Adresse</p>
                                            <p className="text-gray-600 dark:text-gray-300">Fianarantsoa, Madagascar</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-gray-600 dark:text-gray-300">contact@itgen.mg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Téléphone</p>
                                            <p className="text-gray-600 dark:text-gray-300">+261 34 00 000 00</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                            <Github className="w-5 h-5" />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                            <Twitter className="w-5 h-5" />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                                <h3 className="text-xl font-semibold mb-6">Envoyez-nous un message</h3>
                                <form className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Votre nom"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Votre email"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                    <textarea
                                        placeholder="Votre message"
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                                    ></textarea>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
                                        Envoyer le message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center font-bold text-xl">
                                    IT
                                </div>
                                <span className="text-xl font-bold">ITGen</span>
                            </div>
                            <div className="text-gray-400 text-center md:text-left">
                                © 2026 ITGen. Tous droits réservés. Fianarantsoa, Madagascar
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}