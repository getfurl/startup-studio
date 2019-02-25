import { FeedbackAction } from "../../../shared/models";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  FeedbackActionState = FeedbackAction.FeedbackActionState;

  @Input()
  action: FeedbackAction;

  @Input()
  ongoingAction: FeedbackAction;

  @Output("start")
  startEventEmitter = new EventEmitter<FeedbackAction>();

  @Output("end")
  endEventEmitter = new EventEmitter<FeedbackAction>();

  constructor() {}

  ngOnInit() {
  }

  start() {
    if (!this.ongoingAction) {
      this.action.start();
      this.startEventEmitter.emit(this.action);
    }
  }

  complete() {
    this.action.complete();
    this.endEventEmitter.emit(this.action);
  }

  fail() {
    this.action.fail();
    this.endEventEmitter.emit(this.action);
  }
}
