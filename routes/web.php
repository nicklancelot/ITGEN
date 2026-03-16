<?php

use App\Http\Controllers\CotisationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\UtilisateurController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Routes utilisateurs
    Route::get('/utilisateur', [UtilisateurController::class, 'index'])->name('utilisateur.index');
    Route::post('/utilisateur', [UtilisateurController::class, 'store'])->name('utilisateur.store');
    Route::get('/utilisateur/{user}', [UtilisateurController::class, 'show'])->name('utilisateur.show');
    Route::put('/utilisateur/{user}', [UtilisateurController::class, 'update'])->name('utilisateur.update');
    Route::delete('/utilisateur/{user}', [UtilisateurController::class, 'destroy'])->name('utilisateur.destroy');

    // Routes cotisations et allocations
    Route::get('/cotisation', [CotisationController::class, 'index'])->name('cotisation.index');
    Route::post('/cotisation', [CotisationController::class, 'storeCotisation'])->name('cotisation.store');
    Route::put('/cotisation/{cotisation}', [CotisationController::class, 'updateCotisation'])->name('cotisation.update');
    Route::delete('/cotisation/{cotisation}', [CotisationController::class, 'destroyCotisation'])->name('cotisation.destroy');

    Route::post('/allocation', [CotisationController::class, 'storeAllocation'])->name('allocation.store');
    Route::put('/allocation/{allocation}', [CotisationController::class, 'updateAllocation'])->name('allocation.update');
    Route::delete('/allocation/{allocation}', [CotisationController::class, 'destroyAllocation'])->name('allocation.destroy');



    // Dans le groupe middleware auth
    Route::get('/actu', [PublicationController::class, 'index'])->name('publication.index');
    Route::post('/publication', [PublicationController::class, 'store'])->name('publication.store');
    Route::post('/publication/{publication}/like', [PublicationController::class, 'toggleLike'])->name('publication.like');
    Route::post('/publication/{publication}/commentaire', [PublicationController::class, 'storeComment'])->name('publication.comment');
    Route::delete('/publication/{publication}', [PublicationController::class, 'destroy'])->name('publication.destroy');
});

require __DIR__ . '/settings.php';
