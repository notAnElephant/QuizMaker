export type QuestionType = 'text' | 'image' | 'video' | 'audio';

export class Question {
    constructor(
        public type: QuestionType,
        public content: string,
        public source?: string, //for the image, video, or audio source
        public points: number = 1000,
        public isUsed: boolean = false,
        public list?: string[] // optional list of choices
    ) {}

    markUsed() {
        this.isUsed = true;
    }
}
