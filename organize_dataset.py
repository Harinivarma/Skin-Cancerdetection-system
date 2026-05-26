import os
import shutil
import pandas as pd

# File paths
metadata_file = "HAM10000_metadata.csv"  # CSV file
images_folder = "images/"                # All images
output_folder = "dataset/"               # Folder to create

# Read CSV
df = pd.read_csv(metadata_file)

# Create folders for each class
classes = df['dx'].unique()
for c in classes:
    os.makedirs(os.path.join(output_folder, c), exist_ok=True)

# Copy images into their respective folders
for index, row in df.iterrows():
    img_name = row['image_id'] + ".jpg"   # Add .jpg extension
    label = row['dx']                     # Class label
    src = os.path.join(images_folder, img_name)
    dst = os.path.join(output_folder, label, img_name)
    if os.path.exists(src):
        shutil.copy(src, dst)

print("All images organized successfully!")