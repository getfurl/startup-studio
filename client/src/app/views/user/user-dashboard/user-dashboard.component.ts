import { DbService } from './../../../shared/db.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FurlUser, Feedback, FeedbackRequest } from '../../../shared/models';
import { ActivatedRoute, Params } from '@angular/router';
import { map, tap, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  $currentUser: Observable<FurlUser>;
  $feedbackHistory: Observable<Feedback[]>;
  $feedbackRequests: Observable<FeedbackRequest[]>;
  userNameFromRoute: string;
  
  constructor(private _dbService: DbService, private _activatedRoute: ActivatedRoute,) {
    this.$currentUser = this._activatedRoute.params.pipe(
      map((params: Params) => params.userName),
      tap(userName => this.userNameFromRoute = userName),
      switchMap(userName => this._dbService.getUserRecordByUsername(userName)),
    );

    this.$feedbackHistory = this.$currentUser.pipe(
      filter(user => user && !!user.uid),
      switchMap(user => this._dbService.getFeedbackOfUser(user)),
      map(feedbackData => feedbackData.sort((f1: any, f2: any) => (f2.timestamp - f1.timestamp))),
      map(feedbackData => feedbackData.slice(0, 2))
    )

    this.$feedbackRequests = this.$currentUser.pipe(
      filter(user => user && !!user.uid),
      switchMap(user => this._dbService.getFeedbackRequestsOfUser(user)),
      map(feedbackRequestsData => feedbackRequestsData.sort((f1: any, f2: any) => (f2.timestamp - f1.timestamp))),
      map(feedbackData => feedbackData.slice(0, 2))
    )
  }

  ngOnInit() {
  }

}
