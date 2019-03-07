import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { AuthControlComponent } from "./auth/auth-control/auth-control.component";
import { DialogSignActionComponent } from './dialogs/dialog-sign-action/dialog-sign-action.component';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ClipboardModule } from 'ngx-clipboard'
import { DbService } from './db.service';
import { UserCommentComponent } from './user-comment/user-comment.component';
import { AuthDialogService } from './auth/auth-dialog.service';
import { ViewModeCaptionComponent } from './misc/header/view-mode-caption/view-mode-caption.component';
import { HeaderComponent } from './misc/header/header.component';
import { AppRoutingModule } from '../app-routing.module';

const SHARED_DIALOGS = [DialogSignActionComponent];
const SHARED_COMPONENTS = [HeaderComponent, ViewModeCaptionComponent, UserCommentComponent, AuthControlComponent, ...SHARED_DIALOGS];
const SHARED_SERVICES = [AuthService, AuthDialogService, DbService]
const SHARED_MODULES = [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, ClipboardModule, AppRoutingModule];

@NgModule({
  imports: [...SHARED_MODULES],
  providers: [...SHARED_SERVICES],
  declarations: [...SHARED_COMPONENTS],
  entryComponents: [...SHARED_DIALOGS],
  exports: [...SHARED_COMPONENTS, ...SHARED_MODULES]
})
export class SharedModule {}
