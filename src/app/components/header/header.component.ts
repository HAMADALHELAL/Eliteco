import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import {
  CartService,
  CartState,
} from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuthed = false;

  cart$: Observable<CartState>;
  cartCount = 0;
  isCartOpen = false;
  isCheckingOut = false;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private auth: AuthService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');

    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment && isPlatformBrowser(this.platformId)) {
        const el = document.getElementById(fragment);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedLang =
        localStorage.getItem('lang') ||
        this.translate.getBrowserLang() ||
        'en';
      this.switchLang(savedLang);
    }

    this.auth.isAuthed$.subscribe((authed: boolean) => {
      this.isAuthed = authed;
    });

    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });

    this.cartService.loadCart().subscribe({
      next: () => {},
      error: (err: any) => console.error('❌ loadCart error', err),
    });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    }
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  // ✅ Checkout → يجيب paymentUrl ويرسل المستخدم لبوابة الدفع
  onCheckout(): void {
    if (this.isCheckingOut) return;

    this.isCheckingOut = true;

    this.cartService.checkout().subscribe({
      next: (res) => {
        console.log('✅ Checkout response:', res);
        this.isCheckingOut = false;
        this.isCartOpen = false;

        if (res && res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          alert('Cannot start payment (missing payment URL)');
        }
      },
      error: (err) => {
        console.error('❌ Checkout error', err);
        this.isCheckingOut = false;
        const msg = err?.error?.message || 'Checkout failed';
        alert(msg);
      },
    });
  }
}
