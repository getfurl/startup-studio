import { Component, OnInit } from '@angular/core';
import { switchMap, filter, map, tap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

import { FurlUser } from './../../../shared/models/user.model';
import { Feedback } from './../../../shared/models/feedback.model';
import { DbService } from './../../../shared/db.service';

@Component({
  selector: 'app-feedback-history',
  templateUrl: './feedback-history.component.html',
  styleUrls: ['./feedback-history.component.scss']
})
export class FeedbackHistoryComponent implements OnInit {
  $currentUser = new Observable<FurlUser>();
  $feedbackHistory: Observable<Feedback[]>;
  userNameFromRoute: string;
  
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dbService: DbService
  ) {
    this.$currentUser = this._activatedRoute.params.pipe(
      map((params: Params) => params.userName),
      tap(userName => this.userNameFromRoute = userName),
      switchMap(userName => this._dbService.getUserRecordByUsername(userName))
    );

    this.$feedbackHistory = this.$currentUser.pipe(
      filter(user => user && !!user.uid),
      switchMap(user => this._dbService.getFeedbackOfUser(user)),
      map(feedbackData => feedbackData.sort((f1: any, f2: any) => (f2.timestamp - f1.timestamp)))
    )
  }

  ngOnInit() {
  }

}
