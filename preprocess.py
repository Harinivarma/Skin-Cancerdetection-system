import os
import shutil
import random
from PIL import Image

# Paths
dataset_dir = "dataset"  # original organized dataset
output_dir = "preprocessed_data"
classes = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]

# Create train/val/test folders
splits = ["train", "val", "test"]
for split in splits:
    for cls in classes:
        os.makedirs(os.path.join(output_dir, split, cls), exist_ok=True)

# Split ratios
train_ratio = 0.7
val_ratio = 0.2
test_ratio = 0.1

# Process each class
for cls in classes:
    images = os.listdir(os.path.join(dataset_dir, cls))
    random.shuffle(images)
    total = len(images)
    train_end = int(total * train_ratio)
    val_end = int(total * (train_ratio + val_ratio))

    for i, img_name in enumerate(images):
        img_path = os.path.join(dataset_dir, cls, img_name)
        img = Image.open(img_path).convert("RGB")  # open image
        img = img.resize((224, 224))               # resize to 224x224

        # Decide split
        if i < train_end:
            split_folder = "train"
        elif i < val_end:
            split_folder = "val"
        else:
            split_folder = "test"

        save_path = os.path.join(output_dir, split_folder, cls, img_name)
        img.save(save_path)