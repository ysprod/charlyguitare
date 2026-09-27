import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(private db: AngularFireDatabase) {}

  /**
   * Récupère tous les utilisateurs enregistrés dans Realtime Database
   * sous le nœud /users et trie les résultats par email.
   */
  getUsers(): Observable<UserProfile[]> {
    return this.db.list<UserProfile>('users').snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.val() as UserProfile;
          const uid = a.key || data.uid; // Récupère la clé de l'objet si `uid` n'est pas explicite
          return { ...data, uid };
        })
      ),
      // Tri côté client par e-mail
      map(users => users.sort((a, b) => (a.email || '').localeCompare(b.email || '')))
    );
  }

  /**
   * Met à jour le rôle d'un utilisateur sous /users/{uid}
   */
  updateUserRole(uid: string, role: 'admin' | 'user' | 'subscriber'): Promise<void> {
    return this.db.object(`users/${uid}`).update({ role });
  }

  /**
   * Active ou désactive un compte sous /users/{uid}
   */
  toggleUserStatus(uid: string, disabled: boolean): Promise<void> {
    return this.db.object(`users/${uid}`).update({ disabled });
  }

  /**
   * Supprime l'enregistrement utilisateur sous /users/{uid}
   */
  deleteUserDoc(uid: string): Promise<void> {
    return this.db.object(`users/${uid}`).remove();
  }
}