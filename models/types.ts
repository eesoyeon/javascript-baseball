import { GameRecord } from "./interfaces";

// BallNumber 타입 선언
export type BallNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const ballNumberArray: BallNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// 2. 기록 저장을 위한 객체를 만들어줬습니다.
// GameRecord 인터페이스를 이용해서 초기화를 해줬습니다.
export const gameRecord: GameRecord = {
  results: [],
  totalGames: 0,
  userWins: 0,
  computerWins: 0,
};
