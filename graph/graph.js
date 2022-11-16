// let cnv = document.getElementById('canvas');
// let ctx = cnv.getContext('2d');

// cnv.width = window.innerWidth - 30;
// cnv.height = window.innerHeight - 25;

// const fftData = fetch('http://localhost:3000/getData')
//    .then((response) => response.json())
//    .then((data) => graphData(data));

// function graphData(data) {
//    ctx.beginPath();
//    ctx.moveTo(data[0].frequency, cnv.height / 2 - data[0].magnitude * 0.1);

//    for (point of data) {
//       const coords = { x: point.frequency * 0.1, y: cnv.height / 2 - point.magnitude * 0.1 };

//       ctx.lineTo(coords.x, coords.y);
//    }
//    ctx.stroke();

//    for (point of data) {
//       const coords = { x: point.frequency * 0.1, y: cnv.height / 2 - point.magnitude * 0.1 };

//       ctx.beginPath();
//       ctx.arc(coords.x, coords.y, 2, 0, 2 * Math.PI);
//       ctx.fill();
//    }
// }

navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
   const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

   let source = audioCtx.createMediaStreamSource(stream);

   const analyser = audioCtx.createAnalyser();
   analyser.fftSize = 2048;

   const bufferLength = analyser.frequencyBinCount;
   const dataArray = new Uint8Array(bufferLength);
   analyser.getByteFrequencyData(dataArray);

   // Connect the source to be analysed
   source.connect(analyser);

   const cnv = document.getElementById('canvas');
   const ctx = cnv.getContext('2d');

   cnv.width = window.innerWidth - 20;
   cnv.height = window.innerHeight - 25;

   const circle = { x: cnv.width / 2, y: cnv.height / 2, r: 100, spiky: 0.2 };
   let angle = 0;
   let start = {};

   function draw() {
      analyser.getByteFrequencyData(dataArray);

      cnv.width = window.innerWidth - 20;
      cnv.height = window.innerHeight - 25;

      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, cnv.width, cnv.height);

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(0, 0, 0)';

      ctx.beginPath();

      for (let i = 0; i <= bufferLength; i++) {
         dist = circle.r + dataArray[i] * circle.spiky;

         let x = circle.x + dist * Math.sin(angle);
         let y = circle.y + dist * Math.cos(angle);

         if (i == bufferLength) {
            x = start.x;
            y = start.y;
            angle -= (2 * Math.PI) / bufferLength;
         }

         if (i == 1) {
            ctx.moveTo(x, y);
            start.x = x;
            start.y = y;
         } else {
            ctx.lineTo(x, y);
         }

         angle += (2 * Math.PI) / bufferLength;
      }

      ctx.stroke();

      requestAnimationFrame(draw);
   }

   draw();
});
