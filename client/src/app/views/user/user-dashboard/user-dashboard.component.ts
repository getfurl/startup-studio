import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { DbService } from './../../../shared/db.service';
import { AuthService } from './../../../shared/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FurlUser, Feedback, FeedbackRequest } from '../../../shared/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
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


  form = new FormGroup({
    userName: new FormControl()
  });
  
  constructor(private _router: Router, private _dbService: DbService, private _activatedRoute: ActivatedRoute, private _authService: AuthService) {
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

    this.$currentUser.subscribe(userRecord => {
      this.form.setValue({
        userName: userRecord.userName
      })
    })
  }

  ngOnInit() {
  }

  updateUserRecord(event: Event) {
    event.preventDefault()
    if (!this._authService.currentUser.value) {
      return this.form.setErrors({
        "noUser": true
      })
    }

    const { uid } = this._authService.currentUser.value;
    const { userName } = this.form.value;
    this.updateUserName(uid, userName);
  }

  updateUserName(uid: string, newUserName: string) {
    this._dbService.updateUserName(uid, newUserName)
      .subscribe(() => {
        this.form.markAsPristine()
        this._router.navigate([newUserName])
      }, err => {
        console.error(err);
      });
  }

}