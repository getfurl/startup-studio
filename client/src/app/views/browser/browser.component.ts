import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DbService } from 'src/app/shared/db.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { FurlUser, FeedbackRequest } from '../../shared/models';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {
  $currentUser = new Observable<FurlUser>();
  $feedbackRequests: Observable<FeedbackRequest[]>;
  userNameFromRoute: string;

  constructor(
    private _dbService: DbService
  ) {
    this.$feedbackRequests = this._dbService.getAvailableFeedbackRequests()
  }

  ngOnInit() {
  }

}

