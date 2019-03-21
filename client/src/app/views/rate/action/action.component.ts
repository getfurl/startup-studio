import { BehaviorSubject } from "rxjs";
import { HostListener, ChangeDetectorRef, Host, ElementRef } from "@angular/core";
import { SpeechService } from "./../../../shared/speech.service";
import { FeedbackAction, FurlRecognizer } from "../../../shared/models";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { distinctUntilChanged, filter } from "rxjs/operators";

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
})
export class ActionComponent implements OnInit {
  noTranscription: boolean;

  FeedbackActionState = FeedbackAction.FeedbackActionState;

  @Input()
  action: FeedbackAction;

  @Input()
  ongoingAction: FeedbackAction;

  @Output("start")
  startEventEmitter = new EventEmitter<FeedbackAction>();

  @Output("end")
  endEventEmitter = new EventEmitter<FeedbackAction>();

  @Input()
  actionFocus: boolean;

  recognizer: FurlRecognizer;

  speechBuilder = new BehaviorSubject<string>("");

  constructor(private _speech: SpeechService, private ref: ChangeDetectorRef, private _elementRef: ElementRef) {
    this.recognizer = this._speech.recognizer();
  }

  ngOnInit() {
    this.recognizer.capturedText
      .pipe(
        distinctUntilChanged(),
        filter(value => !!value)
      )
      .subscribe(speechValue => {
        const trimmedSentence = speechValue.trim();
        const addedSentence =
          trimmedSentence.charAt(0).toUpperCase() +
          trimmedSentence.slice(1) +
          ".";

        this.speechBuilder.next(this.speechBuilder.value + " " + addedSentence);

        this.ref.detectChanges();
      });

    this.speechBuilder.subscribe(value => {
      this.action.transcription = value;
    });
  }

  start() {
    if (!this.ongoingAction) {
      this.action.start();
      this.recognizer.start();
      this.startEventEmitter.emit(this.action);
    }
  }

  complete() {
    this.action.complete();
    this.finalize();
  }

  fail() {
    this.action.fail();
    this.finalize();
  }

  finalize() {
    this.recognizer.stop();
    this.endEventEmitter.emit(this.action);
  }
}
