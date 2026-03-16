import { useState, useEffect } from 'react';
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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: number;
  name: string;
  prenom: string;
  email: string;
  numero: string;
  genre: string;
  role: string;
}

interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ModifierModal({ isOpen, onClose, user }: ModifierModalProps) {
  const [withPassword, setWithPassword] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    numero: '',
    genre: '',
    role: '',
  });

  // Remplir le formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setData({
        name: user.name || '',
        prenom: user.prenom || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        numero: user.numero || '',
        genre: user.genre || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    put(`/utilisateur/${user.id}`, {
      onSuccess: () => {
        reset();
        onClose();
        setWithPassword(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    setWithPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur. Laissez le mot de passe vide pour ne pas le changer.
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

          {/* Ligne Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom *</Label>
              <Input
                id="edit-name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Dupont"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prenom">Prénom *</Label>
              <Input
                id="edit-prenom"
                value={data.prenom}
                onChange={(e) => setData('prenom', e.target.value)}
                placeholder="Marie"
                className={errors.prenom ? 'border-red-500' : ''}
              />
              {errors.prenom && (
                <p className="text-sm text-red-500">{errors.prenom}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="marie.dupont@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Option pour changer le mot de passe */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="change-password"
              checked={withPassword}
              onChange={(e) => setWithPassword(e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="change-password" className="text-sm cursor-pointer">
              Changer le mot de passe
            </Label>
          </div>

          {/* Champs mot de passe (conditionnels) */}
          {withPassword && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-password">Nouveau mot de passe</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password_confirmation">Confirmer</Label>
                <Input
                  id="edit-password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Numéro de téléphone */}
          <div className="space-y-2">
            <Label htmlFor="edit-numero">Numéro de téléphone *</Label>
            <Input
              id="edit-numero"
              value={data.numero}
              onChange={(e) => setData('numero', e.target.value)}
              placeholder="0612345678"
              className={errors.numero ? 'border-red-500' : ''}
            />
            {errors.numero && (
              <p className="text-sm text-red-500">{errors.numero}</p>
            )}
          </div>

          {/* Ligne Genre et Rôle */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-genre">Genre *</Label>
              <Select
                value={data.genre}
                onValueChange={(value) => setData('genre', value)}
              >
                <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Homme">Homme</SelectItem>
                  <SelectItem value="Femme">Femme</SelectItem>
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-sm text-red-500">{errors.genre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle *</Label>
              <Select
                value={data.role}
                onValueChange={(value) => setData('role', value)}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrateur">Administrateur</SelectItem>
                  <SelectItem value="Éditeur">Éditeur</SelectItem>
                  <SelectItem value="Utilisateur">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>
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
              {processing ? 'Modification...' : 'Enregistrer les modifications'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}