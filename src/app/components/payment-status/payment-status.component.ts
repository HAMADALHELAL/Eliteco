import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ import this

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule], // ✅ add this line
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css'],
})
export class PaymentStatusComponent implements OnInit {
  status: 'success' | 'failed' = 'failed';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const fullUrl = window.location.href;
    const matches = fullUrl.match(/result=([^&]+)/g);
    let resultValue = '';

    if (matches && matches.length > 0) {
      resultValue = decodeURIComponent(matches[matches.length - 1].split('=')[1]);
    } else {
      resultValue = decodeURIComponent(this.route.snapshot.queryParamMap.get('result') || '');
    }

    const result = resultValue.trim().toUpperCase();

    if (result === 'CAPTURED' || result === 'SUCCESS') {
      this.status = 'success';
    } else {
      this.status = 'failed';
    }
  }
}
