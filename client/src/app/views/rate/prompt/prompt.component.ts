import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  @Input()
  prompt: { text: string, state: string };

  @Output("start")
  startEventEmitter = new EventEmitter<string>();

  @Output("end")
  endEventEmitter = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
  }

  start() {
    this.startEventEmitter.emit('start');
  }

  complete() {
    this.endEventEmitter.emit('complete');
  }

  fail() {
    this.endEventEmitter.emit('fail');
  }
}
