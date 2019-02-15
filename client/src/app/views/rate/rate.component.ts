import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DbService } from 'src/app/shared/db.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  feedbackRequestId: string;
  feedbackRequest: any;

  currentPromptIndex: number;
  promptsDone: boolean;

  @ViewChild("written")
  writtenTextarea: ElementRef;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dbService: DbService
  ) {
    this._activatedRoute.params.subscribe((params: Params) => {
      this.feedbackRequestId = params.id;
      this.loadFeedbackRequest(this.feedbackRequestId);
    });
  }

  ngOnInit() {
  }

  loadFeedbackRequest(feedbackRequestId) {
    this._dbService.getFeedbackRequest(feedbackRequestId)
      .subscribe(feedbackRequest => {
        this.feedbackRequest = feedbackRequest.data();
        this.feedbackRequest.prompts = this.feedbackRequest.prompts.map(promptAsString => ({
          text: promptAsString,
          state: 'init'
        }));
      })
  }

  handlePromptStart(event, index) {
    if (!isNaN(this.currentPromptIndex)) {
      return;
    }

    this.currentPromptIndex = index;
    this.feedbackRequest.prompts[index].state = event;
  }

  handlePromptEnd(event, index) {
    delete this.currentPromptIndex;
    this.feedbackRequest.prompts[index].state = event;

    this.promptsDone = this.allPromptsDone(this.feedbackRequest.prompts)
  }

  allPromptsDone(prompts) {
    let promptsDone = true;
    prompts.forEach(prompt => promptsDone = promptsDone && prompt.state !== 'init');
    return promptsDone;
  }

  sendFeedback() {
    const feedback = {
      prompts: this.feedbackRequest.prompts.map(prompt => ({ text: prompt.text, success: prompt.state === 'complete' })),
      written: this.writtenTextarea.nativeElement.value,
      timestamp: Date.now()
    };

    this._dbService.addFeedback(this.feedbackRequestId, feedback)
    .subscribe(res => {
      console.log(res);
    })
  }
}
