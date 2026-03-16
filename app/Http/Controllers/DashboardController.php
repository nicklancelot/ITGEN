<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cotisation;
use App\Models\Allocation;
use App\Models\Publication;
use App\Models\Commentaire;
use App\Models\Like;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Statistiques générales
        $totalUsers = User::count();
        $totalAdmins = User::where('role', 'Administrateur')->count();
        $totalEditeurs = User::where('role', 'Éditeur')->count();
        $totalMembres = User::where('role', 'Utilisateur')->count();
        
        // Répartition par genre
        $totalFemmes = User::where('genre', 'Femme')->count();
        $totalHommes = User::where('genre', 'Homme')->count();

        // Statistiques des cotisations
        $totalCotisations = Cotisation::sum('montant');
        $cotisationsPayees = Cotisation::where('statut', 'Payé')->count();
        $cotisationsEnRetard = Cotisation::where('statut', 'En retard')->count();
        $totalCotisationsCount = Cotisation::count();
        
        // Montant moyen des cotisations
        $moyenneCotisations = $totalCotisationsCount > 0 
            ? round($totalCotisations / $totalCotisationsCount) 
            : 0;

        // Statistiques des allocations
        $totalAllocations = Allocation::sum('montant');
        $allocationsApprouvees = Allocation::where('statut', 'Approuvé')->count();
        $allocationsEnAttente = Allocation::where('statut', 'En attente')->count();
        $allocationsRejetees = Allocation::where('statut', 'Rejeté')->count();
        $totalAllocationsCount = Allocation::count();

        // Statistiques des publications
        $totalPublications = Publication::count();
        $totalCommentaires = Commentaire::count();
        $totalLikes = Like::count(); // Correction ici : compter les likes depuis la table likes

        // Données pour le Polar Area Chart
        $polarData = [
            [
                'subject' => 'Hommes',
                'value' => $totalHommes,
                'fill' => '#3b82f6' // Bleu
            ],
            [
                'subject' => 'Femmes',
                'value' => $totalFemmes,
                'fill' => '#ec4899' // Rose
            ],
            [
                'subject' => 'Cotisations',
                'value' => $totalCotisationsCount,
                'fill' => '#10b981' // Vert émeraude
            ],
            [
                'subject' => 'Allocations',
                'value' => $totalAllocationsCount,
                'fill' => '#8b5cf6' // Violet
            ],
            [
                'subject' => 'Publications',
                'value' => $totalPublications,
                'fill' => '#f59e0b' // Orange
            ],
            [
                'subject' => 'Commentaires',
                'value' => $totalCommentaires,
                'fill' => '#ef4444' // Rouge
            ],
        ];

        // Publications récentes
        $publicationsRecentes = Publication::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($pub) {
                return [
                    'id' => $pub->id,
                    'auteur' => $pub->user ? ($pub->user->full_name ?? $pub->user->name) : 'Utilisateur inconnu',
                    'contenu' => substr($pub->contenu, 0, 100) . '...',
                    'date' => $pub->created_at->diffForHumans(),
                    'likes' => $pub->likes,
                    'commentaires' => $pub->commentaires()->count(),
                ];
            });

        // Évolution mensuelle des cotisations (6 derniers mois) - pour MySQL
        // $evolutionCotisations = Cotisation::select(
        //     DB::raw('DATE_FORMAT(date, "%m/%Y") as mois'),
        //     DB::raw('SUM(montant) as total')
        // )
        // ->where('date', '>=', now()->subMonths(6))
        // ->groupBy('mois')
        // ->orderBy('mois')
        // ->get();

        // Évolution mensuelle des cotisations pour SQLite (comme dans votre environnement)
        $evolutionCotisations = Cotisation::select(
            DB::raw("strftime('%m/%Y', date) as mois"),
            DB::raw('SUM(montant) as total')
        )
        ->where('date', '>=', now()->subMonths(6))
        ->groupBy('mois')
        ->orderBy('mois')
        ->get();

        // Évolution mensuelle des allocations pour SQLite
        $evolutionAllocations = Allocation::select(
            DB::raw("strftime('%m/%Y', date) as mois"),
            DB::raw('SUM(montant) as total')
        )
        ->where('date', '>=', now()->subMonths(6))
        ->groupBy('mois')
        ->orderBy('mois')
        ->get();

        // Top 5 des contributeurs (ceux qui ont le plus cotisé)
        $topContributeurs = User::select('users.id', 'users.name', 'users.prenom')
            ->selectRaw('COALESCE(SUM(cotisations.montant), 0) as total_cotise')
            ->leftJoin('cotisations', 'users.id', '=', 'cotisations.user_id')
            ->groupBy('users.id', 'users.name', 'users.prenom')
            ->orderBy('total_cotise', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'nom' => ($user->prenom ?? '') . ' ' . ($user->name ?? ''),
                    'total' => $user->total_cotise ?? 0,
                ];
            });

        // Dernières activités
        $dernieresActivites = collect();

        // Dernières cotisations
        $dernieresCotisations = Cotisation::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($cotisation) {
                $userName = $cotisation->user ? ($cotisation->user->full_name ?? $cotisation->user->name) : 'Utilisateur inconnu';
                return [
                    'type' => 'Cotisation',
                    'description' => $userName . ' a effectué une cotisation de ' . number_format($cotisation->montant, 0, ',', ' ') . ' Ar',
                    'date' => $cotisation->created_at->diffForHumans(),
                    'icon' => '💰',
                ];
            });

        // Dernières allocations
        $dernieresAllocations = Allocation::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($allocation) {
                $userName = $allocation->user ? ($allocation->user->full_name ?? $allocation->user->name) : 'Utilisateur inconnu';
                return [
                    'type' => 'Allocation',
                    'description' => $userName . ' a reçu une allocation de ' . number_format($allocation->montant, 0, ',', ' ') . ' Ar',
                    'date' => $allocation->created_at->diffForHumans(),
                    'icon' => '🏠',
                ];
            });

        // Dernières publications
        $dernieresPublications = Publication::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($publication) {
                $userName = $publication->user ? ($publication->user->full_name ?? $publication->user->name) : 'Utilisateur inconnu';
                return [
                    'type' => 'Publication',
                    'description' => $userName . ' a publié : "' . substr($publication->contenu, 0, 50) . '..."',
                    'date' => $publication->created_at->diffForHumans(),
                    'icon' => '📝',
                ];
            });

        // Fusionner et trier les activités
        $dernieresActivites = $dernieresCotisations
            ->concat($dernieresAllocations)
            ->concat($dernieresPublications)
            ->sortByDesc('date')
            ->take(5)
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'users' => [
                    'total' => $totalUsers,
                    'admins' => $totalAdmins,
                    'editeurs' => $totalEditeurs,
                    'membres' => $totalMembres,
                    'femmes' => $totalFemmes,
                    'hommes' => $totalHommes,
                ],
                'cotisations' => [
                    'total' => $totalCotisations,
                    'payees' => $cotisationsPayees,
                    'enRetard' => $cotisationsEnRetard,
                    'nombre' => $totalCotisationsCount,
                    'moyenne' => $moyenneCotisations,
                ],
                'allocations' => [
                    'total' => $totalAllocations,
                    'approuvees' => $allocationsApprouvees,
                    'enAttente' => $allocationsEnAttente,
                    'rejetees' => $allocationsRejetees,
                    'nombre' => $totalAllocationsCount,
                ],
                'publications' => [
                    'total' => $totalPublications,
                    'commentaires' => $totalCommentaires,
                    'likes' => $totalLikes,
                ],
                'evolution' => [
                    'cotisations' => $evolutionCotisations,
                    'allocations' => $evolutionAllocations,
                ],
                'topContributeurs' => $topContributeurs,
                'activites' => $dernieresActivites,
                'publicationsRecentes' => $publicationsRecentes,
                'polarData' => $polarData,
            ],
            'userRole' => $user->role ?? 'Utilisateur',
            'userName' => $user->full_name ?? $user->name ?? 'Utilisateur',
        ]);
    }
}