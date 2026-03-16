import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DollarSign,
    Calendar,
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    Home,
    Users,
    CreditCard,
    FileText,
    Download,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';
import AjoutCotisationModal from './modal/AjoutCotisation';
import AjoutAllocationModal from './modal/AjoutAllocation';

// Types
interface Cotisation {
    id: number;
    membre: string;
    montant: number;
    date: string;
    statut: string;
    mode: string;
    reference: string;
    user_id: number;
}

interface Allocation {
    id: number;
    membre: string;
    montant: number;
    date: string;
    type: string;
    statut: string;
    reference: string;
    user_id: number;
}

interface User {
    id: number;
    full_name: string;
}

interface Stats {
    totalCotisations: number;
    totalAllocations: number;
    cotisationsPayees: number;
    cotisationsEnRetard: number;
    allocationsApprouvees: number;
    allocationsEnAttente: number;
    totalCotisationsCount: number;
    totalAllocationsCount: number;
}

interface Props {
    cotisations: Cotisation[];
    allocations: Allocation[];
    users: User[];
    stats: Stats;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cotisations',
        href: '/cotisation',
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

// Fonction pour obtenir la couleur du statut
const getStatutStyle = (statut: string) => {
    const styles: Record<string, string> = {
        'Payé': 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30',
        'En retard': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30',
        'Approuvé': 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30',
        'En attente': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30',
        'Rejeté': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30',
    };
    return styles[statut] || 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500/30';
};

export default function Cotisation({ cotisations, allocations, users, stats }: Props) {
    const [searchMembre, setSearchMembre] = useState('');
    const [searchAllocation, setSearchAllocation] = useState('');
    const [activeTab, setActiveTab] = useState('cotisations');
    const [isCotisationModalOpen, setIsCotisationModalOpen] = useState(false);
    const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

    // Filtrer les cotisations des membres
    const filteredCotisations = cotisations.filter(cotisation =>
        cotisation.membre.toLowerCase().includes(searchMembre.toLowerCase()) ||
        cotisation.reference.toLowerCase().includes(searchMembre.toLowerCase()) ||
        cotisation.mode.toLowerCase().includes(searchMembre.toLowerCase())
    );

    // Filtrer les allocations maison
    const filteredAllocations = allocations.filter(alloc =>
        alloc.membre.toLowerCase().includes(searchAllocation.toLowerCase()) ||
        alloc.reference.toLowerCase().includes(searchAllocation.toLowerCase()) ||
        alloc.type.toLowerCase().includes(searchAllocation.toLowerCase())
    );

    // Utiliser les stats du props
    const {
        totalCotisations,
        totalAllocations,
        cotisationsPayees,
        cotisationsEnRetard,
        allocationsApprouvees,
        allocationsEnAttente,
        totalCotisationsCount,
        totalAllocationsCount
    } = stats;

    // Handlers pour les actions
    const handleView = (type: string, id: number) => {
        router.get(`/${type}/${id}`);
    };

    const handleEdit = (type: string, id: number) => {
        router.get(`/${type}/${id}/edit`);
    };

    const handleDelete = (type: string, id: number) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer cette ${type === 'cotisation' ? 'cotisation' : 'allocation'} ?`)) {
            router.delete(`/${type}/${id}`, {
                onSuccess: () => {
                    toast.success(`${type === 'cotisation' ? 'Cotisation' : 'Allocation'} supprimée avec succès`);
                },
                onError: () => {
                    toast.error(`Erreur lors de la suppression`);
                }
            });
        }
    };

    const handleAdd = () => {
        if (activeTab === 'cotisations') {
            setIsCotisationModalOpen(true);
        } else {
            setIsAllocationModalOpen(true);
        }
    };

    const handleExport = (type: string) => {
        console.log(`Exporter ${type}`);
        // Logique d'export à implémenter
        toast.info(`Fonction d'export à venir`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cotisations" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

                {/* Cartes de résumé */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                            <div className="text-2xl font-bold text-foreground">{formatMontant(totalCotisations)}</div>
                            <p className="text-xs text-muted-foreground/80 mt-1">{totalCotisationsCount} cotisation{totalCotisationsCount > 1 ? 's' : ''}</p>
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
                            <div className="text-2xl font-bold text-foreground">{formatMontant(totalAllocations)}</div>
                            <p className="text-xs text-muted-foreground/80 mt-1">{totalAllocationsCount} allocation{totalAllocationsCount > 1 ? 's' : ''}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Cotisations payées
                                </CardTitle>
                                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                                    <CreditCard className="size-4 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{cotisationsPayees}</div>
                            <p className="text-xs text-muted-foreground/80 mt-1">{cotisationsEnRetard} en retard</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Allocations actives
                                </CardTitle>
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                    <FileText className="size-4 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{allocationsApprouvees}</div>
                            <p className="text-xs text-muted-foreground/80 mt-1">{allocationsEnAttente} en attente</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs pour les deux types de cotisations */}
                <Card className="border border-border/50 shadow-sm">
                    <CardHeader className="pb-0">
                        <Tabs defaultValue="cotisations" className="w-full" onValueChange={setActiveTab}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <TabsList className="bg-muted/50 p-1">
                                    <TabsTrigger value="cotisations" className="flex items-center gap-2">
                                        <Users className="size-4" />
                                        Cotisations membres
                                    </TabsTrigger>
                                    <TabsTrigger value="allocations" className="flex items-center gap-2">
                                        <Home className="size-4" />
                                        Allocations maison
                                    </TabsTrigger>
                                </TabsList>

                                <Button
                                    onClick={handleAdd}
                                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-sm hover:shadow-md transition-all"
                                >
                                    <Plus className="size-4 mr-2" />
                                    {activeTab === 'cotisations' ? 'Nouvelle cotisation' : 'Nouvelle allocation'}
                                </Button>
                            </div>

                            {/* Tab Cotisations des membres */}
                            <TabsContent value="cotisations" className="mt-6">
                                <div className="space-y-4">
                                    {/* Barre de recherche */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Rechercher par membre, référence ou mode de paiement..."
                                            value={searchMembre}
                                            onChange={(e) => setSearchMembre(e.target.value)}
                                            className="pl-10 w-full bg-background border-input focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    {/* Tableau des cotisations */}
                                    <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50 hover:bg-muted/50 border-border/50">
                                                    <TableHead className="font-semibold">Référence</TableHead>
                                                    <TableHead className="font-semibold">Membre</TableHead>
                                                    <TableHead className="font-semibold">Montant</TableHead>
                                                    <TableHead className="font-semibold">Date</TableHead>
                                                    <TableHead className="font-semibold">Mode</TableHead>
                                                    <TableHead className="font-semibold">Statut</TableHead>
                                                    <TableHead className="text-center font-semibold">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredCotisations.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                                            Aucune cotisation trouvée
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredCotisations.map((cotisation) => (
                                                        <TableRow key={cotisation.id} className="hover:bg-muted/30 transition-colors border-border/50">
                                                            <TableCell className="font-mono text-sm">{cotisation.reference}</TableCell>
                                                            <TableCell className="font-medium">{cotisation.membre}</TableCell>
                                                            <TableCell className="font-semibold text-primary">{formatMontant(cotisation.montant)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="size-3 text-muted-foreground" />
                                                                    <span>{new Date(cotisation.date).toLocaleDateString('fr-FR')}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{cotisation.mode}</TableCell>
                                                            <TableCell>
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(cotisation.statut)}`}>
                                                                    {cotisation.statut}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleView('cotisation', cotisation.id)}
                                                                        className="hover:bg-primary/10 hover:text-primary rounded-lg"
                                                                        title="Voir les détails"
                                                                    >
                                                                        <Eye className="size-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleEdit('cotisation', cotisation.id)}
                                                                        className="hover:bg-emerald-500/10 hover:text-emerald-600 rounded-lg"
                                                                        title="Modifier"
                                                                    >
                                                                        <Pencil className="size-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleDelete('cotisation', cotisation.id)}
                                                                        className="hover:bg-red-500/10 hover:text-red-600 rounded-lg"
                                                                        title="Supprimer"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">
                                            Affichage de {filteredCotisations.length} sur {totalCotisationsCount} cotisation{totalCotisationsCount > 1 ? 's' : ''}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleExport('cotisations')}
                                        >
                                            <Download className="size-4" />
                                            Exporter
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tab Allocations maison */}
                            <TabsContent value="allocations" className="mt-6">
                                <div className="space-y-4">
                                    {/* Barre de recherche */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Rechercher par membre, référence ou type d'allocation..."
                                            value={searchAllocation}
                                            onChange={(e) => setSearchAllocation(e.target.value)}
                                            className="pl-10 w-full bg-background border-input focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    {/* Tableau des allocations */}
                                    <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50 hover:bg-muted/50 border-border/50">
                                                    <TableHead className="font-semibold">Référence</TableHead>
                                                    <TableHead className="font-semibold">Membre</TableHead>
                                                    <TableHead className="font-semibold">Montant</TableHead>
                                                    <TableHead className="font-semibold">Date</TableHead>
                                                    <TableHead className="font-semibold">Type</TableHead>
                                                    <TableHead className="font-semibold">Statut</TableHead>
                                                    <TableHead className="text-center font-semibold">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredAllocations.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                                            Aucune allocation trouvée
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredAllocations.map((allocation) => (
                                                        <TableRow key={allocation.id} className="hover:bg-muted/30 transition-colors border-border/50">
                                                            <TableCell className="font-mono text-sm">{allocation.reference}</TableCell>
                                                            <TableCell className="font-medium">{allocation.membre}</TableCell>
                                                            <TableCell className="font-semibold text-primary">{formatMontant(allocation.montant)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="size-3 text-muted-foreground" />
                                                                    <span>{new Date(allocation.date).toLocaleDateString('fr-FR')}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                                                                    {allocation.type}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatutStyle(allocation.statut)}`}>
                                                                    {allocation.statut}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleView('allocation', allocation.id)}
                                                                        className="hover:bg-primary/10 hover:text-primary rounded-lg"
                                                                        title="Voir les détails"
                                                                    >
                                                                        <Eye className="size-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleEdit('allocation', allocation.id)}
                                                                        className="hover:bg-emerald-500/10 hover:text-emerald-600 rounded-lg"
                                                                        title="Modifier"
                                                                    >
                                                                        <Pencil className="size-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleDelete('allocation', allocation.id)}
                                                                        className="hover:bg-red-500/10 hover:text-red-600 rounded-lg"
                                                                        title="Supprimer"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">
                                            Affichage de {filteredAllocations.length} sur {totalAllocationsCount} allocation{totalAllocationsCount > 1 ? 's' : ''}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleExport('allocations')}
                                        >
                                            <Download className="size-4" />
                                            Exporter
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardHeader>
                </Card>

                {/* Modal d'ajout de cotisation */}
                <AjoutCotisationModal
                    isOpen={isCotisationModalOpen}
                    onClose={() => setIsCotisationModalOpen(false)}
                    users={users}
                />

                {/* Modal d'ajout d'allocation */}
                <AjoutAllocationModal
                    isOpen={isAllocationModalOpen}
                    onClose={() => setIsAllocationModalOpen(false)}
                    users={users}
                />
            </div>
        </AppLayout>
    );
}