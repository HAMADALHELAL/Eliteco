import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private translate: TranslateService) {}

  async register() {
    if (!this.email || !this.password) {
      this.errorMessage = this.translate.instant('required_error');
      return;
    }

    console.log('User registered:', { email: this.email, password: this.password });
    alert('✅ ' + this.translate.instant('sign_up') + ' successful (demo mode)!');
    this.errorMessage = '';
    this.email = '';
    this.password = '';
  }
}
