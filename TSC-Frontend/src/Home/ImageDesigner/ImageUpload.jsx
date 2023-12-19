import React, { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [uploadPrompt, setUploadPrompt] = useState(null);

  const handleImageChange = (e) => {
    setImage(null);
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setUploadPrompt(null);
    }
  };

  const handleImageUpload = () => {
    if (image) {
      const storage = getStorage();
      const storageRef = ref(storage, `/images/${image.name}`);
      //   const uploadTask = storageRef.put(image);
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          setUploadPrompt("Image Uploaded Successfully");
          setTimeout(() => {
            setUploadPrompt(null);
          }, 3000);
        })
        .catch((err) => {
          console.error("Error while uploading image", err);
          setUploadPrompt("Erro while uploading image");
        });
    }
  };
  return (
    <>
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleImageUpload}>Upload Image</button>
        {uploadPrompt && <p>{uploadPrompt}</p>}
      </div>
    </>
  );
}
