import { MatDialog } from '@angular/material';
import { AuthService } from "./../auth.service";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DialogSignActionComponent } from '../../dialogs/dialog-sign-action/dialog-sign-action.component';

@Component({
  selector: "app-auth-control",
  templateUrl: "./auth-control.component.html",
  styleUrls: ["./auth-control.component.scss"]
})
export class AuthControlComponent implements OnInit {
  authState: Observable<firebase.User>;
  email: string;
  changingState = true;

  constructor(private _authService: AuthService, private _dialog: MatDialog) {
    this.authState = this._authService.state;
    this.authState.subscribe(user => {
      this.email = user ? user.email : null;
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