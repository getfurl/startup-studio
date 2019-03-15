import { SnackbarService } from './../../shared/snackbar.service';
import { BehaviorSubject } from "rxjs";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DbService } from "../../shared/db.service";
import { AuthService } from '../../shared/auth/auth.service';
import { Feedback, FeedbackRequest, FeedbackAction } from '../../shared/models';

enum FeedbackStatus {
  INIT,
  SENDING,
  DELIVERED,
  ERROR
}

@Component({
  selector: "app-rate",
  templateUrl: "./rate.component.html",
  styleUrls: ["./rate.component.scss"]
})
export class RateComponent implements OnInit {
  feedbackRequestId: string;
  feedbackRequest: FeedbackRequest;
  feedbackActions: FeedbackAction[];

  ongoingAction: FeedbackAction = null;
  ongoingActionIndex: number = null;

  allActionsDone: boolean;

  FeedbackStatus = FeedbackStatus;

  feedbackStatus = new BehaviorSubject<FeedbackStatus>(
    FeedbackStatus.INIT
  );

  @ViewChild("written")
  writtenTextarea: ElementRef;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dbService: DbService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService
    ) {
    this._activatedRoute.params.subscribe((params: Params) => {
      this.feedbackRequestId = params.id;
      this.loadFeedbackRequest(this.feedbackRequestId);
    });
  }

  ngOnInit() {}

  loadFeedbackRequest(feedbackRequestId) {
    this._dbService
      .getFeedbackRequest(feedbackRequestId)
      .subscribe(feedbackRequest => {
        this.feedbackRequest = feedbackRequest;
        this.feedbackActions = this.feedbackRequest.prompts.map(
          prompt => new FeedbackAction(prompt.text)
        );
      });
  }

  handleActionStart(action: FeedbackAction, index: number) {
    this.ongoingActionIndex = index;
    this.ongoingAction = action;
  }

  handleActionEnd(event, index) {
    if (this.ongoingAction !== event || this.ongoingActionIndex !== index) {
      return console.error("Something went terribly wrong with actions state management");
    }
    
    delete this.ongoingActionIndex;
    delete this.ongoingAction;

    this.allActionsDone = this.checkAllActionsDone(this.feedbackActions);
  }

  checkAllActionsDone(actions: FeedbackAction[]) {
    let allActionsDone = true;
    actions.forEach(
      action => (allActionsDone = allActionsDone && action.isDone)
    );
    return allActionsDone;
  }

  sendFeedback() {
    const user = this._authService.currentUser.value;
    const feedback = new Feedback(
      user ? user.uid : null,
      this.feedbackRequestId,
      this.feedbackRequest.url,
      this.feedbackActions,
      this.writtenTextarea.nativeElement.value,
      new Date()
    );

    this.feedbackStatus.next(this.FeedbackStatus.SENDING);

    this._dbService.addFeedback(feedback).subscribe(
      () => {
        this.feedbackStatus.next(this.FeedbackStatus.DELIVERED);
        this._snackbarService.success("Feedback sent!");
      },
      () => {
        this.feedbackStatus.next(this.FeedbackStatus.ERROR);
      }
    );
  }

  openUrl() {
    window.open("http://" + this.feedbackRequest.url);
  }
}
