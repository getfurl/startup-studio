import { Observable, Subject, BehaviorSubject, zip } from "rxjs";
import { Injectable } from "@angular/core";
import * as clm from "clmtrackr/build/clmtrackr.js";
import * as model_pca_20_svm from "clmtrackr/models/model_pca_20_svm";
import { finalize, share, map } from "rxjs/operators";
import { environment } from '../../environments/environment';

declare var emotionClassifier;
declare var emotionModel;
delete emotionModel["disgusted"];
delete emotionModel["fear"];

@Injectable({
  providedIn: "root"
})
export class EmotionService {
  tracker = clm.tracker;
  pModel = model_pca_20_svm;
  fixedHeight = 300;
  debug = false;
  getUserMedia =
    navigator.getUserMedia ||
    navigator["webkitGetUserMedia"] ||
    navigator["mozGetUserMedia"] ||
    navigator["msGetUserMedia"];
  URL =
    window.URL || window["webkitURL"] || window["msURL"] || window["mozURL"];

  AudioContext = window["AudioContext"] || window["webkitAudioContext"];
  private _mediaStreamConstrains = {
    video: true,
    audio: Object.assign(
      {},
      { echoCancellation: false, noiseSuppression: false }
    )
  };

  private _ConversionFactor = 2 ** (16 - 1) - 1;

  constructor() {
    this.pModel.shapeModel.nonRegularizedVectors.push(9);
    this.pModel.shapeModel.nonRegularizedVectors.push(11);
  }

  getCameraStream(): Subject<MediaStream | any> {
    const $stream = new Subject();
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia(this._mediaStreamConstrains)
        .then(s => $stream.next(s))
        .catch(err => $stream.error(err));
    } else if (this.getUserMedia) {
      this.getUserMedia(
        this._mediaStreamConstrains,
        s => $stream.next(s),
        err => $stream.error(err)
      );
    } else {
      console.error(
        "EmotionService: No browser support for emotion recognition"
      );
    }
    return $stream;
  }

  getDataStream() {
    const $stream = this.getCameraStream();
    return $stream.pipe(
      map(stream => {
        const $emotion = this._getEmotionsFromStream(stream);

        return {
          $emotion,
          stream
        };
      })
    );
  }

  streamAudioData(e, socket: WebSocket) {
    const floatSamples = e.inputBuffer.getChannelData(0);

    if (socket && socket.readyState === socket.OPEN) {
      socket.send(
        Int16Array.from(floatSamples.map(n => n * this._ConversionFactor))
      );
    }
  }

  getTranscriptFromStream(stream, options = { debug: true }) {
    const $transcript = new BehaviorSubject<{
      transcript: string,
      isFinal: boolean,
      words: any
    }>({ transcript: "", isFinal: false, words : [] });
    const connection = new WebSocket(environment.ws);

    connection.onopen = function() {};

    connection.onerror = function(error) {
      console.error("WebSocket Error " + error);
    };

    connection.onmessage = function(e) {
      $transcript.next(JSON.parse(e.data));
    };

    const audioContext = new this.AudioContext();

    if (!audioContext) {
      return;
    }

    // AudioNode used to control the overall gain (or volume) of the audio graph

    const inputPoint = audioContext.createGain();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const scriptProcessor = inputPoint.context.createScriptProcessor(
      2048,
      2,
      2
    );

    microphone.connect(inputPoint);
    inputPoint.connect(analyser);
    inputPoint.connect(scriptProcessor);
    scriptProcessor.connect(inputPoint.context.destination);

    const audioProcessor = event => this.streamAudioData(event, connection);
    // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
    scriptProcessor.addEventListener("audioprocess", audioProcessor);

    const $stop = () => {
      if (scriptProcessor) {
        // Stop listening the stream from the michrophone
        scriptProcessor.removeEventListener("audioprocess", audioProcessor);
      }

      connection.close();
    };

    return $transcript.pipe(
      finalize($stop)
    )
  }

  stopStream(stream) {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
  }

  private _getEmotionsFromStream(stream, options = { debug: false }) {
    const videoElement: HTMLVideoElement | any = document.createElement(
      "video"
    );

    Object.assign(videoElement, {
      autoplay: true,
      width: 400,
      height: 300,
      loop: true,
      preload: "auto",
      playsinline: true,
      muted: true
    });

    if (options.debug) {
      document.body.append(videoElement);
    }

    const trackingStarted = false;
    // without faceDetection: {useWebWorkers: false}, findFace does not work
    const ctrack = new this.tracker({
      useWebGL: true,
      faceDetection: { useWebWorkers: false }
    });
    ctrack.init(this.pModel);

    const emotionCls = new emotionClassifier();
    emotionCls.init(emotionModel);
    const emotionData = emotionCls.getBlank();

    const emotionInterval = setInterval(() => {
      const cp = ctrack.getCurrentParameters();
      const er = emotionCls.meanPredict(cp);
      if (er) {
        let happySadValue = 0;
        const angry = er[0];
        const sad = er[1];
        const surprised = er[2];
        const happy = er[3];
        
        happySadValue = surprised.value + happy.value - (angry.value + sad.value)

        emotionSubject.next(happySadValue);
      }
    }, 10);

    const emotionSubject = new Subject();
    const $emotion = emotionSubject.pipe(
      finalize(() => {
        clearInterval(emotionInterval);
        videoElement.remove();
      }),
      share()
    );

    if ("srcObject" in videoElement) {
      videoElement.srcObject = stream;
    } else {
      videoElement.src = window.URL && window.URL.createObjectURL(stream);
    }

    videoElement.onloadedmetadata = () => {
      this.adjustVideoProportions(videoElement);
      videoElement.play();
      ctrack.start(videoElement);
    };

    videoElement.onresize = () => {
      this.adjustVideoProportions(videoElement);

      if (trackingStarted) {
        ctrack.stop();
        ctrack.reset();
        ctrack.start(videoElement);
      }
    };

    return $emotion;
  }

  adjustVideoProportions(videoElement: HTMLVideoElement) {
    const proportion = videoElement.videoWidth / videoElement.videoHeight;
    videoElement.width = Math.round(this.fixedHeight * proportion);
  }
}
