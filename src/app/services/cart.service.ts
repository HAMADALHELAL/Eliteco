import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environments';

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

export interface GuestInfo {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CheckoutResponse {
  message: string;
  paymentUrl: string;
  paymentId: string;
  subtotal: number;
  total: number;
}

// هذا هو شكل الرد من الـ backend
interface CartApiResponse {
  cart: {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
}

const GUEST_KEY = 'elite_guest_id';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/cart`;

  private _cart$ = new BehaviorSubject<CartState>({
    items: [],
    totalAmount: 0,
  });

  cart$: Observable<CartState> = this._cart$.asObservable();

  cartCount$ = this.cart$.pipe(
    map((state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0)
    )
  );

  private ensureGuestId(): string {
    let id = localStorage.getItem(GUEST_KEY);
    if (!id) {
      id = (crypto as any).randomUUID?.() ?? Date.now().toString();
      localStorage.setItem(GUEST_KEY, id!);
    }
    return id!;
  }

  // تحميل السلة من الـ backend
  loadCart(): Observable<CartState> {
    const guestId = this.ensureGuestId();
    const params = new HttpParams().set('guestId', guestId);

    return this.http
      .get<CartApiResponse>(this.base, { params })
      .pipe(
        tap((res) => this.setFromApi(res)),
        map(() => this._cart$.value)
      );
  }

  // إضافة منتج للسلة
  addToCart(productId: string, quantity: number = 1): Observable<CartState> {
    const guestId = this.ensureGuestId();

    return this.http
      .post<CartApiResponse>(`${this.base}/add`, {
        productId,
        quantity,
        guestId,
      })
      .pipe(
        tap((res) => this.setFromApi(res)),
        map(() => this._cart$.value)
      );
  }

  // 🧾 Checkout للسلة الحالية (يبدأ عملية الدفع)
  checkout(guestInfo?: GuestInfo): Observable<CheckoutResponse> {
    const guestId = this.ensureGuestId();

    const payload = {
      guestId,
      guestInfo: guestInfo ?? {
        firstName: 'Guest',
        email: 'guest@example.com',
      },
      paymentDetails: {
        method: 'knet', // تتماشى مع الباكند (paymentGateway.src)
      },
    };

    return this.http.post<CheckoutResponse>(`${this.base}/checkout`, payload);
  }

  // تحديث الحالة الداخلية من رد الـ API
  private setFromApi(res: CartApiResponse): void {
    const items: CartItem[] =
      res.cart?.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })) ?? [];

    this._cart$.next({
      items,
      totalAmount: res.totalAmount ?? 0,
    });
  }
}
