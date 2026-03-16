<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCotisationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'montant' => ['required', 'numeric', 'min:1000'],
            'date' => ['required', 'date'],
            'mode' => ['required', 'in:Espèces,Mobile Money,Virement,Carte'],
            'statut' => ['required', 'in:Payé,En retard'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'Le membre est requis',
            'user_id.exists' => 'Le membre sélectionné n\'existe pas',
            'montant.required' => 'Le montant est requis',
            'montant.min' => 'Le montant minimum est de 1 000 FCFA',
            'date.required' => 'La date est requise',
            'mode.required' => 'Le mode de paiement est requis',
            'mode.in' => 'Le mode de paiement sélectionné n\'est pas valide',
            'statut.required' => 'Le statut est requis',
            'statut.in' => 'Le statut sélectionné n\'est pas valide',
        ];
    }
}