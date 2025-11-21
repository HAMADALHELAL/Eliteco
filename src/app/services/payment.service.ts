// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

interface PaymentResponse {
  paymentUrl?: string;
  subscribed?: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private base = `${environment.apiBase}/payments`;

  constructor(private http: HttpClient) {}

  createPayment(courseId: string): Observable<PaymentResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<PaymentResponse>(
      `${this.base}`,
      { courseId },
      { headers }
    );
  }
}
