import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, RegisterDto } from "../../../services/auth.service";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-register",
  standalone: true,
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
})
export class RegisterComponent {
  firstName = "";
  lastName = "";
  username = "";
  email = "";
  password = "";
  confirmPassword = "";

  // 👇 role is always student
  role: "student" = "student";

  loading = false;
  errorMessage: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  register(): void {
    this.errorMessage = null;
  
    // ✅ check confirm password
    if (this.password !== this.confirmPassword) {
      this.errorMessage = this.translate.instant("password_mismatch_error");
      return;
    }
  
    const dto: RegisterDto = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      username: this.username.trim(),
      role: "student", // 👈 default role
      email: this.email.trim().toLowerCase(), // 👈 normalize to lowercase
      password: this.password,
    };
  
    this.loading = true;
    this.auth.register(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/"]); // redirect to home
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.errors) {
          this.errorMessage = Object.values(err.error.errors).join(" ");
        } else {
          this.errorMessage =
            err.error?.message || this.translate.instant("register_failed");
        }
      },
    });
  }
  
}
