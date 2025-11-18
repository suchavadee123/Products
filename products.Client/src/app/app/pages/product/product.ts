import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bwipjs from 'bwip-js';
import { ProductService, Product as ProductModel } from '../../../services/product.service';
import { productCodeValidator } from '../../../validators/product-code.validator';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit, AfterViewInit {
  products: ProductModel[] = [];
  productForm: FormGroup;
  showDeleteDialog: boolean = false;
  productToDelete: ProductModel | null = null;
  private bwip: any;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      productCode: ['', [Validators.required, productCodeValidator()]]
    });
    this.bwip = (bwipjs as any).default || bwipjs;
  }

  formatCodeInput(event: any) {
    let value = event.target.value.replace(/-/g, '').toUpperCase();
    value = value.replace(/[^A-Z0-9]/g, '');
    
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += value[i];
    }
    
    this.productForm.patchValue({ productCode: formatted }, { emitEvent: false });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.updateBarcodes();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data.map(p => ({
          ...p,
          productCodeClean: p.productCodeClean?.toUpperCase() || p.productCodeClean
        }));
        this.cdr.detectChanges();
        setTimeout(() => {
          this.updateBarcodes();
        }, 0);
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  updateBarcodes() {
    if (!this.bwip || !this.products.length) return;
    
    this.products.forEach((product) => {
      if (!product.productCodeClean) return;
      
      const canvasId = `barcode-${product.id}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      
      if (canvas) {
        try {
          const formattedCode = this.formatCode(product.productCodeClean);
          const options: any = {
            bcid: 'code39',
            text: formattedCode,
            scale: 2,
            height: 10,
            includetext: false
          };
          
          this.bwip.toCanvas(canvas, options);
        } catch (error) {
          console.error(`Error generating barcode for product ${product.id}:`, error);
        }
      }
    });
  }

  formatCode(code: string): string {
    if (!code) return '';
    const cleanCode = code.toUpperCase().replace(/-/g, '');
    if (cleanCode.length === 16) {
      return `${cleanCode.substring(0, 4)}-${cleanCode.substring(4, 8)}-${cleanCode.substring(8, 12)}-${cleanCode.substring(12, 16)}`;
    }
    return code;
  }

  addProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productCode = this.productForm.get('productCode')?.value.toUpperCase();
    const codeClean = productCode.replace(/-/g, '');

    if (codeClean.length !== 16 || !/^[A-Z0-9]+$/.test(codeClean)) {
      return;
    }

    const createProduct = {
      productCode: productCode,
      productCodeClean: codeClean,
      barcodeType: 'CODE39'
    };

    this.productService.create(createProduct).subscribe({
      next: () => {
        this.productForm.reset();
        this.loadProducts();
      },
      error: (error) => console.error('Error creating product:', error)
    });
  }

  openDeleteDialog(product: ProductModel) {
    this.productToDelete = product;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.productService.delete(this.productToDelete.id).subscribe({
        next: () => {
          this.closeDeleteDialog();
          this.loadProducts();
        },
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }
}
