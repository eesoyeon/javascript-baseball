import * as readline from 'readline';

const inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// ---------------------------------------

// BallNumber 타입 선언
type BallNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// BallNumber로 이루어진 길이 3인 배열
type threeBallNumbers = [BallNumber, BallNumber, BallNumber];

const ballNumberArray: BallNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// 정답 맞히는 횟수 제한
const GAME_LIMIT = 10 as const;

// 길이 3
// const NUMBER_LENGTH = 3 as const;

// 전적
interface GameRecord {
    recordGameArray: string[]; // 게임 저장하는 배열 - 이기면 w, 지면 l 저장
    winNumber: number; // 게임 몇 판 이겼어?
    loseNumber: number; // 게임 몇 판 졌어?
}

interface Common {
    gameLimit: number; // 게임 제한 횟수
    submitCount: number; // 제출 횟수
}

// 컴퓨터
interface Computer extends Common {
    computerNumbers: BallNumber[];
    answer: string; // 컴퓨터의 답
}

// 사용자
interface User extends Common {
    userNumbers: BallNumber[];
}

// 게임 진행 상태
enum GameState {
    startGame = '1',
    endGame = '9',
}

// 게임 제출 횟수 입력받기
const getUserSubmitLimit = () => {
    return new Promise<Common>((resolve) =>
        inputInterface.question(
            '게임 제출 횟수를 입력해주세요: ',
            (userSubmitLimit) => {
                const submitCount = Number(userSubmitLimit);

                resolve({ gameLimit: GAME_LIMIT, submitCount });
            }
        )
    );
};

// user 숫자 입력받기 - 반환값이 [1, 1, 2] + 중복 제거/방지
const getUserInput = (submitCount: number): Promise<User> => {
    return new Promise<User>((resolve) =>
        inputInterface.question('숫자를 입력해주세요: ', (userInput) => {
            const userNumbers = userInput
                .split('')
                .map(Number) as threeBallNumbers;

            if (isValidUserInput) {
                resolve({
                    userNumbers,
                    gameLimit: GAME_LIMIT,
                    submitCount,
                });
            } else {
                console.log(
                    '잘못된 입력입니다. 중복되지 않은 3개의 숫자를 입력해주세요.'
                );
            }
        })
    );
};

// 사용자 입력 값 유효성 검사 - 길이 3, 중복 x, 0 포함 x
const isValidUserInput = (userNumbers: number[]) => {
    if (userNumbers.filter((number) => isNaN(number)).length !== 0)
        return false;

    return (
        userNumbers.length === 3 &&
        !userNumbers.includes(0) &&
        new Set(userNumbers).size === 3
    );
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

    // 3을 상수화 해야함 - 수정필요
    return shuffledArray.slice(0, 3);
};

/**
 * 볼이냐 ,스트라이크냐
 * @param computerNumbers
 * @param userNumber
 * @param userNumberIndex
 * @returns
 */
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

/**
 *  볼, 스트라이크 개수 세기
 * @param computerNumbers
 * @param userNumbers
 * @returns
 */
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

// 전적

// 통계

// 게임 시작
