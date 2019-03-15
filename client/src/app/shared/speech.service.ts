import { Injectable } from '@angular/core';
import { FurlRecognizer } from './models';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition']

  constructor() { 
  }

  recognizer(): FurlRecognizer {
    return new FurlRecognizer(new this.SpeechRecognition());
  }
}