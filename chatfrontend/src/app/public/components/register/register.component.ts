import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../helpers/custom-validators';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


registerForm : FormGroup  = new FormGroup({
  email : new FormControl(null , [Validators.required , Validators.email]) ,
  username : new FormControl(null , [Validators.required]) ,
  password : new FormControl(null , [Validators.required]),
  passwordConfirm : new FormControl(null , [Validators.required])
},
{
  validators : CustomValidator.passwordMatching
}
)

constructor(private fb : FormBuilder , private userService : UserServiceService ,
private router : Router
  ) {}

  ngOnInit(): void {
  }
   get email (): FormControl{
    return this.registerForm.get('email') as FormControl
   }
   get username (): FormControl {
    return this.registerForm.get('username') as FormControl
   }
   get password () : FormControl {
    return this.registerForm.get('password') as FormControl
   }
   get passwordConfirm () : FormControl {
    return this.registerForm.get('passwordConfirm') as FormControl ;
   }
   registre() {
    if (this.registerForm.valid) {
      this.userService.create({
        email : this.email.value ,
        password : this.password.value ,
        username : this.username.value
      }).pipe (
        tap(() => this.router.navigate(['../login']))
      ).subscribe()
    }
   }
}
