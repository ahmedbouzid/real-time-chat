import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {



constructor( private authService : AuthService , private router : Router) {}


  loginForm : FormGroup = new FormGroup ({
    email : new FormControl(null , [Validators.required , Validators.email]) ,
    password : new FormControl(null , [Validators.required]),

  })

  get email (): FormControl{
    return this.loginForm.get('email') as FormControl
  }
  get password () : FormControl {
    return this.loginForm.get('password') as FormControl
  }
  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.authService.login({
        email : this.email.value ,
        password : this.password.value
      }).pipe(
        tap(() => this.router.navigate(['../../private/dashboard']))
      ).subscribe()
    }
  }
}
