import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserCheck, UserX, Eye, Pencil, Trash2, Plus, Search } from 'lucide-react';
import AjoutModal from './modal/Ajout';
import ModifierModal from './modal/Modifier';
import SupprimerModal from './modal/Supprimer';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  prenom: string;
  email: string;
  numero: string;
  genre: string;
  role: string;
}

interface Props {
  users: User[];
  flash?: {
    success?: string;
    error?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Utilisateur',
    href: '/utilisateur',
  },
];

export default function Index({ users }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtrer les utilisateurs selon le terme de recherche
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les statistiques
  const totalUsers = users.length;
  const totalFemmes = users.filter(user => user.genre === 'Femme').length;
  const totalHommes = users.filter(user => user.genre === 'Homme').length;

  const handleView = (id: number) => {
    router.get(`/utilisateur/${id}`);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  // Formatage du nombre pour le pourcentage
  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Utilisateur" />
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">

        {/* Cards de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Utilisateurs
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="size-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalUsers}</div>
              <p className="text-xs text-muted-foreground/80 mt-1">Tous les utilisateurs actifs</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Nombre de Femmes
                </CardTitle>
                <div className="p-2 bg-pink-100 dark:bg-pink-500/20 rounded-lg">
                  <UserCheck className="size-4 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalFemmes}</div>
              <p className="text-xs text-muted-foreground/80 mt-1">{formatPercentage(totalFemmes, totalUsers)}% du total</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Nombre d'Hommes
                </CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <UserX className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalHommes}</div>
              <p className="text-xs text-muted-foreground/80 mt-1">{formatPercentage(totalHommes, totalUsers)}% du total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtre et bouton Ajouter */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, prénom, email ou rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-background border-input focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="size-4 mr-2" />
                Ajouter Utilisateur
              </Button>
            </div>
          </CardHeader>

          {/* Tableau des utilisateurs */}
          <CardContent>
            <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-border/50">
                    <TableHead className="font-semibold text-foreground/80">Nom</TableHead>
                    <TableHead className="font-semibold text-foreground/80">Prénom</TableHead>
                    <TableHead className="font-semibold text-foreground/80">Email</TableHead>
                    <TableHead className="font-semibold text-foreground/80">Numéro</TableHead>
                    <TableHead className="font-semibold text-foreground/80">Genre</TableHead>
                    <TableHead className="font-semibold text-foreground/80">Rôle</TableHead>
                    <TableHead className="text-center font-semibold text-foreground/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-muted/30 transition-colors border-border/50"
                      >
                        <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                        <TableCell className="text-foreground/90">{user.prenom}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="text-muted-foreground">{user.numero}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.genre === 'Femme'
                              ? 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30'
                              : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                            }`}>
                            {user.genre}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            user.role === 'Administrateur'
                              ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30'
                              : user.role === 'Éditeur'
                                ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/30'
                                : 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-500/30'
                            }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(user.id)}
                              className="hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                              title="Voir les détails"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(user)}
                              className="hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all rounded-lg"
                              title="Modifier"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user)}
                              className="hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer avec nombre de résultats */}
            <div className="mt-4 text-sm text-muted-foreground/80 flex items-center justify-between">
              <span>Affichage de {filteredUsers.length} sur {totalUsers} utilisateur{totalUsers > 1 ? 's' : ''}</span>
              {filteredUsers.length < totalUsers && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  Filtre actif
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal d'ajout */}
        <AjoutModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
          }} 
        />

        {/* Modal de modification */}
        <ModifierModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

        {/* Modal de suppression */}
        <SupprimerModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />

      </div>
    </AppLayout>
  );
}