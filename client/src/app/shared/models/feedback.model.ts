import { FeedbackAction } from './feedback-action.model';
import { FurlTimestamp } from './timestamp.model';

export class Feedback {
  id?: string;
  feedbackRequestId: string;
  feedbackRequestUrl: string;
  author: string;
  actions: FeedbackAction[];
  written: string;
  timestamp: Date;

  constructor(
    author: string,
    feedbackRequestId: string,
    feedbackRequestUrl: string,
    actions: FeedbackAction[] = [],
    written: string,
    timestamp: Date | any = new Date()
  ) {
    this.author = author;
    this.feedbackRequestId = feedbackRequestId;
    this.feedbackRequestUrl = feedbackRequestUrl || "";
    this.actions = actions;
    this.written = written || "";

    this.timestamp = FurlTimestamp.parse(timestamp);
  }

  static fromQueryDocumentSnapshot(
    doc: firebase.firestore.QueryDocumentSnapshot
  ): Feedback {
    return Feedback.constructFromData(doc.data());
  }

  static constructFromData(
    data: any
  ): Feedback {
    const { author, feedbackRequestId, feedbackRequestUrl, actions, written, timestamp } = data;
    return new Feedback(author, feedbackRequestId, feedbackRequestUrl, actions, written, timestamp);
  }

  static mapFromQuerySnapshot(
    snapshot: firebase.firestore.QuerySnapshot
  ): Feedback[] {
    return snapshot.docs.map(Feedback.fromQueryDocumentSnapshot);
  }

  get valid(): boolean {
    return !!this.feedbackRequestId;
  }

  toJSON() {
    return Object.assign({ ...new Object(this) },
      { actions : this.actions.map(action => action.toJSON())}
    );
  }
}