import { Component, Input } from '@angular/core';
import { RouteMode } from '../../../app-routing.module';

@Component({
  selector: 'app-mode-caption',
  templateUrl: './mode-caption.component.html',
  styleUrls: ['./mode-caption.component.scss']
})
export class ModeCaptionComponent {
  @Input("mode") mode: RouteMode;
}
