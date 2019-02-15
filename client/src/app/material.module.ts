import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule
} from "@angular/material";

const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class MaterialModule {}
