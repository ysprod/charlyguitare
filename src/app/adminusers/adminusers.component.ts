import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserProfile } from '../models/user.model';
import { UserAdminService } from '../services/user-admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type UserRole = 'admin' | 'user' | 'subscriber';
export type UserRoleFilter = 'all' | UserRole;
export type UserStatusFilter = 'all' | 'active' | 'disabled';

interface UserFilters {
  search: string;
  role: UserRoleFilter;
  status: UserStatusFilter;
}

interface UserStats {
  total: number;
  admins: number;
  subscribers: number;
  active: number;
}

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminusersComponent implements OnInit {
  // Source de données réactive
  private rawUsers$!: Observable<UserProfile[]>;
  
  // Sujets pour la gestion de l'état des filtres
  readonly searchFilter$ = new BehaviorSubject<string>('');
  readonly roleFilter$ = new BehaviorSubject<UserRoleFilter>('all');
  readonly statusFilter$ = new BehaviorSubject<UserStatusFilter>('all');

  // Flux combinés et mémorisés
  filteredUsers$!: Observable<UserProfile[]>;
  stats$!: Observable<UserStats>;

  readonly roleLabels: Record<UserRole, string> = {
    admin: 'Administrateur',
    user: 'Utilisateur',
    subscriber: 'Abonné'
  };

  private readonly avatarColors = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
    '#f97316', '#06b6d4'
  ];

  constructor(
    private readonly userService: UserAdminService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // 1. Chargement de la donnée brute et partage du flux
    this.rawUsers$ = this.userService.getUsers().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // 2. Calcul réactif des statistiques
    this.stats$ = this.rawUsers$.pipe(
      map(users => users.reduce(
        (acc, user) => {
          acc.total++;
          if (user.role === 'admin') acc.admins++;
          if (user.role === 'subscriber') acc.subscribers++;
          if (!user.disabled) acc.active++;
          return acc;
        },
        { total: 0, admins: 0, subscribers: 0, active: 0 }
      ))
    );

    // 3. Combinaison réactive des filtres et de la liste
    this.filteredUsers$ = combineLatest([
      this.rawUsers$,
      this.searchFilter$,
      this.roleFilter$,
      this.statusFilter$
    ]).pipe(
      map(([users, search, role, status]) => 
        this.applyFilters(users, { search, role, status })
      )
    );
  }

  /**
   * Applique les filtres de manière pure
   */
  private applyFilters(users: UserProfile[], filters: UserFilters): UserProfile[] {
    const term = filters.search.toLowerCase().trim();

    return users.filter(user => {
      const matchesSearch = !term ||
        user.email?.toLowerCase().includes(term) ||
        user.displayName?.toLowerCase().includes(term);

      const matchesRole = filters.role === 'all' || user.role === filters.role;

      const matchesStatus = filters.status === 'all' ||
        (filters.status === 'active' && !user.disabled) ||
        (filters.status === 'disabled' && user.disabled);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  /**
   * Actions utilisateur avec Async/Await & Try-Catch
   */
  async changeRole(user: UserProfile, newRole: UserRole): Promise<void> {
    if (!user.uid) return;

    try {
      await this.userService.updateUserRole(user.uid, newRole);
      this.showToast(`✓ Rôle mis à jour : ${this.roleLabels[newRole] || newRole}`, 'success');
    } catch {
      this.showToast('✕ Erreur lors de la mise à jour du rôle', 'error');
    }
  }

  async toggleStatus(user: UserProfile): Promise<void> {
    if (!user.uid) return;
    const newStatus = !user.disabled;
    const action = newStatus ? 'désactivé' : 'activé';

    try {
      await this.userService.toggleUserStatus(user.uid, newStatus);
      this.showToast(`✓ Compte ${action}`, 'success');
    } catch {
      this.showToast(`✕ Impossible de ${newStatus ? 'désactiver' : 'activer'} ce compte`, 'error');
    }
  }

  async deleteUser(user: UserProfile): Promise<void> {
    if (!user.uid) return;
    const name = user.displayName || user.email;

    if (confirm(`Supprimer définitivement le compte de "${name}" ?\n\nCette action est irréversible.`)) {
      try {
        await this.userService.deleteUserDoc(user.uid);
        this.showToast('✓ Utilisateur supprimé', 'success');
      } catch {
        this.showToast('✕ Erreur lors de la suppression', 'error');
      }
    }
  }

  /**
   * Utilitaires UI
   */
  resetFilters(): void {
    this.searchFilter$.next('');
    this.roleFilter$.next('all');
    this.statusFilter$.next('all');
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getAvatarColor(name?: string): string {
    if (!name) return this.avatarColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  }

  copyUid(uid?: string): void {
    if (!uid) return;
    navigator.clipboard.writeText(uid).then(() =>
      this.showToast('✓ UID copié', 'success', 2000)
    );
  }

  trackByUid(_: number, user: UserProfile): string {
    return user.uid || '';
  }

  private showToast(message: string, type: 'success' | 'error', duration = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error']
    });
  }
}