import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule,RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private translate: TranslateService) {}

  async signIn() {
    if (!this.email || !this.password) {
      this.errorMessage = this.translate.instant('required_error');
      return;
    }

    // Simulate login success
    console.log('User signed in:', { email: this.email, password: this.password });
    alert('✅ ' + this.translate.instant('sign_in') + ' successful (demo mode)!');
    this.errorMessage = '';
    this.email = '';
    this.password = '';
  }
}
