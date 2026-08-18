import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseAuth, firebaseStorage } from "../firebase";

export const MAX_QUIZ_IMAGE_SIZE = 5 * 1024 * 1024;

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension?.match(/^[a-z0-9]+$/) ? extension : "img";
}

export async function uploadQuizImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Csak képfájl tölthető fel.");
  }
  if (file.size > MAX_QUIZ_IMAGE_SIZE) {
    throw new Error("A kép legfeljebb 5 MB lehet.");
  }
  if (!firebaseStorage || !firebaseAuth?.currentUser) {
    throw new Error("A képfeltöltéshez jelentkezz be a Firebase-fiókoddal.");
  }

  const objectPath = `quiz-media/${firebaseAuth.currentUser.uid}/${crypto.randomUUID()}.${getFileExtension(file)}`;
  const objectReference = ref(firebaseStorage, objectPath);
  const snapshot = await uploadBytes(objectReference, file, {
    contentType: file.type,
    customMetadata: { originalName: file.name },
  });

  return getDownloadURL(snapshot.ref);
}
