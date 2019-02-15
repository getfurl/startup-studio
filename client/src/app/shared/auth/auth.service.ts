import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { throwError, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _afAuth: AngularFireAuth) {
  }

  get state(): Observable<firebase.User> {
    return this._afAuth.authState;
  }

  login(email: string, password: string): Observable<auth.UserCredential> {
    if (this._invalidCredentials(email, password)) {
      return throwError("Credentials cannot be empty");
    }

    return from(this._afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  register(email: string, password: string): Observable<auth.UserCredential> {
    if (this._invalidCredentials(email, password)) {
      return throwError("Credentials cannot be empty");
    }

    return from(this._afAuth.auth.createUserWithEmailAndPassword(email, password));
  }

  logout(): Observable<void> {
    return from(this._afAuth.auth.signOut());
  }

  private _invalidCredentials(email: string, password: string) {
    return !email || !password;
  }
}