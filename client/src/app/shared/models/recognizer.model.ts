import { BehaviorSubject } from 'rxjs';

export class FurlRecognizer {
  instance: SpeechRecognition;
  capturedText = new BehaviorSubject<string>(null);
  
  constructor(speechRecognitionInstance) {
    this.instance = speechRecognitionInstance;
    this.instance.lang = 'en-US';
    this.instance.interimResults = false;
    this.instance.continuous = true;

    this.instance.onresult = event => {
      const text = event.results[event.results.length - 1][0].transcript;
      this.capturedText.next(text);
    }
  }

  start() {
    this.instance.start();
  }

  stop() {
    this.instance.stop();
  }
}