import { GameRecord } from './interfaces';

export type BallNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const ballNumberArray: BallNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const gameRecord: GameRecord = {
   results: [],
   totalGames: 0,
   userWins: 0,
   computerWins: 0,
};
