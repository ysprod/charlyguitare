import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  profileForm!: FormGroup;
  avatarPreview: string | null = null;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: ['', [Validators.maxLength(500)]],
      website: [''],
      youtube: [''],
      instagram: [''],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    });
  }

  private loadUserData(): void {
    // Simulation du chargement des données existantes
    this.profileForm.patchValue({
      fullName: 'Kotchi Kacou Jean-Charles',
      displayName: 'Charly Guitare',
      email: 'contact@charlyguitare.com',
      phone: '+225 07 00 00 00 00',
      bio: 'Musicien professionnel ivoirien, arrangeur, auteur-compositeur et lauréat PRIMUD 2019.',
      website: 'https://charlyguitare.com',
      youtube: 'https://youtube.com/@charlyguitare',
      instagram: '@charly_guitare_officiel'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = "La taille de l'image ne doit pas dépasser 2 Mo.";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }

    this.isSubmitting = true;

    // Simulation d'un appel API (ex: Service HTTP Angular)
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = "Votre profil a été mis à jour avec succès !";
    }, 1200);
  }

  onReset(): void {
    this.loadUserData();
    this.successMessage = null;
    this.errorMessage = null;
  }

}
