type Question = {
    question: string;
    answer: boolean;
}

export type GameData = {
    gameOver: boolean;
    won: boolean;
    questions: Question[];
};