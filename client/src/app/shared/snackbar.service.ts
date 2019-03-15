import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { AuthDialogService } from "./auth/auth-dialog.service";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  constructor(
    private _snackbar: MatSnackBar,
    private _authDialogService: AuthDialogService
  ) {}

  noUserError() {
    const noUserSnackbar = this._snackbar.open(
      "An account is required for this action",
      "Sign In",
      {
        duration: 5000
      }
    );

    noUserSnackbar.onAction().subscribe(() => {
      this._authDialogService.open();
    });
  }

  subscriptionError(err: any) {
    this._snackbar.open(err.message || "Something's not right");
  }

  success(msg: string) {
    this._snackbar.open(msg, null, {
      duration: 3000
    });
  }
}
