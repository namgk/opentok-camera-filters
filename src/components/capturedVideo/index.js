/* global MediaRecorder */

// require('./captureImage.css');

module.exports = function captureVideo(canvas) {
  let mediaRecorder;
  let recordedBlobs;

  return {
    start: () => {
      recordedBlobs = [];
      const options = { mimeType: 'video/webm;codecs=vp9' };
      mediaRecorder = new MediaRecorder(canvas.captureStream(), options);
      mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      });
      mediaRecorder.start(10); // collect 10ms of data
    },
    stop: () => {
      mediaRecorder.stop();
      if (recordedBlobs.length < 10) {
        return false;
      }
      const recordedVideo = document.createElement('video');
      const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
      recordedVideo.src = window.URL.createObjectURL(superBuffer);
      return recordedVideo;
    },
  };
};
