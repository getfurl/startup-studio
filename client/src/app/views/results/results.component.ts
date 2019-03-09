import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DbService } from '../../shared/db.service';
import { Feedback } from '../../shared/models';

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

  actionInsights = [];
  writtenFeedback = [];
  allFeedbackCount: number;

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
    this._dbService.getAllFeedback(feedbackRequestId).subscribe(allFeedback => {
      const actions = {};
      const written = [];

      allFeedback.forEach((feedback: Feedback) => {
        feedback.actions.forEach(action => {
          actions[action.text] = actions[action.text] ? actions[action.text].concat(action) : [action];
        })
        written.push({
          text: feedback.written,
          timestamp: feedback.timestamp
        });
      });

      this.actionInsights = Object.entries(actions)
      this.writtenFeedback = written.sort((a: any, b: any) => b.timestamp - a.timestamp);
      this.allFeedbackCount = allFeedback.length;

      this.noResults = (this.writtenFeedback.length + this.actionInsights.length) === 0;
    })
  }

  loadFeedbackRequest(feedbackRequestId) {
    this._dbService.getFeedbackRequest(feedbackRequestId)
      .subscribe(feedbackRequest => {
        this.feedbackRequest = feedbackRequest;
      })
  }

  copy() {
    this.urlCopied = true;
    setTimeout(() => {
      this.urlCopied = false;
    }, 1000);
  }
}
