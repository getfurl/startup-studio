const Server = require('ws').Server;
const port = 9030;
const ws = new Server({port: port});
const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient();
const request = {
  config: {
    encoding: "LINEAR16",
    sampleRateHertz: 44100,
    languageCode: 'en-us',
    enableWordTimeOffsets: true
  },
  interimResults: true, // If you want interim results, set this to true
};

ws.on('connection', function(w){
  const recognizeStream = client
  .streamingRecognize(request)
  .on('data', data => {
    if (data.results[0] && data.results[0].alternatives[0] && w.readyState !== 3) {
      w.send(JSON.stringify({
        isFinal: data.results[0].isFinal,
        transcript: data.results[0].alternatives[0].transcript,
        words: data.results[0].alternatives[0].words.map(wordInfo => ({ start: parseInt(wordInfo.startTime.seconds) + wordInfo.startTime.nanos / 1000000000, end: parseInt(wordInfo.endTime.seconds) + wordInfo.endTime.nanos / 1000000000}))
      }))
    }
  })
  .on('error', (err) => console.error(err));
  
  w.on('message', (data) => {
    // Audio buffer data
    const buffer = new Int16Array(data, 0, Math.floor(data.byteLength / 2));
    // Write the data chunk in the stream
    recognizeStream.write(buffer);
  });
  
  w.on('close', function() {
    recognizeStream.end();
  });
});

module.exports = {};