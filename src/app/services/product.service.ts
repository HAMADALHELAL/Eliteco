// src/app/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  itemNumber: string;
  quantity: number;
  isOutOfStock: boolean;
  limitedStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  page: number;
  pages: number;
  total: number;
  limit: number;
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/admin`;

  /** GET /api/admin/ => listProducts */
  getProducts(options?: {
    page?: number;
    limit?: number;
    inStock?: 'true' | 'false';
    minPrice?: number;
    maxPrice?: number;
    q?: string;
  }): Observable<ProductListResponse> {
    let params = new HttpParams();

    if (options?.page) params = params.set('page', options.page);
    if (options?.limit) params = params.set('limit', options.limit);
    if (options?.inStock) params = params.set('inStock', options.inStock);
    if (options?.minPrice != null)
      params = params.set('minPrice', options.minPrice);
    if (options?.maxPrice != null)
      params = params.set('maxPrice', options.maxPrice);
    if (options?.q) params = params.set('q', options.q);

    return this.http.get<ProductListResponse>(`${this.base}/`, { params });
  }

  /** GET /api/admin/:id */
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  /** POST /api/admin/products (مع صور اختيارية) */
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, formData);
  }

  /** PUT /api/admin/:id */
  updateProduct(id: string, payload: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, payload);
  }

  /** DELETE /api/admin/:id */
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
