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
  subscribersCount?: number;
  media?: { videos: { url: string }[] };
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  course: Course | null = null;
  isSubscribed = false;
  loading = true;
  selectedVideoIndex = 0; // 👈 which video is selected

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadCourse(id);
  }

  /** 🧠 Load course & check subscription **/
  private loadCourse(id: string) {
    this.http.get<Course>(`${environment.apiBase}/courses/${id}`).subscribe({
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

  /** 🔍 Check subscription **/
  checkSubscription(courseId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No token found. User is not logged in.');
      this.isSubscribed = false;
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<{ subscribed: boolean }>(
        `${environment.apiBase}/users/check-subscription/${courseId}`,
        { headers }
      )
      .subscribe({
        next: (res) => {
          console.log('✅ Subscription check response:', res);
          this.isSubscribed = res.subscribed;
        },
        error: (err) => {
          console.error('❌ Subscription check failed:', err);
          this.isSubscribed = false;
        },
      });
  }

  /** 💳 Subscribe (mock or real) **/
  subscribe(courseId: string) {
    this.paymentService.createPayment(courseId).subscribe({
      next: (res) => {
        if ((res as any).subscribed) {
          this.isSubscribed = true;
          if (this.course)
            this.course.subscribersCount =
              (this.course.subscribersCount || 0) + 1;
          alert('✅ You are now subscribed to this course!');
        } else if ((res as any).paymentUrl) {
          window.location.href = (res as any).paymentUrl;
        } else {
          alert('⚠️ Unexpected response from server.');
        }
      },
      error: (err) => {
        console.error('❌ Payment init failed:', err);
        alert(err.error?.message || 'Failed to initialize payment.');
      },
    });
  }

  /** 🎞 Change active video **/
  selectVideo(index: number) {
    this.selectedVideoIndex = index;
  }

  /** ✅ Always return safe array for iteration **/
  get videos() {
    return this.course?.media?.videos ?? [];
  }
}
