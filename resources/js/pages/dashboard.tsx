import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Users, 
    UserCheck, 
    UserX, 
    DollarSign, 
    Home, 
    CreditCard, 
    FileText,
    Heart,
    MessageCircle
} from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Stats {
    users: {
        total: number;
        admins: number;
        editeurs: number;
        membres: number;
        femmes: number;
        hommes: number;
    };
    cotisations: {
        total: number;
        payees: number;
        enRetard: number;
        nombre: number;
        moyenne: number;
    };
    allocations: {
        total: number;
        approuvees: number;
        enAttente: number;
        rejetees: number;
        nombre: number;
    };
    publications: {
        total: number;
        commentaires: number;
        likes: number;
    };
    evolution: {
        cotisations: Array<{ mois: string; total: number }>;
        allocations: Array<{ mois: string; total: number }>;
    };
    topContributeurs: Array<{ nom: string; total: number }>;
    activites: Array<{ type: string; description: string; date: string; icon: string }>;
    publicationsRecentes: Array<{ id: number; auteur: string; contenu: string; date: string; likes: number; commentaires: number }>;
    polarData: Array<{ subject: string; value: number; fill: string }>;
}

interface Props {
    stats: Stats;
    userRole: string;
    userName: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

// Fonction pour formater le montant en Ariary
const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MGA',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant).replace('MGA', 'Ar');
};

// Fonction pour obtenir les initiales
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Couleurs pour le PieChart
const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function Dashboard({ stats, userRole, userName }: Props) {
    const {
        users,
        cotisations,
        allocations,
        publications,
        topContributeurs,
        activites,
        publicationsRecentes,
        polarData
    } = stats;

    // Données pour le PieChart
    const pieData = [
        { name: 'Hommes', value: users.hommes },
        { name: 'Femmes', value: users.femmes },
        { name: 'Cotisations', value: cotisations.nombre },
        { name: 'Allocations', value: allocations.nombre },
        { name: 'Publications', value: publications.total },
        { name: 'Commentaires', value: publications.commentaires },
    ].filter(item => item.value > 0); // Ne garder que les valeurs > 0

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* En-tête avec bienvenue */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Bonjour, {userName}</h1>
                        <p className="text-muted-foreground">Voici un aperçu de votre tableau de bord</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {userRole}
                        </span>
                    </div>
                </div>

                {/* Cartes de statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Utilisateurs
                                </CardTitle>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Users className="size-4 text-primary" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{users.total}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                <span className="text-muted-foreground">{users.admins} Admins</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{users.editeurs} Éditeurs</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{users.membres} Membres</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Cotisations
                                </CardTitle>
                                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                    <DollarSign className="size-4 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{formatMontant(cotisations.total)}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                <span className="text-green-600 dark:text-green-400">{cotisations.payees} payées</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-red-600 dark:text-red-400">{cotisations.enRetard} en retard</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Allocations
                                </CardTitle>
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                                    <Home className="size-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{formatMontant(allocations.total)}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                <span className="text-green-600 dark:text-green-400">{allocations.approuvees} approuvées</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-yellow-600 dark:text-yellow-400">{allocations.enAttente} en attente</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Publications
                                </CardTitle>
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                    <FileText className="size-4 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{publications.total}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                <span className="flex items-center gap-1">
                                    <Heart className="size-3 text-red-500" /> {publications.likes}
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="size-3 text-blue-500" /> {publications.commentaires}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Polar Area Chart et Top contributeurs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Polar Area Chart */}
                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Répartition des données</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value: number) => [`${value}`, 'Nombre']}
                                                contentStyle={{ 
                                                    backgroundColor: 'hsl(var(--background))', 
                                                    borderColor: 'hsl(var(--border))',
                                                    color: 'hsl(var(--foreground))'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        Aucune donnée à afficher
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {pieData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="text-muted-foreground">{item.name}:</span>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top contributeurs */}
                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Top contributeurs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {topContributeurs.map((contributeur, index) => (
                                    <div key={index} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium w-6 h-6 rounded-full flex items-center justify-center ${
                                                index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                                                index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400' :
                                                index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                                                'bg-muted text-muted-foreground'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-medium">{contributeur.nom}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-primary">
                                            {formatMontant(contributeur.total)}
                                        </span>
                                    </div>
                                ))}
                                {topContributeurs.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Aucune cotisation pour le moment
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Publications récentes */}
                <Card className="bg-white dark:bg-card border border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Publications récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {publicationsRecentes.map((pub) => (
                                <div key={pub.id} className="flex items-start gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {getInitials(pub.auteur)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold">{pub.auteur}</span>
                                            <span className="text-xs text-muted-foreground">{pub.date}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{pub.contenu}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="flex items-center gap-1 text-xs">
                                                <Heart className="size-3 text-red-500" /> {pub.likes}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs">
                                                <MessageCircle className="size-3 text-blue-500" /> {pub.commentaires}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {publicationsRecentes.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Aucune publication pour le moment
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Activités récentes */}
                <Card className="bg-white dark:bg-card border border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Activités récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activites.map((activite, index) => (
                                <div key={index} className="flex items-center gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                    <div className="text-2xl">{activite.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-sm">{activite.description}</p>
                                        <span className="text-xs text-muted-foreground">{activite.date}</span>
                                    </div>
                                </div>
                            ))}
                            {activites.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Aucune activité récente
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}