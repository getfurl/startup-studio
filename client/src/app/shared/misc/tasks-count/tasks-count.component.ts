import { Component, OnInit, Input } from '@angular/core';
import { FeedbackRequest } from '../../models';

@Component({
  selector: 'app-tasks-count',
  templateUrl: './tasks-count.component.html',
  styleUrls: ['./tasks-count.component.scss']
})
export class TasksCountComponent implements OnInit {
  @Input("feedbackRequest") feedbackRequest: FeedbackRequest;
  constructor() { }

  ngOnInit() {
  }

}
