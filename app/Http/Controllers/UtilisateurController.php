<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'prenom', 'email', 'numero', 'genre', 'role')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Utilisateur/index', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'numero' => $request->numero,
            'genre' => $request->genre,
            'role' => $request->role,
        ]);

        return redirect()->back()->with('success', 'Utilisateur créé avec succès');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        return Inertia::render('Utilisateur/show', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'numero' => ['required', 'string', 'max:20'],
            'genre' => ['required', 'in:Homme,Femme'],
            'role' => ['required', 'in:Administrateur,Éditeur,Utilisateur'],
        ]);

        $user->update($request->only('name', 'prenom', 'email', 'numero', 'genre', 'role'));

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            ]);
            $user->update(['password' => bcrypt($request->password)]);
        }

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès');
    }
}