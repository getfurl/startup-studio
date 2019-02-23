import { FeedbackRequest } from "./models/feedback-request.model";
import { AuthService } from "./auth/auth.service";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { throwError, from, Observable } from "rxjs";
import { FirebaseFirestore } from "@angular/fire";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DbService {
  user: firebase.User;

  constructor(
    private _db: AngularFirestore,
    private _authService: AuthService
  ) {
    this._authService.state.subscribe(user => (this.user = user));
  }

  createFeedbackRequest(
    feedbackRequest: FeedbackRequest
  ): Observable<firebase.firestore.DocumentReference> {
    if (!feedbackRequest.valid) {
      return throwError(
        "DbService.createFeedbackCollector - missing arguments"
      );
    }

    return from(
      this._db.collection("feedback-requests").add(feedbackRequest.toJSON())
    );
  }

  getFeedbackRequest(feedbackRequestId: string): Observable<FeedbackRequest> {
    if (!feedbackRequestId) {
      return throwError("DbService.getFeedbackRequest - missing arguments");
    }

    return from(
      this._db.doc(`feedback-requests/${feedbackRequestId}`).get()
    ).pipe(map(FeedbackRequest.fromQueryDocumentSnapshot));
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

  getAllFeedback(feedbackRequestId) {
    if (!feedbackRequestId) {
      return throwError("DbService.getAllFeedback - missing arguments");
    }

    return from(
      this._db
        .collection("feedback", ref =>
          ref.where("feedbackRequestId", "==", feedbackRequestId)
        )
        .valueChanges()
    );
  }

  addFeedback(
    feedbackRequestId,
    feedback
  ): Observable<firebase.firestore.DocumentReference> {
    if (!feedbackRequestId || !feedback) {
      return throwError("DbService.addFeedback - missing arguments");
    }

    return from(
      this._db.collection("feedback").add({
        feedbackRequestId,
        feedback
      })
    );
  }
}
