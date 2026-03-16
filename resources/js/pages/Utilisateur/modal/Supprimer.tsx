import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  prenom: string;
  email: string;
}

interface SupprimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function SupprimerModal({ isOpen, onClose, user }: SupprimerModalProps) {
  const handleDelete = () => {
    if (!user) return;

    router.delete(`/utilisateur/${user.id}`, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!user) return null;

  const fullName = `${user.prenom} ${user.name}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription className="pt-3">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold text-foreground">{fullName}</span> ?
            <br /><br />
            <span className="text-red-500 text-sm">
              Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement supprimées.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Oui, supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}