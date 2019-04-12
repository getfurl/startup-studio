import { SnackbarService } from "./../../shared/snackbar.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DbService } from "../../shared/db.service";
import { AuthService } from "../../shared/auth/auth.service";
import { Feedback, FeedbackRequest, FeedbackAction } from "../../shared/models";
import { EmotionService } from 'src/app/shared/emotion.service';

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
  nextActionIndex = 0;

  allActionsDone: boolean;

  FeedbackStatus = FeedbackStatus;

  feedbackStatus = new BehaviorSubject<FeedbackStatus>(FeedbackStatus.INIT);

  emotion = new EventEmitter<any>();
  transcript = new EventEmitter<{ isFinal: boolean, transcript: string}>();
  emotionSub: Subscription;
  transcriptionSub: Subscription;

  @ViewChild("written")
  writtenTextarea: ElementRef;

  private _stream: MediaStream | any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dbService: DbService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _emotionService: EmotionService
  ) {
    this._activatedRoute.params.subscribe((params: Params) => {
      this.feedbackRequestId = params.id;
      this.loadFeedbackRequest(this.feedbackRequestId);
    });
  }

  ngOnInit() {
    this._emotionService.getDataStream().subscribe(streamInterface => {
      this.emotionSub = streamInterface.$emotion.subscribe(e => this.emotion.emit(e));
      this._stream = streamInterface.stream;
    })
  }

  ngOnDestroy() {
    this.emotionSub.unsubscribe();
    this.transcriptionSub.unsubscribe();
    this._emotionService.stopStream(this._stream);
  }

  getTranscriptionStream = () => {
    return this._emotionService.getTranscriptFromStream(this._stream);
  }

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
      return console.error(
        "Something went terribly wrong with actions state management"
      );
    }
    delete this.ongoingActionIndex;
    delete this.ongoingAction;

    this.nextActionIndex = this.getNextAvailableTask();

    this.allActionsDone = this.checkAllActionsDone(this.feedbackActions);
  }

  getNextAvailableTask(): number {
    for (
      let actionIndex = 0;
      actionIndex < this.feedbackActions.length;
      actionIndex++
    ) {
      if (this.feedbackActions[actionIndex].isOpen) {
        return actionIndex;
      }
    }
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
