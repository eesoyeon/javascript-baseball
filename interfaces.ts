import { BallNumber } from './types';

// 컴퓨터
export interface Computer {
    computerNumbers: BallNumber[];
    answer: string; // 컴퓨터의 답
}

// 사용자
export interface User {
    userNumbers: BallNumber[];
    submitCount: number; // 제출 횟수
}

// 전적
export interface GameRecord {
    // recordGameArray: string[]; // 게임 저장하는 배열 - 이기면 w, 지면 l 저장
    // winNumber: number; // 게임 몇 판 이겼어?
    // loseNumber: number; // 게임 몇 판 졌어?

    results: GameResult[];
    totalGames: number; // 총 게임 수
    userWins: number;
    computerWins: number;
}

export interface GameResult {
    id: number; // [1]
    startTime: string; // 시작 시간
    endTime: string; // 종료 시간
    gameLimit: number; // 게임 제한 횟수
    attemps: number; // 시도 횟수
    winner: 'User' | 'Computer';

    // userWins: number;
    // computerWins: number;
}
