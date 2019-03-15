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
  MatSnackBarModule,
  MatRippleModule
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
  MatSnackBarModule,
  MatRippleModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class MaterialModule {}
