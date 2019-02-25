import { FeedbackAction } from '.';

export class Feedback {
  id?: string;
  feedbackRequestId: string;
  author: string;
  actions: FeedbackAction[];
  written: string;
  timestamp: Date;

  constructor(
    author: string,
    feedbackRequestId: string,
    actions: FeedbackAction[] = [],
    written: string,
    timestamp: Date | any = new Date()
  ) {
    this.author = author;
    this.feedbackRequestId = feedbackRequestId;
    this.actions = actions;
    this.written = written;

    if (timestamp.toDate) {
      this.timestamp = timestamp.toDate();
    }

    if (timestamp.getTime) {
      this.timestamp = new Date(timestamp.getTime());
    }

    if (!isNaN(timestamp)) {
      this.timestamp = new Date(timestamp);
    }
  }

  static fromQueryDocumentSnapshot(
    doc: firebase.firestore.QueryDocumentSnapshot
  ): Feedback {
    return Feedback.constructFromData(doc.data());
  }

  static constructFromData(
    data: any
  ): Feedback {
    const { author, feedbackRequestId, actions, written, timestamp } = data;
    return new Feedback(author, feedbackRequestId, actions, written, timestamp);
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