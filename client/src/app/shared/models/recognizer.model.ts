import { BehaviorSubject } from 'rxjs';

export class FurlRecognizer {
  instance: SpeechRecognition;
  capturedText = new BehaviorSubject<{ transcript: string, isFinal: boolean }>(null);
  
  constructor(speechRecognitionInstance) {
    this.instance = speechRecognitionInstance;
    this.instance.lang = 'en-US';
    this.instance.interimResults = true;
    this.instance.continuous = true;
    this.instance.maxAlternatives = 1;

    this.instance.onresult = event => {
      const isFinal = event.results[0].isFinal;
      const transcript = event.results[0][0].transcript;
      if (isFinal) {
        console.log(transcript);
      }
      this.capturedText.next({transcript, isFinal});
    }
  }

  start() {
    this.instance.start();
  }

  stop() {
    this.instance.stop();
  }
}