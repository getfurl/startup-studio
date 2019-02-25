import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-action-insight',
  templateUrl: './action-insight.component.html',
  styleUrls: ['./action-insight.component.scss']
})
export class ActionInsightComponent implements OnInit {
  @Input()
  actionInsight: any;

  actionText: string;
  actionSuccessCount = 0;
  actionFailCount = 0;

  actionAverageDurationOfSuccess: number;

  constructor() {}

  ngOnInit() {
    this.actionText = this.actionInsight[0];
    const actions = this.actionInsight[1];
    let sumOfSuccessfulDuration = 0;

    actions.forEach(action => {

      if (action.success) {
        this.actionSuccessCount ++;
        sumOfSuccessfulDuration += action.duration;
      } else {
        this.actionFailCount ++;
      }
    })

    this.actionAverageDurationOfSuccess = sumOfSuccessfulDuration / this.actionSuccessCount;
  }

}
