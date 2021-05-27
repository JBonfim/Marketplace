import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  titulo = 'Login';
  model: any = {};
  loading = false;
  submitted = false;
  error = '';
  loginForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    public  router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
   });

   if (this.authService.loggedIn()) {
        this.router.navigate(['/dashboard']);
    }
  }
  get f() { return this.loginForm.controls; }


  login(){
    this.error = '';
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let userLogin = {
      username: this.f.username.value,
      password: this.f.password.value
  }

    this.loading = true;
    this.authService.login(userLogin)
      .subscribe(
        (ret) =>{
          const retorno = ret;
          console.log(retorno);
          if(retorno){
            this.loading = false;
            this.router.navigate(['/dashboard']);
            //this.toastr.success('Login Efetuado!');
          }else{
            this.error = 'Erro ao realizar o login';
            this.loading = false;
          }

        },
        // se der erro
        error => {
          const erro = error.error;
          this.error = error;
          this.loading = false;
        }
      )

  }

}
