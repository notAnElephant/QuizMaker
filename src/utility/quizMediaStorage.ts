import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firebaseAuth, firebaseStorage } from "../firebase";
import type { AnswerMediaType } from "../models/Question";

export const MAX_QUIZ_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_QUIZ_AUDIO_SIZE = 25 * 1024 * 1024;
export const MAX_QUIZ_VIDEO_SIZE = 100 * 1024 * 1024;

const mediaLimits: Record<AnswerMediaType, number> = {
  image: MAX_QUIZ_IMAGE_SIZE,
  audio: MAX_QUIZ_AUDIO_SIZE,
  video: MAX_QUIZ_VIDEO_SIZE,
};

const mediaLimitLabels: Record<AnswerMediaType, string> = {
  image: "5 MB",
  audio: "25 MB",
  video: "100 MB",
};

export type UploadedQuizBackground = {
  name: string;
  objectPath: string;
  url: string;
};

export const canUseQuizMediaStorage = Boolean(firebaseStorage && firebaseAuth);

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension?.match(/^[a-z0-9]+$/) ? extension : "img";
}

export function getQuizMediaType(file: File): AnswerMediaType {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";

  throw new Error(
    `${file.name}: csak kép-, hang- vagy videófájl tölthető fel.`,
  );
}

export async function uploadQuizMedia(file: File) {
  const type = getQuizMediaType(file);
  if (file.size > mediaLimits[type]) {
    throw new Error(
      `${file.name}: a fájl legfeljebb ${mediaLimitLabels[type]} lehet.`,
    );
  }
  if (!firebaseStorage || !firebaseAuth?.currentUser) {
    throw new Error("A médiafeltöltéshez jelentkezz be a Firebase-fiókoddal.");
  }

  const objectPath = `quiz-media/${firebaseAuth.currentUser.uid}/${crypto.randomUUID()}.${getFileExtension(file)}`;
  const objectReference = ref(firebaseStorage, objectPath);
  const snapshot = await uploadBytes(objectReference, file, {
    contentType: file.type,
    customMetadata: { originalName: file.name },
  });

  return {
    objectPath,
    type,
    url: await getDownloadURL(snapshot.ref),
  };
}

export async function deleteUploadedQuizMedia(objectPath: string) {
  if (!firebaseStorage) return;
  await deleteObject(ref(firebaseStorage, objectPath));
}

function getAuthenticatedBackgroundFolder() {
  if (!firebaseStorage || !firebaseAuth?.currentUser) {
    throw new Error("A háttérképek kezeléséhez jelentkezz be.");
  }

  return `quiz-backgrounds/${firebaseAuth.currentUser.uid}`;
}

export async function listQuizBackgrounds(): Promise<UploadedQuizBackground[]> {
  const folder = getAuthenticatedBackgroundFolder();
  const result = await listAll(ref(firebaseStorage!, folder));

  return Promise.all(
    result.items.map(async (item) => ({
      name: item.name,
      objectPath: item.fullPath,
      url: await getDownloadURL(item),
    })),
  );
}

export async function uploadQuizBackground(
  file: File,
): Promise<UploadedQuizBackground> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Csak képfájl tölthető fel háttérként.");
  }
  if (file.size > MAX_QUIZ_IMAGE_SIZE) {
    throw new Error(`${file.name}: a fájl legfeljebb 5 MB lehet.`);
  }

  const folder = getAuthenticatedBackgroundFolder();
  const objectPath = `${folder}/${crypto.randomUUID()}.${getFileExtension(file)}`;
  const objectReference = ref(firebaseStorage!, objectPath);
  const snapshot = await uploadBytes(objectReference, file, {
    contentType: file.type,
    customMetadata: { originalName: file.name },
  });

  return {
    name: file.name,
    objectPath,
    url: await getDownloadURL(snapshot.ref),
  };
}

export async function deleteQuizBackground(objectPath: string) {
  const folder = getAuthenticatedBackgroundFolder();
  if (!objectPath.startsWith(`${folder}/`)) {
    throw new Error("Csak a saját háttérképed törölhető.");
  }

  await deleteObject(ref(firebaseStorage!, objectPath));
}
