"use strict";
//select elements
const video = document.querySelector(".webcam");
const canvas = document.querySelector(".video");
const ctx = canvas.getContext("2d"); //ctx - context
const faceCanvas = document.querySelector(".face");
const faceCtx = faceCanvas.getContext("2d");
const faceDetector = new window.FaceDetector();
//sliders:
const options = {
    SIZE: 10,
    SCALE: 1.35
};
const optionsInputs = document.querySelectorAll('.controls input[type="range"]');
function handleOption(event) {
    const { value , name  } = event.currentTarget;
    options[name] = parseFloat(value);
}
optionsInputs.forEach((input)=>input.addEventListener("input", handleOption));
// write a function that will populate the users video
// as function returns promise (due to it needs to wait for camera ), need to use async - await
async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 1280,
            height: 720
        }
    });
    video.srcObject = stream;
    await video.play();
}
// size the canvases to be the same size as the video
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
faceCanvas.width = video.videoWidth;
faceCanvas.height = video.videoHeight;
// face detection
async function detect() {
    const faces = await faceDetector.detect(video);
    console.log(faces);
    // ask the browser when the next animation frame is, and tell it to run detect for us
    faces.forEach(drawFace); // for each face found it runs drawFace
    faces.forEach(censor);
    requestAnimationFrame(detect); // recursion - function run itself inside of itself
}
function drawFace(face) {
    const { width , height , top , left  } = face.boundingBox;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear what is drawn
    ctx.strokeStyle = "#ffc600";
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, width, height); //rect = rectangle
}
//pixel it:
function censor({ boundingBox: face  }) {
    faceCtx.imageSmoothingEnabled = false; //prevent bluring pixels;
    faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
    //draw the small face
    faceCtx.drawImage(// 5 source arguments
    video, face.x, face.y, face.width, face.height, // 4 draw args
    face.x, face.y, options.SIZE, options.SIZE);
    // draw the small face back on, but scale up
    const width = face.width * options.SCALE;
    const height = face.width * options.SCALE;
    faceCtx.drawImage(faceCanvas, face.x, face.y, options.SIZE, options.SIZE, // drawing args
    face.x - (width - face.width / 2), face.y - (height - face.heigth / 2), face.width, face.height);
}
populateVideo().then(detect);

//# sourceMappingURL=index.672d4772.js.map
