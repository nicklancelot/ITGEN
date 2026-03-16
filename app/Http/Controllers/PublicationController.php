<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Commentaire;
use App\Models\Like;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PublicationController extends Controller
{
    /**
     * Display a listing of the publications.
     */
    public function index()
    {
        $user = Auth::user();
        
        $publications = Publication::with(['user', 'commentaires.user'])
            ->withCount('commentaires')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($publication) use ($user) {
                return [
                    'id' => $publication->id,
                    'auteur' => $publication->user->full_name ?? $publication->user->name,
                    'role' => $publication->user->role,
                    'date' => $publication->created_at,
                    'contenu' => $publication->contenu,
                    'likes' => $publication->likes,
                    'commentaires' => $publication->commentaires->map(function ($commentaire) {
                        return [
                            'id' => $commentaire->id,
                            'auteur' => $commentaire->user->full_name ?? $commentaire->user->name,
                            'date' => $commentaire->created_at,
                            'contenu' => $commentaire->contenu,
                        ];
                    }),
                    'estLiked' => $publication->isLikedByUser($user->id),
                    'commentaires_count' => $publication->commentaires_count,
                ];
            });

        return Inertia::render('Publication/index', [
            'publications' => $publications,
            'userRole' => $user->role,
            'userName' => $user->full_name ?? $user->name,
        ]);
    }

    /**
     * Store a newly created publication.
     */
    public function store(Request $request)
    {
        $request->validate([
            'contenu' => ['required', 'string', 'min:3', 'max:5000'],
        ]);

        // Vérifier que l'utilisateur est admin
        if (Auth::user()->role !== 'Administrateur') {
            return redirect()->back()->with('error', 'Seuls les administrateurs peuvent créer des publications');
        }

        $publication = Publication::create([
            'user_id' => Auth::id(),
            'contenu' => $request->contenu,
            'likes' => 0,
        ]);

        return redirect()->back()->with('success', 'Publication créée avec succès');
    }

    /**
     * Toggle like on a publication.
     */
    public function toggleLike(Publication $publication)
    {
        $user = Auth::user();
        $like = Like::where('user_id', $user->id)
            ->where('publication_id', $publication->id)
            ->first();

        if ($like) {
            // Unlike
            $like->delete();
            $publication->decrement('likes');
            $liked = false;
        } else {
            // Like
            Like::create([
                'user_id' => $user->id,
                'publication_id' => $publication->id,
            ]);
            $publication->increment('likes');
            $liked = true;
        }

        // Retourner une réponse Inertia avec les données mises à jour
        return back()->with([
            'success' => true,
            'liked' => $liked,
            'likes_count' => $publication->fresh()->likes,
        ]);
    }

    /**
     * Store a comment on a publication.
     */
    public function storeComment(Request $request, Publication $publication)
    {
        $request->validate([
            'contenu' => ['required', 'string', 'min:1', 'max:1000'],
        ]);

        $commentaire = Commentaire::create([
            'user_id' => Auth::id(),
            'publication_id' => $publication->id,
            'contenu' => $request->contenu,
        ]);

        // Charger les relations pour la réponse
        $commentaire->load('user');

        // Retourner une réponse Inertia avec les données mises à jour
        return back()->with([
            'success' => true,
            'commentaire' => [
                'id' => $commentaire->id,
                'auteur' => $commentaire->user->full_name ?? $commentaire->user->name,
                'date' => $commentaire->created_at,
                'contenu' => $commentaire->contenu,
            ],
        ]);
    }

    /**
     * Delete a publication (only admin).
     */
    public function destroy(Publication $publication)
    {
        if (Auth::user()->role !== 'Administrateur') {
            return redirect()->back()->with('error', 'Seuls les administrateurs peuvent supprimer des publications');
        }

        $publication->delete();

        return redirect()->back()->with('success', 'Publication supprimée avec succès');
    }
}