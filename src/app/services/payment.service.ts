import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = `${environment.apiBase}/payments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 🔹 دفع كورس
  createCoursePayment(courseId: string): Observable<{ paymentUrl: string }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ paymentUrl: string }>(
      `${this.base}`,
      { type: 'course', courseId },
      { headers }
    );
  }

  // 🔹 دفع منتج واحد (إن احتجته)
  createProductPayment(productId: string): Observable<{ paymentUrl: string }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ paymentUrl: string }>(
      `${this.base}`,
      { type: 'product', productId },
      { headers }
    );
  }
}
