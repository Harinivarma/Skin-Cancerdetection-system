let chart;

/* =====================================================
   ELEMENTS
===================================================== */
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const uploadBtn = document.getElementById("uploadBtn");

const predictionText = document.getElementById("prediction");
const confidenceText = document.getElementById("confidence");
const diseaseInfoText = document.getElementById("diseaseInfo");
const hospitalDiv = document.getElementById("hospitalList");

const openCameraBtn = document.getElementById("openCameraBtn");
const flipCameraBtn = document.getElementById("flipCameraBtn"); // ⭐ NEW
const cameraPreview = document.getElementById("cameraPreview");
const captureBtn = document.getElementById("captureBtn");

let cameraStream = null;
let capturedBlob = null;
let usingFrontCamera = false; // ⭐ FLIP SUPPORT

/* =====================================================
   LABELS & DESCRIPTIONS
===================================================== */
const cancerClasses = ["mel", "bcc", "akiec"];

const labelMap = {
    nv: "Normal Mole (Benign)",
    mel: "Melanoma (Malignant)",
    bcc: "Basal Cell Carcinoma",
    bkl: "Benign Keratosis",
    akiec: "Pre-cancerous Lesion",
    vasc: "Vascular Lesion",
    df: "Dermatofibroma"
};

const diseaseInfo = {
    nv: "Melanocytic nevus is a common and benign mole.",
    mel: "Melanoma is a dangerous form of skin cancer.",
    bcc: "Basal cell carcinoma is a common skin cancer.",
    bkl: "Benign keratosis is non-cancerous.",
    akiec: "Pre-cancerous skin lesion.",
    vasc: "Vascular skin lesion.",
    df: "Benign skin lump."
};


/* =====================================================
   START CAMERA (with flip support)
===================================================== */
async function startCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: usingFrontCamera ? "user" : "environment"
            }
        });

        cameraPreview.srcObject = cameraStream;

        cameraPreview.style.display = "block";
        captureBtn.style.display = "inline-block";
        flipCameraBtn.style.display = "inline-block"; // ⭐ SHOW FLIP BUTTON

        previewImage.style.display = "none";
        capturedBlob = null;
    } catch (err) {
        alert("Camera access blocked or unavailable.");
        console.error(err);
    }
}


/* =====================================================
   OPEN CAMERA
===================================================== */
if (openCameraBtn) {
    openCameraBtn.addEventListener("click", async () => {
        usingFrontCamera = false; // first open = back camera
        startCamera();
    });
}


/* =====================================================
   FLIP CAMERA (Front ↔ Rear)
===================================================== */
if (flipCameraBtn) {
    flipCameraBtn.addEventListener("click", () => {
        usingFrontCamera = !usingFrontCamera;
        startCamera();
    });
}


/* =====================================================
   CAPTURE IMAGE + AUTO-CROP CENTER SQUARE
===================================================== */
if (captureBtn) {
    captureBtn.addEventListener("click", () => {
        const video = cameraPreview;

        const w = video.videoWidth;
        const h = video.videoHeight;
        const cropSize = Math.min(w, h);

        const canvas = document.createElement("canvas");
        canvas.width = cropSize;
        canvas.height = cropSize;

        const ctx = canvas.getContext("2d");

        // ⭐ AUTO CROP (center square)
        ctx.drawImage(
            video,
            (w - cropSize) / 2,
            (h - cropSize) / 2,
            cropSize,
            cropSize,
            0,
            0,
            cropSize,
            cropSize
        );

        cameraStream.getTracks().forEach(t => t.stop());

        canvas.toBlob(blob => {
            capturedBlob = blob;
            previewImage.src = URL.createObjectURL(blob);
            previewImage.style.display = "block";
        });

        cameraPreview.style.display = "none";
        captureBtn.style.display = "none";
        flipCameraBtn.style.display = "none";
    });
}


/* =====================================================
   IMAGE PREVIEW (UPLOAD)
===================================================== */
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    capturedBlob = null;

    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
});


/* =====================================================
   SEND IMAGE TO FLASK API
===================================================== */
uploadBtn.addEventListener("click", () => {
    let finalImage;

    if (capturedBlob) {
        finalImage = capturedBlob;
    } else {
        const file = imageInput.files[0];
        if (!file) {
            alert("Please upload an image or take a picture.");
            return;
        }
        finalImage = file;
    }

    predictionText.innerText = "Predicting...";
    confidenceText.innerText = "";
    diseaseInfoText.innerText = "";
    hospitalDiv.innerHTML = "";

    const formData = new FormData();
    formData.append("image", finalImage);

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("resultArea").style.display = "block";

            const confidence = (data.confidence * 100).toFixed(2);

            if (confidence < 80) {
                predictionText.innerText = "Prediction unclear";
                confidenceText.innerText = `Confidence: ${confidence}%`;
                return;
            }

            predictionText.innerText = labelMap[data.prediction];
            confidenceText.innerText = confidence + "%";
            diseaseInfoText.innerText = diseaseInfo[data.prediction];

            if (chart) chart.destroy();

            const classLabels = Object.keys(labelMap);
            const values = classLabels.map(k =>
                (data.all_confidences[k] * 100).toFixed(2)
            );

            chart = new Chart(document.getElementById("confidenceChart"), {
                type: "bar",
                data: {
                    labels: classLabels.map(k => labelMap[k]),
                    datasets: [{
                        label: "Prediction (%)",
                        data: values,
                        backgroundColor: "#0d6efd"
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });

            if (cancerClasses.includes(data.prediction)) {
                loadHospitals();
            }
        })
        .catch(err => {
            console.error(err);
            alert("❌ Flask API Error");
        });
});


/* =====================================================
   LOAD HOSPITALS
===================================================== */
function loadHospitals() {
    const city = localStorage.getItem("userCity") || "Hyderabad";

    hospitalDiv.innerHTML = "<p>Loading hospitals...</p>";

    fetch(`http://localhost:9090/hospitals?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                hospitalDiv.innerHTML = "<p>No hospitals found.</p>";
                return;
            }

            hospitalDiv.innerHTML = data.map(h => `
                <div class="hospital-card">
                    <strong>${h.name}</strong><br>
                    ${h.address}<br>
                    <span class="phone">📞 ${h.phone}</span>
                </div>
            `).join("");
        })
        .catch(() => {
            hospitalDiv.innerHTML = "<p>Error loading hospitals.</p>";
        });
}
