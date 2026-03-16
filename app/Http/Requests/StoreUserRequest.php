<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // L'admin est autorisé
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'numero' => ['required', 'string', 'max:20'],
            'genre' => ['required', 'in:Homme,Femme'],
            'role' => ['required', 'in:Administrateur,Éditeur,Utilisateur'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est requis',
            'prenom.required' => 'Le prénom est requis',
            'email.required' => 'L\'email est requis',
            'email.unique' => 'Cet email est déjà utilisé',
            'password.required' => 'Le mot de passe est requis',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas',
            'numero.required' => 'Le numéro de téléphone est requis',
            'genre.required' => 'Le genre est requis',
            'genre.in' => 'Le genre doit être Homme ou Femme',
            'role.required' => 'Le rôle est requis',
            'role.in' => 'Le rôle doit être Administrateur, Éditeur ou Utilisateur',
        ];
    }
}