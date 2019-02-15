import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule
} from "@angular/material";

const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class MaterialModule {}
