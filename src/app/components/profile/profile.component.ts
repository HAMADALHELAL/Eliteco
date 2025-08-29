import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';   // ✅ import Router + RouterModule
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],   // ✅ add RouterModule
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: AuthUser | null = null;

  constructor(private auth: AuthService, private router: Router) {}  // ✅ inject Router

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('❌ Failed to load profile:', err);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);   // ✅ now works
  }
}
