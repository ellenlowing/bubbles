let audioCtx;
// let canvas = document.getElementById("viz");
// let canvasCtx = canvas.getContext("2d");
let blowEl = document.getElementById("blow");

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext();
  } catch (e) {
    alert("No web audio support in this browser!");
  }

  let onBlow = new CustomEvent("on-blow", {
    detail: {},
    bubbles: true,
    cancelable: true,
    composed: false,
  });

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }

      const source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let micPower = 0;
      let ALPHA = 0.05;
      let i = 0;

      source.connect(analyser);
      draw();

      function draw() {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        let instantaneousPower = dataArray[0];
        for (let i = 1; i < bufferLength; i++) {
          if (instantaneousPower < dataArray[i]) {
            instantaneousPower = dataArray[i];
          }
        }

        // low-pass filter
        micPower = ALPHA * instantaneousPower + (1.0 - ALPHA) * micPower;

        if (Math.abs(micPower) > 150) {
          i++;
          // If low-pass filter condition is fulfilled >= 5 times
          if (i > 5) {
            blowEl.dispatchEvent(onBlow);
            blowEl.innerHTML = "Blowing";
          }
        } else {
          i = 0;
          blowEl.innerHTML = "No blowing";
        }

        // Uncomment if I want visualization
        // const WIDTH = canvas.width;
        // const HEIGHT = canvas.height;
        // canvasCtx.fillStyle = "rgb(200, 200, 200)";
        // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        // canvasCtx.lineWidth = 2;
        // canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        // canvasCtx.beginPath();
        // let sliceWidth = (WIDTH * 1.0) / bufferLength;
        // let x = 0;
        // for (let i = 0; i < bufferLength; i++) {
        //   let v = dataArray[i] / 128.0;
        //   let y = (v * HEIGHT) / 2;
        //   if (i === 0) {
        //     canvasCtx.moveTo(x, y);
        //   } else {
        //     canvasCtx.lineTo(x, y);
        //   }
        //   x += sliceWidth;
        // }
        // canvasCtx.lineTo(canvas.width, canvas.height / 2);
        // canvasCtx.stroke();
      }
    })
    .catch((error) => {
      console.error(`${error.name}`);
    });
};
