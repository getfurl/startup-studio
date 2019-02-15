import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DbService } from 'src/app/shared/db.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  feedbackRequestId: string;
  feedbackRequest: any;

  promptInsights = [];
  writtenFeedback = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dbService: DbService
  ) {
    this._activatedRoute.params.subscribe((params: Params) => {
      this.feedbackRequestId = params.id;
      this.loadFeedback(this.feedbackRequestId);
      this.loadFeedbackRequest(this.feedbackRequestId);
    });
  }

  ngOnInit() {
  }

  loadFeedback(feedbackRequestId) {

    this._dbService.getAllFeedback(feedbackRequestId).subscribe(res => {
      const prompts = {};
      const written = [];

      res.forEach((item: any) => {
        item.feedback.prompts.forEach(prompt => {
          prompts[prompt.text] = prompts[prompt.text] ? prompts[prompt.text].concat(prompt.success) : [prompt.success];
        })

        written.push(item.feedback.written);
      });

      this.promptInsights = Object.entries(prompts)
      this.writtenFeedback = written;
    })
  }

  loadFeedbackRequest(feedbackRequestId) {
    this._dbService.getFeedbackRequest(feedbackRequestId)
      .subscribe(feedbackRequest => {
        this.feedbackRequest = feedbackRequest.data();
      })
  }

}
