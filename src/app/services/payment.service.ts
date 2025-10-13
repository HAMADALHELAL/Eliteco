import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = `${environment.apiBase}/payments`;

  constructor(private http: HttpClient) {}

  // 🔹 Start the payment process
  createPayment(courseId: string): Observable<{ paymentUrl: string }> {
    const token = localStorage.getItem('token'); // ✅ must exist
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.post<{ paymentUrl: string }>(
      `${this.base}`,
      { courseId },
      { headers }
    );
  }
  
}
