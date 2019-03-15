import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-dialog-transcriptions",
  templateUrl: "./dialog-transcriptions.component.html",
  styleUrls: ["./dialog-transcriptions.component.scss"]
})
export class DialogTranscriptionsComponent implements OnInit {
  transcriptions: string[];

  constructor(
    public dialogRef: MatDialogRef<DialogTranscriptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transcriptions: string[]}
  ) {}

  ngOnInit() {
    this.transcriptions = this.data.transcriptions;
  }

  close() {
    this.dialogRef.close();
  }
}
