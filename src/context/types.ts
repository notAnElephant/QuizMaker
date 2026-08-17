import { Question } from "../models/Question";

export type Team = {
  name: string;
  members: string[];
  color: string;
  points: number;
};

export type Category = {
  category: string;
  questions: Question[];
};

export type QuizAppearance = {
  backgroundImage?: string;
  backgroundMode: "preset" | "image";
  backgroundPreset: "default" | "sunset" | "forest" | "ocean";
  textColor: string;
};

export type Settings = {
  classicMode: boolean;
  timerEnabled: boolean;
  timerDuration: number;
};
