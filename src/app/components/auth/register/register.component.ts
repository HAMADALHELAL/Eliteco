// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterDto } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // form fields required by backend
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'student' | 'teacher' | '' = '';

  errorMessage = '';
  loading = false;

  constructor(
    private translate: TranslateService,
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.errorMessage = '';

    // basic client-side checks
    if (!this.firstName || !this.lastName || !this.username || !this.email || !this.password || !this.confirmPassword || !this.role) {
      this.errorMessage = this.translate.instant('required_error');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = this.translate.instant('password_mismatch_error');
      return;
    }

    const dto: RegisterDto = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role as 'student' | 'teacher'
    };

    this.loading = true;
    this.auth.register(dto).subscribe({
      next: _res => {
        this.loading = false;
        // token is already saved by the service (tap)
        // choose where to go: login or dashboard
        this.router.navigateByUrl('/login');
      },
      error: err => {
        this.loading = false;

        // Map backend error shapes → string for UI
        const m =
          // 400 with detailed field errors
          (err?.error?.errors && Object.values(err.error.errors).join(' ')) ||
          // 403 conflict / taken field
          err?.error?.message ||
          // 400 invalid role
          err?.error?.error ||
          this.translate.instant('something_went_wrong');

        this.errorMessage = m;
      }
    });
  }
}
