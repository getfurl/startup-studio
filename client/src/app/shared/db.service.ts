import { AuthService } from "./auth/auth.service";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { throwError, from, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Feedback, FeedbackRequest, FeedbackPrompt } from "./models";

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
      return this.serviceError("createFeedbackCollector - missing arguments", feedbackRequest.toJSON());
    }

    return from(
      this._db.collection("feedback-requests").add(feedbackRequest.toJSON())
    );
  }

  getFeedbackRequest(feedbackRequestId: string): Observable<FeedbackRequest> {
    if (!feedbackRequestId) {
      return this.serviceError("getFeedbackRequest - missing arguments");
    }

    return from(
      this._db.doc(`feedback-requests/${feedbackRequestId}`).get()
    ).pipe(map(FeedbackRequest.fromQueryDocumentSnapshot));
  }

  updatePrompts(feedbackRequestId: string, prompts: FeedbackPrompt[]) {
    if (!feedbackRequestId) {
      return this.serviceError("updatePrompts - missing arguments");
    }

    return from(
      this._db.doc(`feedback-requests/${feedbackRequestId}`).update({
        prompts: prompts.map(prompt => prompt.toJSON())
      })
    );
  }

  getAllFeedback(feedbackRequestId): Observable<Feedback[]> {
    if (!feedbackRequestId) {
      return this.serviceError("getAllFeedback - missing arguments");
    }

    return from(
      this._db
        .collection("feedback", ref =>
          ref.where("feedbackRequestId", "==", feedbackRequestId)
        )
        .valueChanges()
    ).pipe(map((value) => {
      return value.map((feedbackData) => {
        return Feedback.constructFromData(feedbackData);
      });
    }));
  }

  addFeedback(
    feedback: Feedback
  ): Observable<firebase.firestore.DocumentReference> {
    if (!feedback.valid) {
      return this.serviceError(
        "addFeedback - missing arguments",
        feedback.toJSON()
      );
    }

    return from(this._db.collection("feedback").add(feedback.toJSON()));
  }

  serviceError(message, data = {}) {
    console.error(`DbService: ${message}\n${JSON.stringify(data)}`);
    return throwError(message);
  }
}
