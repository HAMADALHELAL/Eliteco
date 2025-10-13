import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { PaymentService } from '../../services/payment.service';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  media?: { videos?: { url: string }[] };
}

@Component({
  selector: 'app-course',
  standalone: true, // ✅ this must be here (not inside interface)
  imports: [CommonModule, CurrencyPipe], // ✅ add it here
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  course: Course | null = null;
  isSubscribed = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http
        .get<Course>(`${environment.apiBase}/courses/${id}`)
        .subscribe({
          next: (res) => {
            this.course = res;
            this.loading = false;
            this.checkSubscription(id);
          },
          error: (err) => {
            console.error('❌ Error loading course:', err);
            this.loading = false;
          },
        });
    }
  }

  checkSubscription(courseId: string) {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http
      .get<{ subscribed: boolean }>(
        `${environment.apiBase}/users/check-subscription/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .subscribe({
        next: (res) => (this.isSubscribed = res.subscribed),
        error: (err) => console.error('Subscription check failed:', err),
      });
  }

  // 💳 Start Upayment checkout
  subscribe(courseId: string) {
    this.paymentService.createPayment(courseId).subscribe({
      next: (res) => {
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl; // redirect to Upayment checkout
        } else {
          alert('Payment link not received.');
        }
      },
      error: (err) => {
        console.error('❌ Payment init failed:', err);
        alert(err.error?.message || 'Failed to initialize payment.');
      },
    });
  }
}
