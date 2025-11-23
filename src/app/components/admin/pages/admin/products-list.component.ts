import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../../../services/product.service';
import { environment } from '../../../../../environments/environments';
import { RouterModule } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [CommonModule,  RouterModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  backendBase = environment.apiBase.replace('/api', '');

  products: Product[] = [];
  loading = false;
  error: string | null = null;

  page = 1;
  pages = 1;
  total = 0;
  limit = 12;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(page: number = 1) {
    this.loading = true;
    this.error = null;

    this.productService.getProducts({ page, limit: this.limit }).subscribe({
      next: (res) => {
        this.products = res.products;
        this.page = res.page;
        this.pages = res.pages;
        this.total = res.total;
        this.limit = res.limit;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load products.';
        this.loading = false;
      },
    });
  }

  onNextPage() {
    if (this.page < this.pages) {
      this.loadProducts(this.page + 1);
    }
  }

  onPrevPage() {
    if (this.page > 1) {
      this.loadProducts(this.page - 1);
    }
  }

  goToCreate() {
    this.router.navigate(['/admin/products/create']);
  }

  // 🔥 الدالة الجديدة لحذف المنتج
  deleteProduct(id: string) {
    const confirmed = confirm('متأكد تبي تحذف هذا المنتج؟');
    if (!confirmed) return;

    this.loading = true;
    this.error = null;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        // امسح المنتج من الواجهة
        this.products = this.products.filter((p) => p._id !== id);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to delete product.';
      },
    });

  }
  increaseQuantity(p: Product, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const newQty = (p.quantity || 0) + 1;

    // نرسل التحديث للبكند
    this.productService.updateProduct(p._id, { quantity: newQty }).subscribe({
      next: () => {
        // نحدّثه محلياً بدون ما نرجع نطلب القائمة
        p.quantity = newQty;
        p.isOutOfStock = newQty === 0;
        p.limitedStock = newQty > 0 && newQty <= 10;
      },
      error: (err) => {
        console.error('Failed to update quantity', err);
        this.error =
          err?.error?.message || 'Failed to update product quantity.';
      },
    });
  }
  decreaseQuantity(p: Product, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const newQty = Math.max((p.quantity || 0) - 1, 0);

    // نرسل التحديث للبكند
    this.productService.updateProduct(p._id, { quantity: newQty }).subscribe({
      next: () => {
        // نحدّثه محلياً بدون ما نرجع نطلب القائمة
        p.quantity = newQty;
        p.isOutOfStock = newQty === 0;
        p.limitedStock = newQty > 0 && newQty <= 10;
      },
      error: (err) => {
        console.error('Failed to update quantity', err);
        this.error =
          err?.error?.message || 'Failed to update product quantity.';
      },
    });
  } 
}