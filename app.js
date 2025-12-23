let sentences = [];
let currentIndex = 0;
let targetWord = "";
let drawing = false;

const guideCanvas = document.getElementById("guideCanvas");
const drawCanvas = document.getElementById("drawCanvas");
const guideCtx = guideCanvas.getContext("2d");
const drawCtx = drawCanvas.getContext("2d");

document.getElementById("startBtn").onclick = () => {
    const text = document.getElementById("textInput").value;
    sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    currentIndex = 0;
    document.getElementById("practiceArea").hidden = false;
    showSentence();
};

document.getElementById("nextBtn").onclick = () => {
    currentIndex++;
    showSentence();
};

document.getElementById("clearBtn").onclick = clearDrawing;
document.getElementById("scoreBtn").onclick = scoreTracing;

function showSentence() {
    clearDrawing();
    guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);

    if (currentIndex >= sentences.length) {
        document.getElementById("sentence").textContent = "Done.";
        return;
    }

    const sentence = sentences[currentIndex].trim();
    document.getElementById("sentence").textContent = sentence;

    const words = sentence.split(" ");
    targetWord = words[Math.floor(words.length / 2)];

    drawGuideWord(targetWord);
}

function drawGuideWord(word) {
    guideCtx.font = "96px sans-serif";
    guideCtx.strokeStyle = "#ccc";
    guideCtx.lineWidth = 2;
    guideCtx.textAlign = "center";
    guideCtx.textBaseline = "middle";
    guideCtx.strokeText(word, 300, 90);
}

function clearDrawing() {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    document.getElementById("score").textContent = "";
}

drawCanvas.addEventListener("pointerdown", e => {
    drawing = true;
    drawCtx.beginPath();
    drawCtx.moveTo(e.offsetX, e.offsetY);
});

drawCanvas.addEventListener("pointermove", e => {
    if (!drawing) return;
    drawCtx.lineTo(e.offsetX, e.offsetY);
    drawCtx.strokeStyle = "black";
    drawCtx.lineWidth = 4;
    drawCtx.lineCap = "round";
    drawCtx.stroke();
});

drawCanvas.addEventListener("pointerup", () => drawing = false);
drawCanvas.addEventListener("pointerleave", () => drawing = false);

function scoreTracing() {
    const guideData = guideCtx.getImageData(0, 0, 600, 180).data;
    const drawData = drawCtx.getImageData(0, 0, 600, 180).data;

    let overlap = 0;
    let guidePixels = 0;

    for (let i = 0; i < guideData.length; i += 4) {
        if (guideData[i + 3] > 0) {
            guidePixels++;
            if (drawData[i + 3] > 0) {
                overlap++;
            }
        }
    }

    const score = guidePixels === 0
        ? 0
        : Math.round((overlap / guidePixels) * 100);

    document.getElementById("score").textContent =
        `Accuracy: ${score}%`;
}