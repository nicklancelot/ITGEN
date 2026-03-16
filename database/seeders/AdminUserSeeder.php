<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $existingUser = User::where('email', 'admin@example.com')->first();
        
        if (!$existingUser) {
            User::create([
                'name' => 'Admin',
                'prenom' => 'System',
                'email' => 'admin@example.com',
                'password' => Hash::make('motdepasse'),
                'numero' => '+261 34 00 000 00',
                'genre' => 'Homme',
                'role' => 'Administrateur',
                'email_verified_at' => now(),
            ]);

            $this->command->info('✅ Admin user created successfully!');
        } else {
            $this->command->info('ℹ️ Admin user already exists.');
        }

        // Optionnel : Créer d'autres utilisateurs de test
        $editeur = User::where('email', 'editeur@example.com')->first();
        if (!$editeur) {
            User::create([
                'name' => 'Éditeur',
                'prenom' => 'Test',
                'email' => 'editeur@example.com',
                'password' => Hash::make('password123'),
                'numero' => '+261 34 00 000 01',
                'genre' => 'Femme',
                'role' => 'Éditeur',
                'email_verified_at' => now(),
            ]);
            $this->command->info('✅ Editor user created successfully!');
        }

        $utilisateur = User::where('email', 'user@example.com')->first();
        if (!$utilisateur) {
            User::create([
                'name' => 'Utilisateur',
                'prenom' => 'Test',
                'email' => 'user@example.com',
                'password' => Hash::make('password123'),
                'numero' => '+261 34 00 000 02',
                'genre' => 'Homme',
                'role' => 'Utilisateur',
                'email_verified_at' => now(),
            ]);
            $this->command->info('✅ Regular user created successfully!');
        }
    }
}