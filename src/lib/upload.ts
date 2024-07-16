import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

const upload = async (
  file: File,
  fileName: string,
  location: string
): Promise<string> => {
  const storageRef = ref(storage, `${location}/` + fileName);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            reject("Unauthorized");
            break;
          case "storage/canceled":
            // User canceled the upload
            reject("Canceled");
            break;

          // ...

          case "storage/unknown":
            reject("something went wrong!" + error.code);
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default upload;
