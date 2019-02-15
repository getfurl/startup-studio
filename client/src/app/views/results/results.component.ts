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
  noResults: boolean;
  rateUrl: string;
  urlCopied: boolean;

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
    this.rateUrl = location.host + "/rate/" + this.feedbackRequestId;
  }

  loadFeedback(feedbackRequestId) {

    this._dbService.getAllFeedback(feedbackRequestId).subscribe(res => {
      const prompts = {};
      const written = [];

      res.forEach((item: any) => {
        item.feedback.prompts.forEach(prompt => {
          prompts[prompt.text] = prompts[prompt.text] ? prompts[prompt.text].concat(prompt.success) : [prompt.success];
        })

        written.push({
          text: item.feedback.written,
          timestamp: item.feedback.timestamp || Date.now() - 1000 * 60 * 60
        });
      });

      this.promptInsights = Object.entries(prompts)
      this.writtenFeedback = written.sort((a: any, b: any) => b.timestamp - a.timestamp);

      this.noResults = (this.writtenFeedback.length + this.promptInsights.length) === 0;
    })
  }

  loadFeedbackRequest(feedbackRequestId) {
    this._dbService.getFeedbackRequest(feedbackRequestId)
      .subscribe(feedbackRequest => {
        this.feedbackRequest = feedbackRequest.data();
      })
  }

  copy() {
    this.urlCopied = true;
    setTimeout(() => {
      this.urlCopied = false;
    }, 1000);
  }
}
