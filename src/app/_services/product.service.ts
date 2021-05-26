import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../_models/Product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseURL = `${environment.baseURL}/api/Products`;

constructor(private http: HttpClient) {}


  getProdutoById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseURL}/${id}`);
  }



  postProduct(product: Product) {
    return this.http.post(this.baseURL, product);
  }

  postUploadImage(file: File) {
    const fileToUpload = <File>file[0];
    const formData = new FormData();
    formData.append('file',fileToUpload,fileToUpload.name);

    return this.http.post(`${this.baseURL}/upload`, formData);
  }

  putProduct(Product: Product) {
    return this.http.put(`${this.baseURL}`, Product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseURL);
  }

}
