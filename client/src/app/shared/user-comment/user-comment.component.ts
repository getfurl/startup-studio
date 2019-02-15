import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.scss']
})
export class UserCommentComponent implements OnInit {
  @Input()
  writtenComment: { timestamp: number, text: string};

  timestamp: Date;
  text: string;

  constructor() {}

  ngOnInit() {
    this.timestamp = new Date(this.writtenComment.timestamp);
    this.text = this.writtenComment.text;
  }

}
