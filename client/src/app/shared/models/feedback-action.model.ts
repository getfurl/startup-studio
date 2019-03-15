import { BehaviorSubject } from "rxjs";

enum FeedbackActionState {
  INIT,
  START,
  COMPLETE,
  FAIL
}

export class FeedbackAction {
  text: string;
  success: boolean;
  duration: number;
  transcription: string;

  static FeedbackActionState = FeedbackActionState;

  _state = new BehaviorSubject<FeedbackActionState>(FeedbackActionState.INIT);
  _startTime: number;
  _endTime: number;

  constructor(
    text: string,
    success?: boolean,
    duration?: number,
    state?: FeedbackActionState,
    transcription: string = ""
  ) {
    this.text = text;
    this.transcription = transcription;

    if (success) {
      this.success = success;
    }

    if (duration) {
      this.duration = duration;
    }

    if (state) {
      this._state.next(state);
    }
  }

  get isDone() {
    return (
      this._state.value === FeedbackActionState.COMPLETE ||
      this._state.value === FeedbackActionState.FAIL
    );
  }

  start() {
    this._state.next(FeedbackAction.FeedbackActionState.START);
    this._startTime = Date.now();
  }

  complete() {
    this._state.next(FeedbackAction.FeedbackActionState.COMPLETE);
    this._endTime = Date.now();

    this.success = true;
    this.duration = this._endTime - this._startTime;
  }

  fail() {
    this._state.next(FeedbackAction.FeedbackActionState.FAIL);

    this.success = false;
    this.duration = this._endTime - this._startTime;
  }

  toJSON() {
    const { text, success, duration, transcription } = this;
    return {
      text,
      success,
      duration,
      transcription
    };
  }
}
