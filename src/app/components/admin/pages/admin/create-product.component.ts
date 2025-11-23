import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-create-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product.component.html', // Ensure this file exists in the same directory as this component
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  private productService = inject(ProductService);
  private router = inject(Router);

  title = '';
  description = '';
  price: number | null = null;
  quantity: number | null = 0;
  files: File[] = [];

  loading = false;
  error: string | null = null;

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.files = Array.from(input.files);
  }

  onSubmit() {
    if (!this.title || this.price == null) {
      this.error = 'Title and price are required.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description || '');
    formData.append('price', String(this.price));
    formData.append('quantity', String(this.quantity ?? 0));

    this.files.forEach((file) => {
      formData.append('images', file); // اسم الحقل لازم يكون 'images' نفس الباكند
    });

    this.loading = true;
    this.error = null;

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'Failed to create product.';
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
