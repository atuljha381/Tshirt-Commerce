import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadPrompt, setUploadPrompt] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [imageInfos, setImageInfos] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setUploadPrompt(null);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setProgress(0);
      setMessage("");
    }
  };

  const handleImageUpload = () => {
    if (image) {
      const storage = getStorage();
      const storageRef = ref(storage, `/images/${image.name}`);
      //   const uploadTask = storageRef.put(image);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              setMessage("Upload Paused");
              break;
            case "running":
              setMessage("Upload is running");
              break;
            default:
              setMessage("");
          }
        },
        (err) => {
          console.error("Error while uploading image", err);
          setUploadPrompt("Erro while uploading image");
        },
        () => {
          setMessage(uploadTask.snapshot.metadata);
          setIsError(false);
          setUploadPrompt("Image Uploaded Successfully");
          setImage(null);
          setTimeout(() => {
            setUploadPrompt(null);
          }, 3000);
        }
      );
    }
  };
  return (
    <>
      <div>
        {/* <progress ></progress> */}
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleImageUpload}>Upload Image</button>
        {uploadPrompt && <p>{uploadPrompt}</p>}
      </div>
    </>
  );
}
