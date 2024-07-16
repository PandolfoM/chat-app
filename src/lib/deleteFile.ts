import { deleteObject, ref } from "firebase/storage";
import { storage } from "../firebase";

const deleteFile = async (location: string, fileName: string) => {
  const storageRef = ref(storage, `${location}/` + fileName);
  await deleteObject(storageRef);
};

export default deleteFile;
