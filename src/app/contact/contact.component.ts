import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initForm();
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const contactData = {
      ...this.contactForm.value,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    try {
      await this.db.list('contacts').push(contactData);
      this.submitSuccess = true;
      this.contactForm.reset();
    } catch (error: any) {
      this.submitError = true;
      this.errorMessage = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
      console.error('Erreur Realtime Database :', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  get f() {
    return this.contactForm.controls;
  }

}