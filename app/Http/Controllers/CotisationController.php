<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cotisation;
use App\Models\Allocation;
use App\Http\Requests\StoreCotisationRequest;
use App\Http\Requests\UpdateCotisationRequest;
use App\Http\Requests\StoreAllocationRequest;
use App\Http\Requests\UpdateAllocationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CotisationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Récupérer toutes les cotisations avec les informations de l'utilisateur
        $cotisations = Cotisation::with('user')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($cotisation) {
                return [
                    'id' => $cotisation->id,
                    'membre' => $cotisation->user->full_name,
                    'montant' => $cotisation->montant,
                    'date' => $cotisation->date->format('Y-m-d'),
                    'statut' => $cotisation->statut,
                    'mode' => $cotisation->mode,
                    'reference' => $cotisation->reference,
                    'user_id' => $cotisation->user_id,
                ];
            });

        // Récupérer toutes les allocations avec les informations de l'utilisateur
        $allocations = Allocation::with('user')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($allocation) {
                return [
                    'id' => $allocation->id,
                    'membre' => $allocation->user->full_name,
                    'montant' => $allocation->montant,
                    'date' => $allocation->date->format('Y-m-d'),
                    'type' => $allocation->type,
                    'statut' => $allocation->statut,
                    'reference' => $allocation->reference,
                    'user_id' => $allocation->user_id,
                ];
            });

        // Récupérer tous les utilisateurs pour les sélecteurs
        $users = User::select('id', 'name', 'prenom')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                ];
            });

        // Calculer les statistiques
        $totalCotisations = $cotisations->sum('montant');
        $cotisationsPayees = $cotisations->where('statut', 'Payé')->count();
        $cotisationsEnRetard = $cotisations->where('statut', 'En retard')->count();

        $totalAllocations = $allocations->sum('montant');
        $allocationsApprouvees = $allocations->where('statut', 'Approuvé')->count();
        $allocationsEnAttente = $allocations->where('statut', 'En attente')->count();

        return Inertia::render('Cotisation/index', [
            'cotisations' => $cotisations,
            'allocations' => $allocations,
            'users' => $users,
            'stats' => [
                'totalCotisations' => $totalCotisations,
                'totalAllocations' => $totalAllocations,
                'cotisationsPayees' => $cotisationsPayees,
                'cotisationsEnRetard' => $cotisationsEnRetard,
                'allocationsApprouvees' => $allocationsApprouvees,
                'allocationsEnAttente' => $allocationsEnAttente,
                'totalCotisationsCount' => $cotisations->count(),
                'totalAllocationsCount' => $allocations->count(),
            ]
        ]);
    }

    /**
     * Store a newly created cotisation in storage.
     */
    public function storeCotisation(StoreCotisationRequest $request)
    {
        $cotisation = Cotisation::create([
            'user_id' => $request->user_id,
            'reference' => Cotisation::generateReference(),
            'montant' => $request->montant,
            'date' => $request->date,
            'mode' => $request->mode,
            'statut' => $request->statut,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Cotisation créée avec succès');
    }

    /**
     * Store a newly created allocation in storage.
     */
    public function storeAllocation(StoreAllocationRequest $request)
    {
        $allocation = Allocation::create([
            'user_id' => $request->user_id,
            'reference' => Allocation::generateReference(),
            'montant' => $request->montant,
            'date' => $request->date,
            'type' => $request->type,
            'statut' => $request->statut,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Allocation créée avec succès');
    }

    /**
     * Update the specified cotisation.
     */
    public function updateCotisation(UpdateCotisationRequest $request, Cotisation $cotisation)
    {
        $cotisation->update($request->validated());

        return redirect()->back()->with('success', 'Cotisation mise à jour avec succès');
    }

    /**
     * Update the specified allocation.
     */
    public function updateAllocation(UpdateAllocationRequest $request, Allocation $allocation)
    {
        $allocation->update($request->validated());

        return redirect()->back()->with('success', 'Allocation mise à jour avec succès');
    }

    /**
     * Remove the specified cotisation.
     */
    public function destroyCotisation(Cotisation $cotisation)
    {
        $cotisation->delete();

        return redirect()->back()->with('success', 'Cotisation supprimée avec succès');
    }

    /**
     * Remove the specified allocation.
     */
    public function destroyAllocation(Allocation $allocation)
    {
        $allocation->delete();

        return redirect()->back()->with('success', 'Allocation supprimée avec succès');
    }
}