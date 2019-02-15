import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-prompt-insight',
  templateUrl: './prompt-insight.component.html',
  styleUrls: ['./prompt-insight.component.scss']
})
export class PromptInsightComponent implements OnInit {
  @Input()
  promptInsight: any;

  promptText: string;
  promptSuccess = 0;
  promptFail = 0;

  constructor() {}

  ngOnInit() {
    this.promptText = this.promptInsight[0];
    this.promptInsight[1].forEach(success => {
      if (success) {
        this.promptSuccess ++;
      } else {
        this.promptFail ++;
      }
    })
  }

}
