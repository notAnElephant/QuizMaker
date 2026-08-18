import { QuizAppearance } from "../context/types";

export const defaultBackgroundUrl =
  "https://firebasestorage.googleapis.com/v0/b/mok-wiki.firebasestorage.app/o/app-assets%2Fdefault-background.png?alt=media&token=26b88aa3-f4dc-4743-986b-3a6c4bf8eb6d";

export const defaultQuizAppearance: QuizAppearance = {
  backgroundMode: "preset",
  backgroundPreset: "default",
  textColor: "#24211c",
};

export const backgroundPresets: Record<
  QuizAppearance["backgroundPreset"],
  { background: string; label: string; suggestedTextColor: string }
> = {
  default: {
    background: `url("${defaultBackgroundUrl}")`,
    label: "Alap",
    suggestedTextColor: "#24211c",
  },
  sunset: {
    background:
      "linear-gradient(135deg, #4a1942 0%, #893168 40%, #ff784f 100%)",
    label: "Naplemente",
    suggestedTextColor: "#fffaf0",
  },
  forest: {
    background:
      "linear-gradient(135deg, #0f3d2e 0%, #174f3b 35%, #2f6f4f 100%)",
    label: "Erdő",
    suggestedTextColor: "#fffaf0",
  },
  ocean: {
    background:
      "linear-gradient(135deg, #0b2545 0%, #134074 40%, #3f88c5 100%)",
    label: "Óceán",
    suggestedTextColor: "#fffaf0",
  },
};

export function getQuizBackground(appearance: QuizAppearance) {
  if (appearance.backgroundMode === "image" && appearance.backgroundImage) {
    return `url("${appearance.backgroundImage}")`;
  }

  return backgroundPresets[appearance.backgroundPreset].background;
}

export function getSuggestedTextColor(appearance: QuizAppearance) {
  return backgroundPresets[appearance.backgroundPreset].suggestedTextColor;
}

export async function suggestTextColorForImage(imageData: string) {
  return new Promise<string>((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const sampleSize = 32;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (!context) {
          resolve("#24211c");
          return;
        }

        context.drawImage(image, 0, 0, sampleSize, sampleSize);
        const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
        let luminance = 0;

        for (let index = 0; index < pixels.length; index += 4) {
          luminance +=
            0.2126 * pixels[index] +
            0.7152 * pixels[index + 1] +
            0.0722 * pixels[index + 2];
        }

        const averageLuminance = luminance / (pixels.length / 4);
        resolve(averageLuminance > 145 ? "#24211c" : "#fffaf0");
      } catch {
        resolve("#24211c");
      }
    };
    image.onerror = () => resolve("#24211c");
    image.src = imageData;
  });
}
