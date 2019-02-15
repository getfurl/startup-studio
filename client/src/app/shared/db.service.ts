import { AuthService } from './auth/auth.service';
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { throwError, from, Observable } from "rxjs";
import { FirebaseFirestore } from '@angular/fire';

@Injectable({
  providedIn: "root"
})
export class DbService {
  user: firebase.User;

  constructor(private _db: AngularFirestore, private _authService: AuthService) {
    this._authService.state.subscribe(user => this.user = user);
  }

  createFeedbackRequest(url: string): Observable<firebase.firestore.DocumentReference> {
    if (!url) {
      return throwError("DbService.createFeedbackCollector - missing arguments");
    }

    return from(
      this._db.collection('feedback-requests').add({
        url: url,
        userId: this.user.uid
      })
    );
  }

  getFeedbackRequest(feedbackRequestId: string): Observable<firebase.firestore.DocumentSnapshot> {
    if (!feedbackRequestId) {
      return throwError("DbService.getFeedbackRequest - missing arguments");
    }

    return from(
      this._db.doc(`feedback-requests/${feedbackRequestId}`).get()
    );
  }

  updatePrompts(feedbackRequestId: string, prompts: string[]) {
    if (!feedbackRequestId) {
      return throwError("DbService.updatePrompts - missing arguments");
    }

    return from(
      this._db.doc(`feedback-requests/${feedbackRequestId}`).update({
        prompts
      })
    );
  }
}