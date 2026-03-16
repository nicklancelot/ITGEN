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

interface AjoutAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

// Types d'allocations prédéfinis
const TYPES_ALLOCATION = [
  'Aide au logement',
  'Réparation',
  'Achat maison',
  'Rénovation',
  'Aide au loyer',
  'Équipement',
  'Urgence',
  'Autre'
];

export default function AjoutAllocationModal({ isOpen, onClose, users }: AjoutAllocationModalProps) {
  const [autreType, setAutreType] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    user_id: '',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    type_autre: '',
    statut: 'En attente',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si c'est "Autre" et que type_autre est rempli, utiliser cette valeur
    const typeValue = data.type === 'Autre' && data.type_autre 
        ? data.type_autre 
        : data.type;

    // Mettre à jour les données avec le type modifié
    setData('type', typeValue);
    
    // Envoyer le formulaire
    post('/allocation', {
        onSuccess: () => {
            toast.success('Allocation créée avec succès');
            reset();
            setAutreType(false);
            onClose();
        },
        onError: (errors: any) => {
            console.error('Erreur:', errors);
            toast.error('Erreur lors de la création de l\'allocation');
        },
    });
};

  const handleClose = () => {
    reset();
    setAutreType(false);
    onClose();
  };

  const handleTypeChange = (value: string) => {
    setData('type', value);
    setAutreType(value === 'Autre');
    if (value !== 'Autre') {
      setData('type_autre', '');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle allocation</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle allocation pour un membre. Les champs marqués d'une * sont obligatoires.
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
              placeholder="150000"
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

          {/* Type d'allocation */}
          <div className="space-y-2">
            <Label htmlFor="type">Type d'allocation *</Label>
            <Select
              value={data.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES_ALLOCATION.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          {/* Champ pour "Autre" type */}
          {autreType && (
            <div className="space-y-2">
              <Label htmlFor="type_autre">Précisez le type *</Label>
              <Input
                id="type_autre"
                value={data.type_autre}
                onChange={(e) => setData('type_autre', e.target.value)}
                placeholder="Entrez le type d'allocation"
                className={errors.type_autre ? 'border-red-500' : ''}
              />
              {errors.type_autre && (
                <p className="text-sm text-red-500">{errors.type_autre}</p>
              )}
            </div>
          )}

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
                <SelectItem value="Approuvé">Approuvé</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Rejeté">Rejeté</SelectItem>
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
              placeholder="Raison de l'allocation, informations complémentaires..."
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
              {processing ? 'Création...' : 'Créer l\'allocation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

