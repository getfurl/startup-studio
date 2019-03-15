import { FeedbackAction } from './../../../shared/models/feedback-action.model';
import { DialogTranscriptionsComponent } from './../../../shared/dialogs/dialog-transcriptions/dialog-transcriptions.component';
import { MatDialog } from '@angular/material';
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

  transcriptions: string[];

  constructor(private _dialog: MatDialog) {}

  ngOnInit() {
    this.actionText = this.actionInsight[0];
    const actions = this.actionInsight[1];
    const transcriptions = [];
    let sumOfSuccessfulDuration = 0;

    actions.forEach((action: FeedbackAction) => {
      if (action.success) {
        this.actionSuccessCount ++;
        sumOfSuccessfulDuration += action.duration;
      } else {
        this.actionFailCount ++;
      }

      if (action.transcription) {
        transcriptions.push(action.transcription);
      }
    })

    this.transcriptions = transcriptions;
    this.actionAverageDurationOfSuccess = sumOfSuccessfulDuration / this.actionSuccessCount;
  }

  showTranscriptions() {
    this._dialog.open(DialogTranscriptionsComponent, {
      data: {
        transcriptions: this.transcriptions
      }
    });
  }

}
