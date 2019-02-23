import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatCardModule,
  MatProgressBarModule,
  MatBadgeModule,
  MatDividerModule,
  MatSnackBarModule
} from "@angular/material";

const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatCardModule,
  MatProgressBarModule,
  MatBadgeModule,
  MatDividerModule,
  MatSnackBarModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class MaterialModule {}
