import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import { FeedbackAction, FurlRecognizer } from "../../../shared/models";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import * as Plotly from 'plotly.js-dist';


@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"]
})
export class ActionComponent implements OnInit {
  noTranscription: boolean;

  FeedbackActionState = FeedbackAction.FeedbackActionState;

  @Input()
  action: FeedbackAction;

  @Input()
  ongoingAction: FeedbackAction;

  @Input()
  emotion: EventEmitter<any>;

  @Input()
  getTranscriptionStream: () => Observable<any>;

  @Output("start")
  startEventEmitter = new EventEmitter<FeedbackAction>();

  @Output("end")
  endEventEmitter = new EventEmitter<FeedbackAction>();

  emotionSub: Subscription;
  transcriptionSub: Subscription;

  startTime: number;

  @Input()
  actionFocus: boolean;

  emotions = [];
  emotionsTime = [];

  sentences: string[] = [];
  speechBuilder = new BehaviorSubject<string>("");

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
  }

  emojis = {
    angry: "😖",
    happy: "😄",
    sad: "😐",
    surprised: "😳"
  };

  drawChart() {
    const trace = {
      x: this.emotionsTime,
      y: this.emotions,
      mode: 'lines',
      name: 'spline',
      text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'],
      line: {shape: 'spline'},
      type: 'scatter'
    };
    
    const data = [trace];

    const el = document.getElementById("myDiv");
    
    const layout = {
      autosize: false,
      width: el.clientWidth,
      height: el.clientHeight,
      yaxis: {range: [-2, 2]},
      xaxis: {range: [0, this.emotionsTime[this.emotionsTime.length - 1]]},
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
      },
      legend: {
        y: 0.5,
        traceorder: 'reversed',
        font: {size: 16},
        yref: 'paper'
      }};
    
    Plotly.newPlot('myDiv', data, layout);
  }

  startEmotionCapture() {
    this.emotionSub = this.emotion.subscribe((value) => {
      const sampleTime = (Date.now() - this.startTime) / 1000;
      this.emotionsTime.push(sampleTime);
      this.emotions.push(value);
      this.drawChart();
    })
  }

  startTranscribing() {
    const transcript = this.getTranscriptionStream();
    this.transcriptionSub = transcript.subscribe(
      ({ transcript, isFinal, words }) => {
        const trimmedSentence = transcript.trim();
        let addedSentence =
          trimmedSentence.charAt(0).toUpperCase() + trimmedSentence.slice(1);

        if (isFinal) {
          console.table(words);
          this.sentences.push(addedSentence);
          addedSentence = "";
        }

        if (addedSentence) {
          addedSentence += "...";
        }

        let previousText = this.sentences.join(". ");

        if (previousText) {
          previousText += ".";
        }

        this.speechBuilder.next(previousText + " " + addedSentence);

        this.ref.detectChanges();
      }
    );
  }

  start() {
    if (!this.ongoingAction) {
      this.startTime = Date.now();
      this.action.start();
      this.startEventEmitter.emit(this.action);
      this.startTranscribing();
      this.startEmotionCapture();
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
    this.endEventEmitter.emit(this.action);

    setTimeout(() => {
      if (this.transcriptionSub) {
        this.transcriptionSub.unsubscribe();
      }
    }, 2000);

    setTimeout(() => {
      if (this.emotionSub) {
        this.emotionSub.unsubscribe();
      }
    }, 2000);
  }
}
