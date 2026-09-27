import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { UserMessage } from '../models/user-message.model';
 
export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({ position: 'absolute', width: '100%', opacity: 0 })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(12px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('180ms ease-out', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('280ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  mobileMenuOpen = false;
  unreadMessages = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    // Restaure l'état de la sidebar
    const saved = localStorage.getItem('admin_sidebar_collapsed');
    this.sidebarCollapsed = saved === 'true';

    // Récupère le nombre de messages non lus depuis le nœud 'messages'
    this.db.list<UserMessage>('messages').snapshotChanges().pipe(
      map(changes =>
        changes.filter(c => (c.payload.val() as UserMessage)?.status === 'unread').length
      ),
      takeUntil(this.destroy$)
    ).subscribe(count => this.unreadMessages = count);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout(): void {
    this.closeMobileMenu();
    this.auth.logout();
    this.router.navigate(['/']);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('admin_sidebar_collapsed', String(this.sidebarCollapsed));
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.onLogout();
    }
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['animation'] || 
           outlet?.activatedRoute?.snapshot?.url?.join('/') || '';
  }

  get currentPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/admin/contact') || url.includes('/admin/messages')) return 'Messages';
    if (url.includes('/admin/documents')) return 'Documents';
    if (url.includes('/admin/settings')) return 'Paramètres';
    return 'Dashboard';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth > 768 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}