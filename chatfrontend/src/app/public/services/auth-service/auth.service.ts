import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, tap } from 'rxjs';
import { LoginResponseI } from 'src/app/model/login-response';
import { UserI } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient , private snackbar: MatSnackBar) { }

  login(user : UserI) : Observable<LoginResponseI> {
    return this.http.post <LoginResponseI>('api/user/login' , user).pipe(
      tap((res : LoginResponseI) => localStorage.setItem('nestjs_chat_app', res.accesToken))
      , tap(() =>this.snackbar.open(`Login Succufuly`, `Close` ,  {
        duration : 5000 , horizontalPosition:'right' , verticalPosition:'top'
      }) )
    ) ;
  }
}
