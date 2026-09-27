import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ContactMessage, MessageReply } from '../../models/contact-message.model';

@Component({
  selector: 'app-admincontact',
  templateUrl: './admincontact.component.html',
  styleUrls: ['./admincontact.component.scss']
})
export class AdmincontactComponent implements OnInit, OnDestroy {
  messages$!: Observable<ContactMessage[]>;
  unreadCount$!: Observable<number>;
  totalCount$!: Observable<number>;

  private destroy$ = new Subject<void>();

  // Recherche et filtrage
  searchTerm = '';
  filterStatus: 'all' | 'unread' | 'read' | 'replied' = 'all';

  // Réponse en cours
  activeReplyKey: string | null = null;
  replyText = '';
  isSendingReply = false;
  adminUid = '';

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.adminUid = user.uid;
      }
    });

    // Écoute du nœud 'messages' au lieu de 'contacts'
    const messagesRef = this.db
      .list<ContactMessage>('messages')
      .snapshotChanges();

    const allMessages$: Observable<ContactMessage[]> = messagesRef.pipe(
      map(changes =>
        changes
          .map(c => ({
            key: c.payload.key || undefined,
            ...(c.payload.val() as Omit<ContactMessage, 'key'>)
          }))
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
      ),
      takeUntil(this.destroy$)
    );

    this.unreadCount$= allMessages$.pipe(
      map(messages => messages.filter(m => m.status === 'unread').length)
    );

    this.totalCount$= allMessages$.pipe(
      map(messages => messages.length)
    );

    this.messages$= allMessages$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterMessages(messages: ContactMessage[]): ContactMessage[] {
    return messages.filter(msg => {
      const matchesStatus =
        this.filterStatus === 'all' || msg.status === this.filterStatus;

      const term = this.searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        msg.userName?.toLowerCase().includes(term) ||
        msg.userEmail?.toLowerCase().includes(term) ||
        msg.userId?.toLowerCase().includes(term) ||
        msg.subject?.toLowerCase().includes(term) ||
        msg.message?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }

  setFilter(status: 'all' | 'unread' | 'read' | 'replied'): void {
    this.filterStatus = status;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  // ============================================
  // LOGIQUE DE RÉPONSE ET NOTIFICATIONS
  // ============================================

  toggleReplyForm(key: string, event?: Event): void {
    event?.stopPropagation();
    if (this.activeReplyKey === key) {
      this.activeReplyKey = null;
      this.replyText = '';
    } else {
      this.activeReplyKey = key;
      this.replyText = '';
    }
  }

  async sendReply(msg: ContactMessage): Promise<void> {
    if (!msg.key || !this.replyText.trim()) return;

    this.isSendingReply = true;

    try {
      const replyData: MessageReply = {
        senderId: this.adminUid || 'admin',
        senderRole: 'admin',
        message: this.replyText.trim(),
        createdAt: new Date().toISOString()
      };

      // 1. Ajouter la réponse sous le message
      await this.db.list(`messages/${msg.key}/replies`).push(replyData);

      // 2. Mettre à jour le statut du message principal
      await this.db.object(`messages/${msg.key}`).update({ status: 'replied' });

      // 3. Envoyer une notification directe à l'utilisateur
      const notificationData = {
        title: 'Nouvelle réponse de Charly Guitare',
        message: `L'équipe a répondu à votre message : "${msg.subject}"`,
        messageId: msg.key,
        read: false,
        createdAt: new Date().toISOString()
      };

      await this.db.list(`notifications/${msg.userId}`).push(notificationData);

      // Réinitialisation
      this.activeReplyKey = null;
      this.replyText = '';
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse :', error);
      alert('Impossible d\'envoyer la réponse. Veuillez réessayer.');
    } finally {
      this.isSendingReply = false;
    }
  }

  getRepliesArray(replies: any): MessageReply[] {
    if (!replies) return [];
    if (Array.isArray(replies)) return replies;
    return Object.keys(replies).map(key => ({
      key,
      ...replies[key]
    }));
  }

  // ============================================
  // AUTRES ACTIONS
  // ============================================

  markAsRead(key: string, event?: Event): void {
    event?.stopPropagation();
    if (!key) return;
    this.db.object(`messages/${key}`).update({ status: 'read' });
  }

  markAsUnread(key: string, event?: Event): void {
    event?.stopPropagation();
    if (!key) return;
    this.db.object(`messages/${key}`).update({ status: 'unread' });
  }

  markAllAsRead(messages: ContactMessage[]): void {
    const unreadMessages = messages.filter(m => m.status === 'unread' && m.key);
    if (unreadMessages.length === 0) return;

    const count = unreadMessages.length;
    if (!confirm(`Marquer ${count} message${count > 1 ? 's' : ''} comme lu${count > 1 ? 's' : ''} ?`)) {
      return;
    }

    unreadMessages.forEach(msg => {
      if (msg.key) {
        this.db.object(`messages/${msg.key}`).update({ status: 'read' });
      }
    });
  }

  deleteMessage(key: string, event?: Event): void {
    event?.stopPropagation();
    if (!key) return;
    if (confirm('Voulez-vous vraiment supprimer ce message et son fil de discussion ?')) {
      this.db.object(`messages/${key}`).remove();
    }
  }

  trackByKey(index: number, msg: ContactMessage): string {
    return msg.key || index.toString();
  }

  getInitials(fullName: string): string {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getAvatarColor(fullName: string): string {
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
    if (!fullName) return colors[0];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}