import { Component, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CourseService, Course } from '../../services/course.service';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environments';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule],
})
export class HomeComponent implements OnInit {
  currentLang: string = 'en';
  courses: Course[] = [];

  // 🛒 المنتجات
  products: Product[] = [];
  backendBase = environment.apiBase.replace('/api', '');

  // 🪟 حالة المودال
  selectedProduct: Product | null = null;
  selectedQty: number = 1;
  modalLoading = false;

  constructor(
    private translate: TranslateService,
    private courseService: CourseService,
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang =
        localStorage.getItem('lang') ||
        this.translate.getBrowserLang() ||
        'en';
      this.switchLang(savedLang);

      this.translate.onLangChange.subscribe((event) => {
        this.currentLang = event.lang;
      });

      this.currentLang = this.translate.currentLang || 'en';
    } else {
      this.currentLang = this.translate.getDefaultLang() || 'en';
    }

    this.loadCourses();
    this.loadProducts();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('✅ Loaded courses:', this.courses);
      },
      error: (err) => {
        console.error('❌ Failed to fetch courses:', err);
      },
    });
  }

  loadProducts(): void {
    this.productService.getProducts({ limit: 10, inStock: 'true' }).subscribe({
      next: (res) => {
        this.products = res.products || [];
        console.log('✅ Loaded products:', this.products);
      },
      error: (err) => {
        console.error('❌ Failed to fetch products:', err);
      },
    });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  scrollLeft(id: string): void {
    const container = document.getElementById(id);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(id: string): void {
    const container = document.getElementById(id);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  // 🪟 فتح المودال عند الضغط على المنتج
  openProductModal(p: Product): void {
    console.log('🪟 openProductModal', p);
    this.selectedProduct = p;
    this.selectedQty = 1;
  }

  // إغلاق المودال
  closeProductModal(): void {
    if (this.modalLoading) return;
    this.selectedProduct = null;
  }

  // تغيير الكمية عن طريق الأزرار + و -
  changeQty(delta: number): void {
    let next = this.selectedQty + delta;
    if (next < 1) next = 1;
    this.selectedQty = next;
  }

  // إدخال الكمية من الـ input
  onQtyInputChange(value: string): void {
    let n = Number(value) || 1;
    if (n < 1) n = 1;
    this.selectedQty = n;
  }

  // ✅ Total محسوب تلقائياً
  get selectedTotal(): number {
    if (!this.selectedProduct) return 0;
    const price = Number(this.selectedProduct.price) || 0;
    return price * this.selectedQty;
  }

  // 🛒 إضافة المنتج المختار للسلة
  addSelectedToCart(): void {
    if (!this.selectedProduct || this.selectedQty < 1) return;

    this.modalLoading = true;

    this.cartService
      .addToCart(this.selectedProduct._id, this.selectedQty)
      .subscribe({
        next: (res) => {
          console.log('🛒 Added to cart:', res);
          this.modalLoading = false;
          this.selectedProduct = null;
        },
        error: (err) => {
          console.error('❌ Failed to add to cart:', err);
          this.modalLoading = false;
        },
      });
  }
}
