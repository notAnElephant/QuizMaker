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

export type Settings = {
  backgroundImage?: string;
  backgroundMode: "preset" | "image";
  backgroundPreset: "default" | "sunset" | "forest" | "ocean";
  classicMode: boolean;
  timerEnabled: boolean;
  timerDuration: number;
};
