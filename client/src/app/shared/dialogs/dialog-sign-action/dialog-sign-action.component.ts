import { AuthService } from "../../auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-dialog-sign-action",
  templateUrl: "./dialog-sign-action.component.html",
  styleUrls: ["./dialog-sign-action.component.scss"]
})
export class DialogSignActionComponent implements OnInit {
  signUpEnabled: boolean;

  signActionActive: boolean;
  signActionError: Error;

  signActionForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  });

  constructor(
    public dialogRef: MatDialogRef<DialogSignActionComponent>,
    private _authService: AuthService
  ) {}

  ngOnInit() {}

  toggleSignUp() {
    this.signUpEnabled = !this.signUpEnabled;
  }

  signAction() {
    if (this.signActionForm.invalid) {
      return;
    }

    this.signActionActive = true;
    this.signActionError = null;

    const { email, password } = this.signActionForm.getRawValue();
    if (this.signUpEnabled) {
      this._signUp(email, password);
    } else {
      this._signIn(email, password);
    }
  }

  _signIn(email: string, password: string) {
    return this._authService.login(email, password).subscribe(
      user => {
        this.dialogRef.close(user);
        this.signActionActive = false;
      },
      err => {
        console.error(err);
        this.signActionError = err;
        this.signActionActive = false;
      }
    );
  }

  _signUp(email: string, password: string) {
    return this._authService.register(email, password).subscribe(
      user => {
        this.dialogRef.close(user);
        this.signActionActive = false;
      },
      err => {
        console.error(err);
        this.signActionError = err;
        this.signActionActive = false;
      }
    );
  }
}