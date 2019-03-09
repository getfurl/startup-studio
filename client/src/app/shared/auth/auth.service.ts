import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { throwError, Observable, from, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  currentUser = new BehaviorSubject<firebase.User>(null);

  constructor(private _afAuth: AngularFireAuth, private _db: AngularFirestore) {
    this._afAuth.authState.subscribe(user => this.currentUser.next(user));
  }

  get state(): Observable<firebase.User> {
    return this._afAuth.authState;
  }

  login(email: string, password: string): Observable<auth.UserCredential> {
    if (this._invalidCredentials(email, password)) {
      return throwError("Credentials cannot be empty");
    }

    return from(
      this._afAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      /** AuthService updates the firestore user records every sign in */
      tap(userCredentials => {
        const userRecordDoc = this._db.doc(`user-records/${userCredentials.user.uid}`);
        const userRecordUpdateData = {
          userName: userCredentials.user.email,
          timestamp: new Date(),
          uid: userCredentials.user.uid
        };

        userRecordDoc.update(userRecordUpdateData).catch(() => {
          userRecordDoc.set(userRecordUpdateData)
        })
      })
    );
  }

  register(email: string, password: string): Observable<auth.UserCredential> {
    if (this._invalidCredentials(email, password)) {
      return throwError("Credentials cannot be empty");
    }

    return from(
      this._afAuth.auth.createUserWithEmailAndPassword(email, password)
    );
  }

  logout(): Observable<void> {
    return from(this._afAuth.auth.signOut());
  }

  private _invalidCredentials(email: string, password: string) {
    return !email || !password;
  }
}
