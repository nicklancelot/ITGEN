import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    Heart, 
    MessageCircle, 
    MoreHorizontal,
    Send,
    Calendar,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Commentaire {
    id: number;
    auteur: string;
    date: string;
    contenu: string;
}

interface Publication {
    id: number;
    auteur: string;
    role: string;
    date: string;
    contenu: string;
    likes: number;
    commentaires: Commentaire[];
    estLiked: boolean;
    commentaires_count: number;
}

interface Props {
    publications: Publication[];
    userRole: string;
    userName: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Actualités',
        href: '/actu',
    },
];

// Fonction pour formater la date relative
const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
        return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
        return 'Hier';
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
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

export default function Actualiter({ publications, userRole, userName }: Props) {
    const [localPublications, setLocalPublications] = useState(publications);
    const [commentairesOuverts, setCommentairesOuverts] = useState<number | null>(null);
    const [nouveauCommentaire, setNouveauCommentaire] = useState('');
    const [nouvellePublication, setNouvellePublication] = useState('');
    const [loading, setLoading] = useState(false);
    const [publicationASupprimer, setPublicationASupprimer] = useState<number | null>(null);

    const isAdmin = userRole === 'Administrateur';

    // Mettre à jour les publications locales quand les props changent
// Mettre à jour les publications locales quand les props changent
    useEffect(() => {
        setLocalPublications(publications);
    }, [publications]);

    const handleLike = (id: number) => {
        // Optimistic update
        setLocalPublications(prev => 
            prev.map(pub => 
                pub.id === id 
                    ? { 
                        ...pub, 
                        estLiked: !pub.estLiked, 
                        likes: pub.estLiked ? pub.likes - 1 : pub.likes + 1 
                      } 
                    : pub
            )
        );

        router.post(`/publication/${id}/like`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                // Mise à jour avec les données du serveur
                setLocalPublications(page.props.publications as Publication[]);
                const publication = localPublications.find(p => p.id === id);
                toast.success(publication?.estLiked ? 'Like retiré' : 'Publication likée');
            },
            onError: () => {
                // Revert en cas d'erreur
                setLocalPublications(prev => 
                    prev.map(pub => 
                        pub.id === id 
                            ? { 
                                ...pub, 
                                estLiked: !pub.estLiked, 
                                likes: pub.estLiked ? pub.likes + 1 : pub.likes - 1 
                              } 
                            : pub
                    )
                );
                toast.error('Erreur lors du like');
            }
        });
    };

    const handleAjouterCommentaire = (publicationId: number) => {
        if (!nouveauCommentaire.trim()) return;

        const commentaireTemp = {
            id: Date.now(),
            auteur: userName,
            date: new Date().toISOString(),
            contenu: nouveauCommentaire
        };

        // Optimistic update
        setLocalPublications(prev => 
            prev.map(pub => 
                pub.id === publicationId 
                    ? { 
                        ...pub, 
                        commentaires: [...pub.commentaires, commentaireTemp] 
                      } 
                    : pub
            )
        );
        setNouveauCommentaire('');

        router.post(`/publication/${publicationId}/commentaire`, {
            contenu: commentaireTemp.contenu
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page: any) => {
                setLocalPublications(page.props.publications as Publication[]);
                toast.success('Commentaire ajouté');
            },
            onError: (errors) => {
                // Revert en cas d'erreur
                setLocalPublications(prev => 
                    prev.map(pub => 
                        pub.id === publicationId 
                            ? { 
                                ...pub, 
                                commentaires: pub.commentaires.filter(c => c.id !== commentaireTemp.id) 
                              } 
                            : pub
                    )
                );
                setNouveauCommentaire(commentaireTemp.contenu);
                console.error('Erreur commentaire:', errors);
                toast.error('Erreur lors de l\'ajout du commentaire');
            }
        });
    };

    const handlePublication = () => {
        if (!nouvellePublication.trim()) return;
        if (!isAdmin) {
            toast.error('Seuls les administrateurs peuvent publier');
            return;
        }

        const publicationTemp = {
            id: Date.now(),
            auteur: userName,
            role: userRole,
            date: new Date().toISOString(),
            contenu: nouvellePublication,
            likes: 0,
            commentaires: [],
            estLiked: false,
            commentaires_count: 0
        };

        // Optimistic update
        setLocalPublications(prev => [publicationTemp, ...prev]);
        setLoading(true);

        router.post('/publication', {
            contenu: nouvellePublication
        }, {
            onSuccess: (page: any) => {
                setLocalPublications(page.props.publications as Publication[]);
                setNouvellePublication('');
                toast.success('Publication créée avec succès');
            },
            onError: (errors) => {
                // Revert en cas d'erreur
                setLocalPublications(prev => prev.filter(p => p.id !== publicationTemp.id));
                console.error('Erreur publication:', errors);
                toast.error('Erreur lors de la publication');
            },
            onFinish: () => setLoading(false)
        });
    };

    const handleSupprimerPublication = () => {
        if (!publicationASupprimer) return;
        if (!isAdmin) return;

        // Optimistic update
        const publicationSupprimee = localPublications.find(p => p.id === publicationASupprimer);
        setLocalPublications(prev => prev.filter(p => p.id !== publicationASupprimer));
        setPublicationASupprimer(null);

        router.delete(`/publication/${publicationASupprimer}`, {
            onSuccess: (page: any) => {
                setLocalPublications(page.props.publications as Publication[]);
                toast.success('Publication supprimée');
            },
            onError: (errors) => {
                // Revert en cas d'erreur
                if (publicationSupprimee) {
                    setLocalPublications(prev => [...prev, publicationSupprimee].sort((a, b) => 
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    ));
                }
                console.error('Erreur suppression:', errors);
                toast.error('Erreur lors de la suppression');
            }
        });
    };

    const toggleCommentaires = (id: number) => {
        setCommentairesOuverts(commentairesOuverts === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actualités" />
            
            {/* Modal de confirmation de suppression */}
            <AlertDialog open={publicationASupprimer !== null} onOpenChange={() => setPublicationASupprimer(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSupprimerPublication} className="bg-red-500 hover:bg-red-600">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6 max-w-4xl mx-auto w-full">

                {/* Zone de publication - UNIQUEMENT pour les admins */}
                {isAdmin && (
                    <Card className="border border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Publier une annonce</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Quoi de neuf ?"
                                value={nouvellePublication}
                                onChange={(e) => setNouvellePublication(e.target.value)}
                                className="min-h-[100px] bg-background border-input focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                            <div className="flex justify-end mt-4">
                                <Button
                                    onClick={handlePublication}
                                    disabled={loading || !nouvellePublication.trim()}
                                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-sm hover:shadow-md transition-all"
                                >
                                    <Send className="size-4 mr-2" />
                                    {loading ? 'Publication...' : 'Publier'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Liste des actualités */}
                <div className="space-y-6">
                    {localPublications.length === 0 ? (
                        <Card className="border border-border/50 shadow-sm">
                            <CardContent className="py-12 text-center text-muted-foreground">
                                Aucune actualité pour le moment
                            </CardContent>
                        </Card>
                    ) : (
                        localPublications.map((publication) => (
                            <Card key={publication.id} className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                                                <AvatarFallback className="bg-primary/5 text-primary">
                                                    {getInitials(publication.auteur)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground">{publication.auteur}</span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                        {publication.role}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Calendar className="size-3" />
                                                    <span>{formatDateRelative(publication.date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {isAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setPublicationASupprimer(publication.id)}
                                                    className="hover:bg-red-500/10 hover:text-red-600 rounded-full"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-3">
                                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                        {publication.contenu}
                                    </p>
                                </CardContent>

                                <CardFooter className="flex flex-col pt-3">
                                    {/* Actions */}
                                    <div className="flex items-center gap-4 w-full border-b border-border/50 pb-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleLike(publication.id)}
                                            className={`gap-2 hover:bg-transparent ${
                                                publication.estLiked 
                                                    ? 'text-red-500 hover:text-red-600' 
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            <Heart className={`size-5 ${publication.estLiked ? 'fill-current' : ''}`} />
                                            <span>{publication.likes}</span>
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleCommentaires(publication.id)}
                                            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                        >
                                            <MessageCircle className="size-5" />
                                            <span>{publication.commentaires.length}</span>
                                        </Button>
                                    </div>

                                    {/* Section commentaires */}
                                    {commentairesOuverts === publication.id && (
                                        <div className="w-full pt-4 space-y-4">
                                            {/* Liste des commentaires */}
                                            {publication.commentaires.length > 0 && (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {publication.commentaires.map((commentaire) => (
                                                        <div key={commentaire.id} className="flex gap-2">
                                                            <Avatar className="h-6 w-6 border border-border/50">
                                                                <AvatarFallback className="text-xs bg-muted">
                                                                    {getInitials(commentaire.auteur)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="bg-muted/50 rounded-lg p-2">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="text-xs font-semibold">
                                                                            {commentaire.auteur}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {formatDateRelative(commentaire.date)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm">{commentaire.contenu}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Ajouter un commentaire */}
                                            <div className="flex gap-2">
                                                <Avatar className="h-8 w-8 border border-border/50">
                                                    <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                                        {getInitials(userName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 flex gap-2">
                                                    <Input
                                                        placeholder="Écrire un commentaire..."
                                                        value={nouveauCommentaire}
                                                        onChange={(e) => setNouveauCommentaire(e.target.value)}
                                                        className="flex-1 bg-background border-input focus:ring-2 focus:ring-primary/20"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleAjouterCommentaire(publication.id);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAjouterCommentaire(publication.id)}
                                                        disabled={!nouveauCommentaire.trim()}
                                                        className="bg-primary hover:bg-primary/90"
                                                    >
                                                        <Send className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}