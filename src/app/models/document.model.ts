export interface DocumentItem {
  key?: string;
  title: string;
  description: string;
  type: string;        // Ex: 'Méthode', 'Livre Numérique', 'Partition', 'Support Pédagogique'
  typeClass: string;   // Ex: 'type-methode', 'type-livre', 'type-partition', 'type-support'
  icon: string;        // Ex: '📙', '📘', '🎼', '📐', '📑', '🎵'
  format: string;      // Ex: '📄 PDF (45 pages)', '🖼️ Image HD / PDF'
  level: string;       // Ex: '⚡ Débutant', '⚡ Intermédiaire', '⚡ Avancé', '⚡ Tous niveaux'
  downloadUrl: string; // Lien de téléchargement (ex: stockage Firebase ou lien externe)
  createdAt?: string;  // Date d'ajout
}

export interface DocumentType {
  label: string;
  class: string;
  icon: string;
  color: string;
}