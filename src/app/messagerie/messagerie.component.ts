import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject, of } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MessageReply, UserMessage } from '../models/user-message.model';
 
@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.scss']
})
export class MessagerieComponent implements OnInit {

 messages$!: Observable<UserMessage[]>;
  currentUser: any = null;
  private destroy$ = new Subject<void>();

  selectedMessage: UserMessage | null = null;
  replyText = '';
  isSending = false;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.messages$ = this.afAuth.authState.pipe(
      takeUntil(this.destroy$),
      switchMap(user => {
        if (!user) return of([]);
        this.currentUser = user;

        return this.db
          .list<UserMessage>('messages', ref =>
            ref.orderByChild('userId').equalTo(user.uid)
          )
          .snapshotChanges()
          .pipe(
            map(changes => {
              const list = changes
                .map(c => ({
                  key: c.payload.key || undefined,
                  ...(c.payload.val() as Omit<UserMessage, 'key'>)
                }))
                .sort((a, b) => {
                  const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                  const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                  return dateB - dateA;
                });

              // Synchroniser automatiquement le message sélectionné si des nouvelles réponses arrivent
              if (this.selectedMessage) {
                const updated = list.find(m => m.key === this.selectedMessage?.key);
                if (updated) {
                  this.selectedMessage = updated;
                }
              }

              return list;
            })
          );
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectMessage(msg: UserMessage): void {
    this.selectedMessage = msg;
    this.replyText = '';
  }

  closeThread(): void {
    this.selectedMessage = null;
    this.replyText = '';
  }

  // Convertit les réponses en tableau ordonné par date
  getRepliesArray(replies: any): MessageReply[] {
    if (!replies) return [];
    if (Array.isArray(replies)) return replies;
    return Object.keys(replies)
      .map(key => ({
        key,
        ...replies[key]
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Permet à l'utilisateur de répondre à nouveau
  async sendReply(): Promise<void> {
    if (!this.selectedMessage?.key || !this.replyText.trim() || !this.currentUser) return;

    this.isSending = true;

    try {
      const replyData: MessageReply = {
        senderId: this.currentUser.uid,
        senderRole: 'user',
        message: this.replyText.trim(),
        createdAt: new Date().toISOString()
      };

      // 1. Ajouter la réponse sous le nœud 'replies' du message
      await this.db
        .list(`messages/${this.selectedMessage.key}/replies`)
        .push(replyData);

      // 2. Basculer le statut à 'unread' pour alerter l'admin de la nouvelle relance
      await this.db
        .object(`messages/${this.selectedMessage.key}`)
        .update({ status: 'unread' });

      // Réinitialiser la zone de saisie
      this.replyText = '';

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse :', error);
      alert('Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      this.isSending = false;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'replied':
        return 'badge-replied';
      case 'read':
        return 'badge-read';
      default:
        return 'badge-unread';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'replied':
        return 'Répondu';
      case 'read':
        return 'Lu par l\'équipe';
      default:
        return 'En attente';
    }
  }
} 