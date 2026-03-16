<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCotisationRequest extends FormRequest
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
            'user_id' => ['sometimes', 'exists:users,id'],
            'montant' => ['sometimes', 'numeric', 'min:1000'],
            'date' => ['sometimes', 'date'],
            'mode' => ['sometimes', 'in:Espèces,Mobile Money,Virement,Carte'],
            'statut' => ['sometimes', 'in:Payé,En retard'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}