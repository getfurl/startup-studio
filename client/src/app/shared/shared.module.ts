import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { AuthControlComponent } from "./auth/auth-control/auth-control.component";
import { DialogSignActionComponent } from './dialogs/dialog-sign-action/dialog-sign-action.component';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { DbService } from './db.service';

const SHARED_DIALOGS = [DialogSignActionComponent];
const SHARED_COMPONENTS = [AuthControlComponent, ...SHARED_DIALOGS];
const SHARED_SERVICES = [AuthService, DbService]

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  providers: [...SHARED_SERVICES],
  declarations: [...SHARED_COMPONENTS],
  entryComponents: [...SHARED_DIALOGS],
  exports: [...SHARED_COMPONENTS, CommonModule, FormsModule, ReactiveFormsModule, MaterialModule]
})
export class SharedModule {}
