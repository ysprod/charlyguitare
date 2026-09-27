import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { DocumentItem, DocumentType } from '../../models/document.model';

@Component({
  selector: 'app-admindocuments',
  templateUrl: './admindocuments.component.html',
  styleUrls: ['./admindocuments.component.scss']
})
export class AdmindocumentsComponent implements OnInit, OnDestroy {
  documents$!: Observable<DocumentItem[]>;
  filteredDocuments$!: Observable<DocumentItem[]>;
  docForm!: FormGroup;
  isSubmitting = false;
  editingKey: string | null = null;

  // Notifications toast
  toast: { show: boolean; type: 'success' | 'error' | 'info'; message: string } = {
    show: false,
    type: 'success',
    message: ''
  };

  // Recherche & filtres
  searchTerm = '';
  filterType = 'all';
  filterLevel = 'all';

  // Stats
  stats = {
    total: 0,
    byType: {} as Record<string, number>
  };

  private destroy$ = new Subject<void>();

  types: DocumentType[] = [
    { label: 'Méthode', class: 'type-methode', icon: '📙', color: '#f59e0b' },
    { label: 'Livre Numérique', class: 'type-livre', icon: '📘', color: '#3b82f6' },
    { label: 'Partition', class: 'type-partition', icon: '🎼', color: '#a855f7' },
    { label: 'Support Pédagogique', class: 'type-support', icon: '📑', color: '#10b981' }
  ];

  levels = ['⚡ Débutant', '⚡ Intermédiaire', '⚡ Avancé', '⚡ Tous niveaux'];

  formats = [
    '📄 PDF',
    '📄 PDF + Audio',
    '🎵 Audio MP3',
    '🎬 Vidéo',
    '📚 EPUB'
  ];

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDocuments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialisation du formulaire
   */
  private initForm(): void {
    this.docForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      type: ['Méthode', Validators.required],
      level: ['⚡ Tous niveaux', Validators.required],
      format: ['📄 PDF', Validators.required],
      downloadUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  /**
   * Chargement des documents avec statistiques
   */
  private loadDocuments(): void {
    const docs$ = this.db.list<DocumentItem>('documents').snapshotChanges().pipe(
      map(changes =>
        changes
          .map(c => ({
            key: c.payload.key || undefined,
            ...(c.payload.val() as Omit<DocumentItem, 'key'>)
          }))
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
      ),
      takeUntil(this.destroy$)
    );

    this.documents$ = docs$;

    // Stats
    docs$.pipe(takeUntil(this.destroy$)).subscribe(docs => {
      this.stats.total = docs.length;
      this.stats.byType = {};
      docs.forEach(d => {
        this.stats.byType[d.type] = (this.stats.byType[d.type] || 0) + 1;
      });
    });

    // Liste filtrée
    this.filteredDocuments$ = docs$;
  }

  /**
   * Applique les filtres et la recherche
   */
  applyFilters(documents: DocumentItem[]): DocumentItem[] {
    return documents.filter(doc => {
      const matchesType = this.filterType === 'all' || doc.type === this.filterType;
      const matchesLevel = this.filterLevel === 'all' || doc.level === this.filterLevel;

      const term = this.searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        doc.title?.toLowerCase().includes(term) ||
        doc.description?.toLowerCase().includes(term) ||
        doc.format?.toLowerCase().includes(term);

      return matchesType && matchesLevel && matchesSearch;
    });
  }

  /**
   * Soumission du formulaire (ajout ou mise à jour)
   */
  async onSubmit(): Promise<void> {
    if (this.docForm.invalid) {
      this.docForm.markAllAsTouched();
      this.showToast('error', 'Veuillez corriger les erreurs du formulaire.');
      return;
    }

    this.isSubmitting = true;

    const selectedTypeObj =
      this.types.find(t => t.label === this.docForm.value.type) || this.types[0];

    const docData: Omit<DocumentItem, 'key'> = {
      ...this.docForm.value,
      typeClass: selectedTypeObj.class,
      icon: selectedTypeObj.icon
    };

    try {
      if (this.editingKey) {
        // Mise à jour
        await this.db.object(`documents/${this.editingKey}`).update(docData);
        this.showToast('success', 'Document mis à jour avec succès !');
        this.editingKey = null;
      } else {
        // Ajout
        const newDoc = {
          ...docData,
          createdAt: new Date().toISOString(),
          views: 0,
          downloads: 0
        };
        await this.db.list('documents').push(newDoc);
        this.showToast('success', 'Document ajouté avec succès !');
      }
      this.resetForm();
    } catch (error) {
      console.error('Erreur :', error);
      this.showToast('error', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Édition d'un document
   */
  editDocument(doc: DocumentItem): void {
    if (!doc.key) return;

    this.editingKey = doc.key;
    this.docForm.patchValue({
      title: doc.title,
      description: doc.description,
      type: doc.type,
      level: doc.level,
      format: doc.format,
      downloadUrl: doc.downloadUrl
    });

    // Scroll vers le formulaire
    document.querySelector('.form-card')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  /**
   * Annule l'édition
   */
  cancelEdit(): void {
    this.editingKey = null;
    this.resetForm();
  }

  /**
   * Réinitialise le formulaire
   */
  private resetForm(): void {
    this.docForm.reset({
      type: 'Méthode',
      level: '⚡ Tous niveaux',
      format: '📄 PDF'
    });
    this.docForm.markAsPristine();
    this.docForm.markAsUntouched();
  }

  /**
   * Suppression d'un document
   */
  async deleteDocument(key: string, title: string): Promise<void> {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      await this.db.object(`documents/${key}`).remove();
      this.showToast('info', `"${title}" a été supprimé.`);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      this.showToast('error', 'Impossible de supprimer ce document.');
    }
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.searchTerm = '';
    this.filterType = 'all';
    this.filterLevel = 'all';
  }

  /**
   * Vérifie si un champ est invalide
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.docForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Récupère le message d'erreur d'un champ
   */
  getFieldError(fieldName: string): string {
    const field = this.docForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Ce champ est obligatoire.';
    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} caractères.`;
    }
    if (field.errors['maxlength']) {
      return `Maximum ${field.errors['maxlength'].requiredLength} caractères.`;
    }
    if (field.errors['pattern']) {
      return 'L\'URL doit commencer par http:// ou https://';
    }
    return 'Champ invalide.';
  }

  /**
   * Affiche une notification toast
   */
  private showToast(type: 'success' | 'error' | 'info', message: string): void {
    this.toast = { show: true, type, message };
    setTimeout(() => (this.toast.show = false), 4000);
  }

  /**
   * Retourne la couleur d'un type
   */
  getTypeColor(typeLabel: string): string {
    return this.types.find(t => t.label === typeLabel)?.color || '#6366f1';
  }

  /**
   * TrackBy pour la liste
   */
  trackByKey(index: number, doc: DocumentItem): string {
    return doc.key || index.toString();
  }
}