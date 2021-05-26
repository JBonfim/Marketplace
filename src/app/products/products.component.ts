import { Component, TemplateRef, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Product } from '../_models/Product';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {



  productsFiltrados: Product[];
  products: Product[] ;
  product: Product;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImg = true;
  registerForm: FormGroup;

  _FILTROLISTA: string;
  operacao = 'post';

  bodyDeletarProduct: string;
  file: File;
  error = '';
  loading = false;
  baseUrl = '';



  constructor(
    private productService: ProductService
    , private modalService: BsModalService
    ,private fb: FormBuilder
    ,private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
      this.baseUrl = environment.baseURL;
     }

     ngOnInit() {
      //Inicializa os parametros
      this.validation();
      this.getProducts();
    }


  get filtroLista(): string {
    return this._FILTROLISTA;
  }
  set filtroLista(value: string){
    this._FILTROLISTA = value;
    this.productsFiltrados = this.filtroLista ? this.filtrarProducts(this.filtroLista) : this.products;
  }


  editarProduct(product: Product,template: any){
    this.error = '';
    this.operacao = 'put';
    this.OpenModal(template);
    this.product = product;
    this.registerForm.patchValue(product);
  }

  newProduct(template: any){
    this.operacao = 'post';
    this.OpenModal(template);
  }



  excluirProduct(product: Product, template: any) {
    this.OpenModal(template);
    this.product = product;
    this.bodyDeletarProduct = `Tem certeza que deseja excluir o Produto: ${product.name}`;
  }

  confirmeDelete(template: any) {
    this.productService.deleteProduct(this.product.id).subscribe(
      () => {
          template.hide();
          this.getProducts();
        }, error => {
          console.log(error);
        }
    );
  }



  OpenModal(template: any){
    this.registerForm.reset();
     template.show();
  }





  validation(){
    this.registerForm = this.fb.group({
      name: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(40)]],
      price: ['',Validators.required],
      image: ['',Validators.required],
      });
  }
  onFileChange(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      this.file = event.target.files;
    }



  }

  uploadImage(){
    this.productService.postUploadImage(this.file).subscribe();
    const nameFile = this.product.image.split('\\',3);
    this.product.image = nameFile[2];

  }

  salvarAlteracao(template: any){
    this.error = '';
    if(this.registerForm.valid){

      this.loading = true;
      if(this.operacao === 'post'){
        this.product = Object.assign({},this.registerForm.value);
        console.log(this.product);

        this.uploadImage();
        //this.product.qtdPessoas = parseInt(this.product.qtdPessoas);
        this.productService.postProduct(this.product).subscribe(
          (productNovo: Product) => {
            console.log(productNovo);
            template.hide();
            this.getProducts();
            this.loading = false;
          }, error =>{
            this.error = error;
            console.log(error);
            this.loading = false;
          }
        );
      }else{
        this.product = Object.assign({id: this.product.id},this.registerForm.value);
        this.uploadImage();
        //this.product.qtdPessoas = parseInt(this.product.qtdPessoas);
        this.productService.putProduct(this.product).subscribe(
          () => {
            template.hide();
            this.getProducts();
            this.loading = false;
          }, error =>{
            console.log(error);
            this.error = error;
            this.loading = false;
          }
        );
      }

    }
  }

  filtrarProducts(filtrarPor: string): Product[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    console.log(filtrarPor);
    return this.products.filter(
      product => product.name.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  mostrarImagem(){
    this.mostrarImg = !this.mostrarImg;
  }

  getProducts() {
    this.productService.getAllProducts().subscribe(
      (_Products: Product[]) => {
      this.products = _Products;
      this.productsFiltrados = this.products;
      console.log(this.products);
    }, error => {
      console.log(error);
    });
  }


}
