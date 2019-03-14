import { FeedbackPrompt } from './feedback-prompt.model';
import { FurlTimestamp } from './timestamp.model';

export class FeedbackRequest {
  id?: string;
  url: string;
  author: string;
  prompts: FeedbackPrompt[];
  created: Date;

  constructor(
    url: string,
    author: string,
    prompts: FeedbackPrompt[] = [],
    created: Date | any = new Date(),
    id: string = null
  ) {
    this.url = url;
    this.author = author;
    this.prompts = prompts;
    this.created = FurlTimestamp.parse(created);
    this.id = id;
  }

  static constructFromData(
    data: any
  ): FeedbackRequest {
    const { url, author, prompts, created, id } = data;
    return new FeedbackRequest(url, author, prompts, created, id);
  }

  static fromQueryDocumentSnapshot(
    doc: firebase.firestore.QueryDocumentSnapshot
  ): FeedbackRequest {
    const { url, author, prompts, created } = doc.data();
    return new FeedbackRequest(url, author, prompts, created, doc.id);
  }

  static mapFromQuerySnapshot(
    snapshot: firebase.firestore.QuerySnapshot
  ): FeedbackRequest[] {
    return snapshot.docs.map(FeedbackRequest.fromQueryDocumentSnapshot);
  }

  get valid(): boolean {
    return !!this.url && !!this.author;
  }

  get emptyPrompts(): boolean {
    return !Array.isArray(this.prompts) || (this.prompts && !this.prompts.length);
  }

  toJSON() {
    return { ...new Object(this) };
  }
}
