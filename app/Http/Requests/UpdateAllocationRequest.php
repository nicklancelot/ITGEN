<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAllocationRequest extends FormRequest
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
            'type' => ['sometimes', 'string', 'max:255'],
            'statut' => ['sometimes', 'in:Approuvé,En attente,Rejeté'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}