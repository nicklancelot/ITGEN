import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';

interface User {
  id: number;
  full_name: string;
}

interface AjoutCotisationModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

export default function AjoutCotisationModal({ isOpen, onClose, users }: AjoutCotisationModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    user_id: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    mode: '',
    statut: 'Payé',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post('/cotisation', {
      onSuccess: () => {
        toast.success('Cotisation créée avec succès');
        reset();
        onClose();
      },
      onError: (errors) => {
        console.error('Erreur:', errors);
        toast.error('Erreur lors de la création de la cotisation');
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle cotisation</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle cotisation pour un membre. Les champs marqués d'une * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Affichage des erreurs globales */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez corriger les erreurs ci-dessous
              </AlertDescription>
            </Alert>
          )}

          {/* Sélection du membre */}
          <div className="space-y-2">
            <Label htmlFor="user_id">Membre *</Label>
            <Select
              value={data.user_id}
              onValueChange={(value) => setData('user_id', value)}
            >
              <SelectTrigger className={errors.user_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un membre" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user_id && (
              <p className="text-sm text-red-500">{errors.user_id}</p>
            )}
          </div>

          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="montant">Montant (Ariary) *</Label>
            <Input
              id="montant"
              type="number"
              min="1000"
              step="1000"
              value={data.montant}
              onChange={(e) => setData('montant', e.target.value)}
              placeholder="25000"
              className={errors.montant ? 'border-red-500' : ''}
            />
            {errors.montant && (
              <p className="text-sm text-red-500">{errors.montant}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => setData('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Mode de paiement */}
          <div className="space-y-2">
            <Label htmlFor="mode">Mode de paiement *</Label>
            <Select
              value={data.mode}
              onValueChange={(value) => setData('mode', value)}
            >
              <SelectTrigger className={errors.mode ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Espèces">Espèces</SelectItem>
                <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                <SelectItem value="Virement">Virement</SelectItem>
                <SelectItem value="Carte">Carte</SelectItem>
              </SelectContent>
            </Select>
            {errors.mode && (
              <p className="text-sm text-red-500">{errors.mode}</p>
            )}
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="statut">Statut *</Label>
            <Select
              value={data.statut}
              onValueChange={(value) => setData('statut', value)}
            >
              <SelectTrigger className={errors.statut ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Payé">Payé</SelectItem>
                <SelectItem value="En retard">En retard</SelectItem>
              </SelectContent>
            </Select>
            {errors.statut && (
              <p className="text-sm text-red-500">{errors.statut}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnelle)</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Informations complémentaires..."
              className="resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              {processing ? 'Création...' : 'Créer la cotisation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}