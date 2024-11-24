import { BallNumber } from './types';

export interface Computer {
   computerNumbers: BallNumber[];
   answer: string;
}

export interface User {
   userNumbers: BallNumber[];
   submitCount: number;
}

export interface GameRecord {
   results: GameResult[];
   totalGames: number;
   userWins: number;
   computerWins: number;
}

export interface GameResult {
   id: number;
   startTime: string;
   endTime: string;
   gameLimit: number;
   attempts: number;
   winner: 'User' | 'Computer';
}
