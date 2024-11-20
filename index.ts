import * as readline from 'readline';
import { User, Computer, GameRecord, GameResult } from './interfaces';
import { GameState } from './enums';
import { BallNumber, ballNumberArray } from './types';

const inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const GAME_LIMIT = 10 as const;
const NUMBER_LENGTH = 3 as const;

// 게임 제출 횟수 입력받기
const getUserSubmitLimit = async (): Promise<User> => {
    return new Promise<User>((resolve) =>
        inputInterface.question(
            '컴퓨터에게 몇 번을 도전할지 횟수를 입력해주세요.\n',
            async (userSubmitLimit) => {
                const submitCount = Number(userSubmitLimit);
                const { userNumbers } = await getUserInput(submitCount);

                resolve({ userNumbers, submitCount });
            }
        )
    );
};

// user 숫자 입력받기 - 반환값이 [1, 1, 2] + 중복 제거/방지
const getUserInput = (submitCount: number): Promise<User> => {
    return new Promise<User>((resolve) =>
        inputInterface.question('숫자를 입력해주세요: ', (userInput) => {
            const userNumbers = userInput.split('').map(Number);

            if (isValidUserInput(userNumbers)) {
                resolve({
                    userNumbers,
                    submitCount,
                });
            } else {
                console.log(
                    '잘못된 입력입니다. 중복되지 않은 3개의 숫자를 입력해주세요.'
                );
            }
            // submitCount--;
        })
    );
};

// 사용자 입력 값 유효성 검사 - 길이 3, 중복 x, 0 포함 x
const isValidUserInput = (
    userNumbers: number[]
): userNumbers is BallNumber[] => {
    const isAllBallNumbers = userNumbers.every((number) =>
        ballNumberArray.includes(number as BallNumber)
    );
    const isValidLength = userNumbers.length === NUMBER_LENGTH;
    const hasNoDuplicate = new Set(userNumbers).size === NUMBER_LENGTH;

    return isAllBallNumbers && isValidLength && hasNoDuplicate;
};

// 제출 횟수 유효성 검사
const isValidSubmitLimit = (submitCount: number): boolean => {
    if (submitCount > GAME_LIMIT) {
        console.log('잘못된 입력입니다. 제출 횟수는 10번 이하여야 합니다.');
        return false;
    }
    return true;
};

// 컴퓨터가 뽑은 세자리 랜덤 숫자
const getThreeRandomNumbers = (ballNumberArray: BallNumber[]) => {
    const shuffledArray = ballNumberArray.sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, NUMBER_LENGTH);
};

const isBall = (
    computerNumbers: BallNumber[],
    userNumber: BallNumber,
    userNumberIndex: number
) => {
    return (
        computerNumbers.indexOf(userNumber) !== userNumberIndex &&
        computerNumbers.includes(userNumber)
    );
};

const isStrike = (
    computerNumbers: BallNumber[],
    userNumber: BallNumber,
    userNumberIndex: number
) => {
    return computerNumbers.indexOf(userNumber) === userNumberIndex;
};

const ballCount = (
    computerNumbers: BallNumber[],
    userNumbers: BallNumber[]
) => {
    return userNumbers.filter((userNumber, userNumberIndex) =>
        isBall(computerNumbers, userNumber, userNumberIndex)
    ).length;
};

const strikeCount = (
    computerNumbers: BallNumber[],
    userNumbers: BallNumber[]
) => {
    return userNumbers.filter((userNumber, userNumberIndex) =>
        isStrike(computerNumbers, userNumber, userNumberIndex)
    ).length;
};

// 힌트 출력
const hintMessage = (
    computerNumbers: BallNumber[],
    userNumbers: BallNumber[]
) => {
    const ballNumber = ballCount(computerNumbers, userNumbers);
    const strikeNumber = strikeCount(computerNumbers, userNumbers);

    if (strikeNumber === 0 && ballNumber === 0) {
        return '낫싱';
    } else if (strikeNumber === 0 && ballNumber !== 0) {
        return `${ballNumber}볼`;
    } else if (strikeNumber !== 0 && ballNumber === 0) {
        return `${strikeNumber}스트라이크`;
    } else {
        return `${ballNumber}볼 ${strikeNumber}스트라이크`;
    }
};

// 기록
// [1] / 시작시간: 2024. 04. 07 23:12 / 종료시간: 2024. 04. 07 23:13 / 횟수: 5 / 승리자: 사용자1
const showGameRecords = () => {};

// 통계
// 가장 적은 횟수: 5회 - [1]
// 가장 많은 횟수: 5회 - [1]
// 가장 많이 적용된 승리/패패 횟수: 5회 - [1]
// 가장 큰 값으로 적용된 승리/패패 횟수: 5회 - [1]
// 가장 적은 값으로 적용된 승리/패패 횟수: 5회 - [1]
// 적용된 승리/패패 횟수 평균: 5회
// 컴퓨터가 가장 많이 승리한 승리/패패 횟수: 0회
// 사용자가 가장 많이 승리한 승리/패패 횟수: 5회
const showGameStatistics = () => {};

// 게임 시작 함수
const startGame = async () => {
    const computerNumbers = getThreeRandomNumbers(ballNumberArray);
    const user = await getUserSubmitLimit(); // 사용자 숫자, 제출 횟수 (user.userNumbers, user.submitCount)

    let attempts = 0;
    while (attempts < user.submitCount) {
        const userInput = await getUserInput(user.submitCount - attempts);
        const hint = hintMessage(computerNumbers, userInput.userNumbers);

        console.log(hint);
        if (hint === '3스트라이크') {
            console.log('3개의 숫자를 모두 맞히셨습니다.\n');
            console.log('사용자가 승리하였습니다.\n-------게임 종료-------');
            break;
        }
        attempts++;
    }

    console.log('제한된 횟수를 모두 사용하여, 컴퓨터가 승리하였습니다.');
    initGame();
};

// 게임 상태 설정
const initGame = () => {
    inputInterface.question(
        '게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요.\n',
        (input) => {
            switch (input) {
                case GameState.startGame: // 1
                    // 게임 시작하는 함수
                    startGame();
                    break;
                case GameState.showGameRecords: // 2
                    // 기록 보여주는 함수
                    break;
                case GameState.showGameStatistics: // 3
                    // 통계 보여주는 함수
                    break;
                case GameState.endGame: // 9
                    console.log('애플리케이션이 종료되었습니다.');
                    inputInterface.close();
                    break;
                default:
                    console.log('잘못된 입력입니다. 다시 입력해주세요.');
                    break;
            }
        }
    );
    inputInterface.on('close', function () {
        process.exit();
    });
};
