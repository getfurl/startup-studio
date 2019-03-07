import { Component, Input } from '@angular/core';
import { RouteMode } from '../../../../app-routing.module';

@Component({
  selector: 'app-view-mode-caption',
  templateUrl: './view-mode-caption.component.html',
  styleUrls: ['./view-mode-caption.component.scss']
})
export class ViewModeCaptionComponent {
  @Input("viewMode") viewMode: RouteMode;
}
