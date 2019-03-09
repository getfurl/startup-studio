import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FurlUser, FeedbackRequest} from '../../../shared/models';
import { DbService } from '../../../../app/shared/db.service';

@Component({
  selector: 'app-feedback-requests-list',
  templateUrl: './feedback-requests-list.component.html',
  styleUrls: ['./feedback-requests-list.component.scss']
})
export class FeedbackRequestsListComponent implements OnInit {
  $currentUser = new Observable<FurlUser>();
  $feedbackRequests: Observable<FeedbackRequest[]>;
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

    this.$feedbackRequests = this.$currentUser.pipe(
      filter(user => user && !!user.uid),
      switchMap(user => this._dbService.getFeedbackRequestsOfUser(user)),
      map(feedbackRequestsData => feedbackRequestsData.sort((f1: any, f2: any) => (f2.timestamp - f1.timestamp)))
    )
  }

  ngOnInit() {
  }

}
