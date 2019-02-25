import { FeedbackRequest } from "./../../shared/models/feedback-request.model";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter
} from "@angular/core";
import { Router } from "@angular/router";
import { DbService } from "../../shared/db.service";
import { AuthService } from "../../shared/auth/auth.service";
import { SnackbarService } from "../../shared/snackbar.service";

@Component({
  selector: "app-submit",
  templateUrl: "./submit.component.html",
  styleUrls: ["./submit.component.scss"]
})
export class SubmitComponent {
  @ViewChild("url")
  urlInput: ElementRef;

  submitInProgress = new EventEmitter<boolean>();

  constructor(
    private _router: Router,
    private _dbService: DbService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService
  ) {}

  submitWebsite(event) {
    event.preventDefault();
    this.submitInProgress.emit(true);
    const url = this.urlInput.nativeElement.value;

    const user = this._authService.currentUser.value;

    if (!user) {
      this._snackbarService.noUserError();
      return this.submitInProgress.next(false);
    }

    const feedbackRequest = new FeedbackRequest(url, user.uid);
    this._dbService.createFeedbackRequest(feedbackRequest).subscribe(
      documentRef => {
        this._router.navigate([`/edit`, documentRef.id]);
      },
      err => {
        this._snackbarService.subscriptionError(err);
        this.submitInProgress.emit(false);
      }
    );
  }
}
