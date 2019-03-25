import { Observable, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import * as clm from "clmtrackr/build/clmtrackr.js";
import * as model_pca_20_svm from "clmtrackr/models/model_pca_20_svm";
import { finalize, share } from "rxjs/operators";

declare var emotionClassifier;
declare var emotionModel;
delete emotionModel['disgusted'];
delete emotionModel['fear'];

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

  constructor() {
    this.pModel.shapeModel.nonRegularizedVectors.push(9);
    this.pModel.shapeModel.nonRegularizedVectors.push(11);
  }

  getCameraStream(): Subject<MediaStream | any> {
    const $stream = new Subject();
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(s => $stream.next(s))
        .catch(err => $stream.error(err));
    } else if (this.getUserMedia) {
      this.getUserMedia(
        { video: true },
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

  getEmotionStream() {
    const videoElement: HTMLVideoElement | any = document.createElement(
      "video"
    );

    Object.assign(videoElement, {
      autoplay: true,
      width: 400,
      height: 300,
      loop: true,
      preload: "auto",
      playsinline: true
    });

    if (this.debug) {
      document.body.append(videoElement);
    }

    const trackingStarted = false;
    // without faceDetection: {useWebWorkers: false}, findFace does not work
    const ctrack = new this.tracker({ useWebGL: true, faceDetection: {useWebWorkers: false} });
    ctrack.init(this.pModel);

    const emotionCls = new emotionClassifier();
    emotionCls.init(emotionModel);
    const emotionData = emotionCls.getBlank();

    const emotionInterval = setInterval(() => {
      const cp = ctrack.getCurrentParameters();
      const er = emotionCls.meanPredict(cp);
      if (er) {
        emotionSubject.next(er);
      }
    }, 100);

    const emotionSubject = new Subject();
    const $emotion = emotionSubject.pipe(
      finalize(() => {
        clearInterval(emotionInterval);
        videoElement.remove();
        if (_stream) {
          _stream.getTracks().forEach(t => t.stop())
        }
      }),
      share()
    );

    let _stream;

    this.getCameraStream().subscribe(
      stream => {
        _stream = stream;

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
      },
      err => {
        console.error("EmotionService: " + err);
      }
    );

    return $emotion;
  }

  adjustVideoProportions(videoElement: HTMLVideoElement) {
    const proportion = videoElement.videoWidth / videoElement.videoHeight;
    videoElement.width = Math.round(this.fixedHeight * proportion);
  }
}
