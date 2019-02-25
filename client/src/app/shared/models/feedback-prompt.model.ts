export class FeedbackPrompt {
  text: string;

  constructor(text: string) {
    this.text = text;
  }

  static get empty() {
    return new FeedbackPrompt("");
  }

  toJSON() {
    return Object.assign({ ...new Object(this) });
  }
}
