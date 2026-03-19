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

        // Ajout de 30 utilisateurs supplémentaires
        $this->command->info('🔄 Création de 30 utilisateurs supplémentaires...');
        
        $createdCount = 0;
        
        for ($i = 1; $i <= 30; $i++) {
            // Générer un email unique
            $email = "user{$i}@example.com";
            
            // Vérifier si l'utilisateur existe déjà
            $existingTestUser = User::where('email', $email)->first();
            
            if (!$existingTestUser) {
                // Définir le genre alterné
                $genre = ($i % 2 == 0) ? 'Homme' : 'Femme';
                
                // Définir le rôle en fonction de l'index
                if ($i <= 15) {
                    $role = 'Utilisateur';
                } elseif ($i <= 25) {
                    $role = 'Éditeur';
                } else {
                    $role = 'Utilisateur';
                }
                
                User::create([
                    'name' => 'Utilisateur',
                    'prenom' => "Test{$i}",
                    'email' => $email,
                    'password' => Hash::make('password123'),
                    'numero' => '+261 34 ' . str_pad($i, 2, '0', STR_PAD_LEFT) . ' 000 ' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'genre' => $genre,
                    'role' => $role,
                    'email_verified_at' => now(),
                ]);
                
                $createdCount++;
                
                // Afficher la progression tous les 5 utilisateurs
                if ($i % 5 == 0) {
                    $this->command->info("   ✓ {$i} utilisateurs créés...");
                }
            }
        }
        
        $this->command->info("✅ {$createdCount} nouveaux utilisateurs créés avec succès!");
        
        // Afficher le total des utilisateurs
        $totalUsers = User::count();
        $this->command->info("📊 Total des utilisateurs dans la base: {$totalUsers}");
    }
}