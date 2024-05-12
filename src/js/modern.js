import $7mIyb$cryptojs from "crypto-js";
import {load as $7mIyb$load, SupportedPackages as $7mIyb$SupportedPackages} from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";

/* eslint-disable */ 

const $87ab607216b64d80$var$EAR_THRESHOLD = 0.27;
let $87ab607216b64d80$var$model;
let $87ab607216b64d80$var$event;
let $87ab607216b64d80$var$blinkCount = 0;
// Loading model from Tensorflow.js
const $87ab607216b64d80$var$loadModel = async (maxResults)=>{
    $87ab607216b64d80$var$model = await $7mIyb$load($7mIyb$SupportedPackages.mediapipeFacemesh, {
        maxFaces: maxResults
    });
};
// Calculate the position of eyelid to predict a blink
function $87ab607216b64d80$var$getEAR(upper, lower) {
    function getEucledianDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    return (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1]) + getEucledianDistance(upper[3][0], upper[3][1], lower[2][0], lower[2][1])) / (2 * getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]));
}
async function $87ab607216b64d80$var$startPrediciton(video) {
    // Sending video to model for prediction
    const predictions = await $87ab607216b64d80$var$model.estimateFaces({
        input: video
    });
    if (predictions.length > 0) predictions.forEach((prediction)=>{
        // Right eye parameters
        const lowerRight = prediction.annotations.rightEyeUpper0;
        const upperRight = prediction.annotations.rightEyeLower0;
        const rightEAR = $87ab607216b64d80$var$getEAR(upperRight, lowerRight);
        // Left eye parameters
        const lowerLeft = prediction.annotations.leftEyeUpper0;
        const upperLeft = prediction.annotations.leftEyeLower0;
        const leftEAR = $87ab607216b64d80$var$getEAR(upperLeft, lowerLeft);
        // True if the eye is closed
        const blinked = leftEAR <= $87ab607216b64d80$var$EAR_THRESHOLD && rightEAR <= $87ab607216b64d80$var$EAR_THRESHOLD;
        // Determine how long you blinked
        if (blinked) {
            $87ab607216b64d80$var$event = {
                shortBlink: false,
                longBlink: false
            };
            $87ab607216b64d80$var$blinkCount += 1;
        } else $87ab607216b64d80$var$event = {
            shortBlink: $87ab607216b64d80$var$blinkCount <= 5 && $87ab607216b64d80$var$blinkCount !== 0,
            longBlink: $87ab607216b64d80$var$blinkCount > 5
        };
    });
    return {
        ...predictions[0],
        ...$87ab607216b64d80$var$event,
        "blinkCount": $87ab607216b64d80$var$blinkCount
    };
}
const $87ab607216b64d80$var$blinkCapture = {
    loadModel: $87ab607216b64d80$var$loadModel,
    startPrediciton: $87ab607216b64d80$var$startPrediciton
};
var $87ab607216b64d80$export$2e2bcd8739ae039 = $87ab607216b64d80$var$blinkCapture;



let $93059d4fd2f5365b$var$enableLogs = true;
function $93059d4fd2f5365b$var$log(...txt) {
    if ($93059d4fd2f5365b$var$enableLogs) console.log(...txt); // eslint-disable-line no-console
}
class $93059d4fd2f5365b$var$FixedSizeFIFO {
    constructor(maxSize){
        console.log("max size is", maxSize);
        this.maxSize = maxSize;
        this.queue = [];
    }
    push(item) {
        if (this.queue.length === this.maxSize) this.queue.shift();
        this.queue.push(item);
    }
    getQueue() {
        return this.queue;
    }
}
class $93059d4fd2f5365b$export$dc77199a917e22c2 {
    #detectedFaces;
    minScore = 0.2;
    maxResults = 1;
    config;
    constructor(config, snapshotLength = 10, enableLogs = false){
        this.config = config;
        this.#detectedFaces = new $93059d4fd2f5365b$var$FixedSizeFIFO(snapshotLength);
        this.#init();
        this.toggleLogs(enableLogs);
    }
    async #init() {
        await (0, $87ab607216b64d80$export$2e2bcd8739ae039).loadModel(this.maxResults);
        await this.#setupCamera();
    }
    async #setupCamera() {
        const video = document.getElementById("dte-video");
        const canvas = document.getElementById("dte-canvas");
        if (!video || !canvas) return null;
        $93059d4fd2f5365b$var$log("Setting up camera");
        if (!navigator.mediaDevices) {
            $93059d4fd2f5365b$var$log("Camera Error: access not supported");
            return null;
        }
        let stream;
        const constraints = {
            audio: false,
            video: {
                facingMode: "user",
                resizeMode: "crop-and-scale"
            }
        };
        if (window.innerWidth > window.innerHeight) constraints.video.width = {
            ideal: window.innerWidth
        };
        else constraints.video.height = {
            ideal: window.innerHeight
        };
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
            if (err.name === "PermissionDeniedError" || err.name === "NotAllowedError") $93059d4fd2f5365b$var$log(`Camera Error: camera permission denied: ${err.message || err}`);
            if (err.name === "SourceUnavailableError") $93059d4fd2f5365b$var$log(`Camera Error: camera not available: ${err.message || err}`);
            return null;
        }
        if (stream) video.srcObject = stream;
        else {
            $93059d4fd2f5365b$var$log("Camera Error: stream empty");
            return null;
        }
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        if (settings.deviceId) delete settings.deviceId;
        if (settings.groupId) delete settings.groupId;
        if (settings.aspectRatio) settings.aspectRatio = Math.trunc(100 * settings.aspectRatio) / 100;
        $93059d4fd2f5365b$var$log(`Camera active: ${track.label}`);
        $93059d4fd2f5365b$var$log(`Camera settings: ${settings.toString()}`);
        return new Promise((resolve)=>{
            video.onloadeddata = async ()=>{
                canvas.width = video.offsetWidth;
                canvas.height = video.offsetHeight;
                video.play();
                this.#detectVideo(video, canvas);
                resolve(true);
            };
        });
    }
    async #detectVideo(video, canvas) {
        if (!video || video.paused) return false;
        let detectionChain = this.detectFaceFromMedia(video);
        // this.#drawFaces(canvas, result);
        detectionChain.then((result)=>{
            // console.log("result", result);
            this.#detectedFaces.push(result);
            this.#drawFaces(video, canvas, result);
            requestAnimationFrame(()=>this.#detectVideo(video, canvas));
            return true;
        }).catch((err)=>{
            console.log("Detect Error: ", err);
            return false;
        });
        return false;
    }
    #drawFaces(video, canvas, data) {
        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });
        if (!ctx || !data) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const videoHeight = video.videoHeight;
        const videoWidth = video.videoWidth;
        if (data) {
            const person = data;
            // draw box around each face
            ctx.lineWidth = 3;
            ctx.strokeStyle = "deepskyblue";
            ctx.fillStyle = "deepskyblue";
            ctx.globalAlpha = 0.6;
            if (person.boundingBox) {
                var topLeftX = person.boundingBox.topLeft[0] * (canvasWidth / videoWidth);
                var topLeftY = person.boundingBox.topLeft[1] * (canvasHeight / videoHeight);
                var width = (person.boundingBox.bottomRight[0] - person.boundingBox.topLeft[0]) * (canvasWidth / videoWidth);
                var height = (person.boundingBox.bottomRight[1] - person.boundingBox.topLeft[1]) * (canvasHeight / videoHeight);
                // Draw the scaled annotation
                ctx.beginPath();
                ctx.rect(topLeftX, topLeftY, width, height);
                ctx.stroke();
            }
            if (person?.annotations) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = "lightblue";
                const pointSize = 1.5;
                const rightEyeUpper0 = person.annotations.rightEyeUpper0;
                const rightEyeLower0 = person.annotations.rightEyeLower0;
                const leftEyeUpper0 = person.annotations.leftEyeUpper0;
                const leftEyeLower0 = person.annotations.leftEyeLower0;
                const leftEyebrowUpper = person.annotations.leftEyebrowUpper;
                const rightEyebrowUpper = person.annotations.rightEyebrowUpper;
                const noseBottom = person.annotations.noseBottom;
                const noseLeftCorner = person.annotations.noseLeftCorner;
                const noseRightCorner = person.annotations.noseRightCorner;
                const noseTip = person.annotations.noseTip;
                const lipsLowerInner = person.annotations.lipsLowerInner;
                const lipsLowerOuter = person.annotations.lipsLowerOuter;
                const lipsUpperInner = person.annotations.lipsUpperInner;
                const lipsUpperOuter = person.annotations.lipsUpperOuter;
                const silhouette = person.annotations.silhouette;
                const eyeOutlinePoints = rightEyeUpper0.concat(rightEyeLower0, leftEyeUpper0, leftEyeLower0, leftEyebrowUpper, rightEyebrowUpper, noseBottom, noseLeftCorner, noseRightCorner, noseTip, lipsLowerInner, lipsLowerOuter, lipsUpperInner, lipsUpperOuter, silhouette);
                eyeOutlinePoints.forEach((point)=>{
                    var x = point[0] * (canvasWidth / videoWidth);
                    var y = point[1] * (canvasHeight / videoHeight);
                    ctx.beginPath();
                    ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        }
    }
    async detectFaceFromMedia(MediaElement) {
        let result = await (0, $87ab607216b64d80$export$2e2bcd8739ae039).startPrediciton(MediaElement);
        return result;
    }
    async #encryptString(string) {
        var secretKey = this.config.encryptionKey;
        var payload = string;
        // Convert the secret key to a format suitable for encryption
        var derived_key = (0, $7mIyb$cryptojs).enc.Base64.parse(secretKey);
        // Initialize the initialization vector (IV) and encryption mode
        var iv = (0, $7mIyb$cryptojs).enc.Utf8.parse(this.config.encryptionIV);
        var encryptionOptions = {
            iv: iv,
            mode: (0, $7mIyb$cryptojs).mode.CBC
        };
        // Encrypt the payload using AES encryption with the derived key and encryption options
        const result = (0, $7mIyb$cryptojs).AES.encrypt(payload, derived_key, encryptionOptions).toString();
        console.log("res", result);
        return result;
    }
    async recognizeFace(referenceImg, queryImg) {
        console.log("endpoint", this.config.fastappEndpoint);
        const url = new URL(this.config.fastappEndpoint + "/sdk/face_recognition");
        const img1 = await this.#encryptString(referenceImg);
        const img2 = await this.#encryptString(queryImg);
        const payload = {
            img1: img1,
            img2: img2
        };
        // Prepare the request body with additional parameters
        try {
            const response = await fetch(url.toString(), {
                method: "POST",
                headers: {
                    tenantId: "penncom",
                    requestId: "6e4b172b-869b-440e-831f-72c284982121",
                    apiKey: "s03rtpjCca8cEEKhWyYgv76C0nMrDlIf1fZNLOdE",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const data = await response.json();
            console.log("API response:", data);
            return data;
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }
    // Method to set maxResults
    setMaxResults(results) {
        this.maxResults = results;
    }
    toggleLogs(toggleLog) {
        $93059d4fd2f5365b$var$enableLogs = toggleLog;
    }
    getDetectedFace() {
        return this.#detectedFaces.getQueue();
    }
}


class $0bf080f493db0867$export$3ef7dfa481c29628 {
    faceDetection;
    config;
    constructor(config){
        this.fastappEndpoint = config.fastappEndpoint;
        this.LivenessEndpoint = config.LivenessEndpoint;
        this.config = config;
    }
    initFaceDetection() {
        let config = this.config;
        try {
            this.faceDetection = new (0, $93059d4fd2f5365b$export$dc77199a917e22c2)(config, config.faceDetection.snapshotLength, config.faceDetection.enableLogs);
        } catch (e) {
            console.log("Error " + e.toString());
        }
        return this.faceDetection;
    }
}


export {$0bf080f493db0867$export$3ef7dfa481c29628 as dteSDK};
//# sourceMappingURL=modern.js.map
