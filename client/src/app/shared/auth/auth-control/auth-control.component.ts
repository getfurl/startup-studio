import { MatDialog } from '@angular/material';
import { AuthService } from "./../auth.service";
import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { DialogSignActionComponent } from '../../dialogs/dialog-sign-action/dialog-sign-action.component';
import { DbService } from '../../db.service';

@Component({
  selector: "app-auth-control",
  templateUrl: "./auth-control.component.html",
  styleUrls: ["./auth-control.component.scss"]
})
export class AuthControlComponent implements OnInit {
  authState: Observable<firebase.User>;
  username: string;
  changingState = true;

  constructor(private _authService: AuthService, private _dialog: MatDialog, private _dbService: DbService) {
    this.authState = this._authService.state;
    this.authState
    .pipe(
      switchMap(user => user ? this._dbService.getUserRecordByUserId(user.uid, user) : of(null))
    )
    .subscribe(user => {
      this.username = user ? (user.userName || user.email) : null;
      this.changingState = false;
    });
  }

  ngOnInit() {}

  login() {
    this.changingState = true;
    this._dialog.open(DialogSignActionComponent);
  }

  logout() {
    this.changingState = true;
    this._authService.logout().subscribe();
  }
}