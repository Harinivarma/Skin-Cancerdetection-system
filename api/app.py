from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# 🔥 FULL CORS FIX (Required for frontend → Flask communication)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load Model
model = tf.keras.models.load_model("skin_cancer_model.h5")

# Class labels (must match model output order)
class_names = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]


# ---------------- PREPROCESSING ----------------
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))

    # Convert to RGB always
    if image.mode != "RGB":
        image = image.convert("RGB")

    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    return image


# ---------------- PREDICT API ----------------
@app.route('/predict', methods=['POST'])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    # Read image file
    img_bytes = request.files["image"].read()
    img = preprocess_image(img_bytes)

    # Model prediction
    prediction = model.predict(img)[0]  # shape: (7,)
    predicted_idx = int(np.argmax(prediction))

    predicted_class = class_names[predicted_idx]
    confidence = float(prediction[predicted_idx])

    # Return all 7 class probabilities
    all_conf = {
        class_names[i]: float(prediction[i]) 
        for i in range(len(class_names))
    }

    # Sorted for graphs
    sorted_conf = sorted(all_conf.items(), key=lambda x: x[1], reverse=True)

    return jsonify({
        "prediction": predicted_class,
        "confidence": confidence,
        "all_confidences": all_conf,
        "sorted_confidences": sorted_conf
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
