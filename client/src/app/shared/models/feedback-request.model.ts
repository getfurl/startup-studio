import { FeedbackPrompt } from './';

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
    created: Date = new Date()
  ) {
    this.url = url;
    this.author = author;
    this.prompts = prompts;
    this.created = created;
  }

  static fromQueryDocumentSnapshot(
    doc: firebase.firestore.QueryDocumentSnapshot
  ): FeedbackRequest {
    const { url, author, prompts, created } = doc.data();
    return new FeedbackRequest(url, author, prompts, created);
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
