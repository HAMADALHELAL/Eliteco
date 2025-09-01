import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: AuthUser | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // ✅ load currently logged-in user
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('❌ Failed to load admin profile:', err);
      }
    });
  }

  // ✅ check if user is admin
  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
}
