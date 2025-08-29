import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoginDto } from '../../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private translate: TranslateService,
    private auth: AuthService,
    private router: Router
  ) {}

  signIn() {
    if (!this.email || !this.password) {
      this.errorMessage = this.translate.instant('required_error');
      return;
    }

    const dto: LoginDto = { email: this.email, password: this.password };

    this.auth.login(dto).subscribe({
      next: () => {
        this.errorMessage = '';
        // redirect after success
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || this.translate.instant('login_failed');
      },
    });
  }
}
