import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, RegisterDto } from "../../../services/auth.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  imports: [FormsModule],
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  // form model
  firstName = "";
  lastName = "";
  username = "";
  role: "student" | "teacher" | "" = "";
  email = "";
  password = "";
  confirmPassword = "";

  // UI state
  loading = false;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    this.errorMessage = null;

    // ✅ client-side confirm password check
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    const dto: RegisterDto = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      username: this.username.trim(),
      role: this.role as "student" | "teacher",
      email: this.email.trim(),
      password: this.password,
    };

    this.loading = true;
    this.auth.register(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/"]); // redirect to home or dashboard
      },
      error: (err) => {
        this.loading = false;
        // ✅ backend sends either `errors` object or `message`
        if (err.error?.errors) {
          this.errorMessage = Object.values(err.error.errors).join(" ");
        } else {
          this.errorMessage = err.error?.message || "Registration failed.";
        }
      },
    });
  }
}
