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

   if (this.authService.userValue) {
        this.router.navigate(['/dashboard']);
    }
  }
  get f() { return this.loginForm.controls; }


  login(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.f.username.value,this.f.password.value)
      .subscribe(
        (ret) =>{
          const retorno = ret;
          console.log(retorno);
          if(retorno.success){
            this.loading = false;
            this.router.navigate(['/dashboard']);
            //this.toastr.success('Login Efetuado!');
          }else{
            this.error = retorno.error;
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
