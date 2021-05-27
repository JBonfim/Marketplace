import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Product } from '../_models/Product';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: Product[] ;
  baseUrl = '';
  isProducts = true;

  constructor(private productService: ProductService,private router: Router,) {
    this.baseUrl = environment.baseURL;
   }

  ngOnInit() {
    this.getProducts();
  }
  getProducts() {
    this.isProducts = true;
    this.productService.getAllProducts().subscribe(
      (_Products: Product[]) => {
      this.products = _Products;
      if(this.products.length == 0){
        console.log("falso")
        this.isProducts = false;
      }
      //console.log(this.products);
    }, error => {
      console.log(error);
    });
  }

}
