import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogSignActionComponent } from '../dialogs/dialog-sign-action/dialog-sign-action.component';

@Injectable({
  providedIn: "root"
})
export class AuthDialogService {
  constructor(private _dialog: MatDialog) {}

  open() {
    this._dialog.open(DialogSignActionComponent);
  }
}