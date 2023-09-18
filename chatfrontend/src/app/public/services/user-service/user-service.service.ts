import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}
  create(user: UserI): Observable<UserI> {
    return this.http.post('api/user', user).pipe(
      tap((createUser: UserI) =>
        this.snackbar.open(
          `User ${createUser.username} create succufully`,
          `close`,
          {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        )
      ),
      catchError((e) => {
        this.snackbar.open(
          `user could not be created to ${e.error.message}`,
          `close`,
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        return throwError(e);
      })
    );
  }

  findByUsername(username :string) : Observable<UserI[]> {
    return this.http.get<UserI[]> (`api/user/find-by-username?username=${username}`) ;
  }
}
