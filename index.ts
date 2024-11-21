import * as readline from 'readline';
import { User, Computer, GameRecord, GameResult } from './interfaces';
import { GameState } from './enums';
import { BallNumber, ballNumberArray } from './types';

const inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 1. 변수명에 max, three를 추가했씁니다!
// 10번은 조금 적은것 같아 제출 횟수도 15로 늘려줬습니다..!
const MAX_GAME_LIMIT = 15 as const;
const THREE_NUMBER_LENGTH = 3 as const;

// 2. 기록 저장을 위한 객체를 만들어줬습니다.
// GameRecord 인터페이스를 이용해서 초기화를 해줬습니다.
const gameRecord: GameRecord = {
    results: [],
    totalGames: 0,
    userWins: 0,
    computerWins: 0,
};

// 3. input 이름을 state로 바꿔줬고, GameState 타입 지정을 해줬습니다
// (input) => (state: GameState)
const initGame = () => {
    inputInterface.question(
        '게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요.\n',
        (state: GameState) => {
            switch (state) {
                case GameState.startGame: // 1
                    startGame();
                    break;
                case GameState.showGameRecords: // 2
                    showRecords(gameRecord);
                    break;
                case GameState.showGameStatistics: // 3
                    showStatistics(gameRecord);
                    break;
                case GameState.endGame: // 9
                    console.log('애플리케이션이 종료되었습니다.\n');
                    inputInterface.close();
                    break;
                default:
                    console.log('잘못된 입력입니다. 다시 입력해주세요.\n');
                    initGame();
                    break;
            }
        }
    );
    inputInterface.on('close', () => process.exit());
};

// 4. 컴퓨터 숫자, 사용자가 입력한 제한 횟수와 숫자, 게임 시작 시간을 받아서 playGame() 함수로 넘겨줬씁니다.
// 사용자 입력값은 비동기로 받기 위해 await을 붙여줬습니다!
const startGame = async () => {
    // 컴퓨터 객체에 컴퓨터가 뽑은 숫자랑 정답을 저장
    const computer: Computer = {
        computerNumbers: getThreeRandomNumbers(),
        answer: '3스트라이크',
    };

    console.log('컴퓨터가 숫자를 뽑았습니다.\n');
    const gameLimit = await getSubmitLimit(); // 게임 제한 횟수
    const userNumbers = await getUserNumbers(0); // submitCount의 초기값은 0으로 해서 사용자 숫자 입력받음
    const startTime = new Date().toISOString(); // 게임 시작 시간

    // { userNumbers, submitCount: 1 } 이건 user 객체로 넘겨주는 겁니다!
    playGame({ userNumbers, submitCount: 1 }, computer, gameLimit, startTime);
};

// 5. 사용자가 입력한 제출 횟수를 이용해서 게임 진행시키는 함수
const playGame = (
    user: User,
    computer: Computer,
    gameLimit: number,
    startTime: string
) => {
    // 사용자가 제출한 횟수가 제한 횟수를 넘어가면,
    // Computer가 이겼다고 기록을 저장하고
    // 초기 상태 설정인 initGame()으로 돌아가게 합니다.
    if (user.submitCount >= gameLimit) {
        console.log(
            '\n제한된 횟수를 모두 사용하였습니다. 컴퓨터가 승리합니다.\n'
        );
        recordGame('Computer', user.submitCount, startTime, gameLimit);
        return initGame();
    }

    const hint = hintMessage(computer.computerNumbers, user.userNumbers);
    console.log(hint);

    // 힌트가 컴퓨터 객체의 정답과 같다면,
    // User가 이겼다고 기록을 저장하고
    // 초기 상태 설정인 initGame()으로 돌아가게 합니다.
    if (hint === computer.answer) {
        console.log('\n3개의 숫자를 모두 맞히셨습니다.\n');
        console.log('사용자가 승리하였습니다.\n');
        console.log('-------게임 종료-------\n-------기록 종료-------\n');
        recordGame('User', user.submitCount, startTime, gameLimit);
        return initGame();
    }

    // 사용자 숫자 입력받는 함수의 매개변수에,
    // submitCount를 하나씩 증가시켜서 playGame()을 실행시킵니다.
    // 이 부분은 재귀로 했슴다ㅜ
    getUserNumbers(user.submitCount + 1).then((nextNumbers) => {
        playGame(
            { userNumbers: nextNumbers, submitCount: user.submitCount + 1 },
            computer,
            gameLimit,
            startTime
        );
    });
};

const getThreeRandomNumbers = (): BallNumber[] => {
    const shuffledArray = [...ballNumberArray].sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, THREE_NUMBER_LENGTH);
};

// 6. 게임 제한 횟수 입력받기
// 비동기 타입이 <User>일 이유가 없을것 같아서
// 제한 횟수만 받기 위해 Promise<number>로 바꿔줬습니다.
// 반환값은 limit 입니다
const getSubmitLimit = async (): Promise<number> => {
    return new Promise((resolve) =>
        inputInterface.question(
            '컴퓨터에게 몇 번을 도전할지 횟수를 입력해주세요. (1~15)\n',
            (limitInput) => {
                const limit = Number(limitInput);

                if (isValidSubmitLimit(limit)) {
                    resolve(limit);
                } else {
                    console.log(
                        '잘못된 입력입니다. 제출 횟수는 1~15 사이의 숫자여야 합니다.\n'
                    );
                    resolve(getSubmitLimit()); // 입력값이 잘못되면 getSubmitLimit() 함수를 다시 실행하도록 했습니다.
                }
            }
        )
    );
};

// 7. user 숫자 입력받기
// 여기도 비동기 타입을 <User> 말고 <BallNumber[]>로 지정해줬습니다!
// 반환값은 userNumbers 입니다
const getUserNumbers = (submitCount: number): Promise<BallNumber[]> => {
    return new Promise((resolve) =>
        inputInterface.question('숫자를 입력해주세요: ', (userInput) => {
            const userNumbers = userInput.split('').map(Number) as BallNumber[]; //  여기는 에러가 발생해서,, as BallNumber[]로 타입 단언을 해줬습니다.

            if (isValidUserNumbers(userNumbers)) {
                resolve(userNumbers);
            } else {
                console.log(
                    '잘못된 입력입니다. 중복되지 않은 1~9에서 3개의 숫자를 입력해주세요.\n'
                );
                resolve(getUserNumbers(submitCount)); // 입력값이 잘못되면 getUserNumbers() 함수를 다시 실행하도록 했습니다.
            }
        })
    );
};

// 사용자 입력 숫자 유효성 검사
const isValidUserNumbers = (userNumbers: BallNumber[]): boolean => {
    const isAllBallNumbers = userNumbers.every((number) =>
        ballNumberArray.includes(number)
    );
    const isValidLength = userNumbers.length === THREE_NUMBER_LENGTH;
    const hasNoDuplicate = new Set(userNumbers).size === THREE_NUMBER_LENGTH;

    return isAllBallNumbers && isValidLength && hasNoDuplicate;
};

// 제출 횟수 유효성 검사
const isValidSubmitLimit = (limit: number): boolean => {
    return limit >= 1 && limit <= MAX_GAME_LIMIT;
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

// 8. 기록 저장 함수
// 매개변수로 승리자, 시도횟수, 시작시간, 제한횟수를 받습니다.
const recordGame = (
    winner: 'User' | 'Computer',
    attempts: number,
    startTime: string,
    gameLimit: number
) => {
    // result 객체를 초기화해줍니다
    const result: GameResult = {
        id: gameRecord.totalGames + 1, // id는 총 게임수에서 1을 더한 값입니다
        startTime, // 위에서 playGame()에서 가져온 시작 시간입니다
        endTime: new Date().toISOString(), // 기록 저장할때가 종료 시간이므로 이때 시간 저장을 해줍니다.
        gameLimit,
        attempts,
        winner,
    };

    // 위에서 선언한 gameRecord 객체의 results에, result를 넣어줍니다
    gameRecord.results.push(result);
    gameRecord.totalGames++; // 기록을 저장하면 총 게임 수가 증가합니다

    // 승리자에 따라 userWins, computerWins도 증가시켜줍니다.
    if (winner === 'User') {
        gameRecord.userWins++;
    } else {
        gameRecord.computerWins++;
    }
};

// 9. 기록 보여주는 함수
// 위에서 선언한 gameRecord가 매개변수로 들어옵니다.
const showRecords = (record: GameRecord) => {
    if (record.results.length === 0) {
        // 기록이 없을때
        console.log('기록이 없습니다.\n');
    } else {
        // 기록이 있을때
        record.results.forEach((result) => {
            const id = `[${result.id}]`;
            const startTime = `시작 시간: ${result.startTime}`;
            const endTime = `종료 시간: ${result.endTime}`;
            const attempts = `횟수: ${result.attempts}`;
            const winner = `승리자: ${result.winner}`;

            // [1] / 시작시간: 2024. 04. 07 23:12 / 종료시간: 2024. 04. 07 23:13 / 횟수: 5 / 승리자: 사용자
            console.log(
                `${id} / ${startTime} / ${endTime} / ${attempts} / ${winner}\n`
            );
        });
    }
    return initGame();
};

// 10. 통계 계산 함수
// 위에서 선언한 gameRecord가 매개변수로 들어옵니다.
const getStatistics = (record: GameRecord) => {
    if (record.results.length === 0) {
        return null;
    }
    // 게임 제한 횟수 최대, 최소 구하기
    const gameLimits = record.results.map((result) => result.gameLimit);
    const minGameLimits = Math.min(...gameLimits);
    const maxGameLimits = Math.max(...gameLimits);

    // 게임 시도 횟수 최대, 최소, 평균 구하기
    const attempts = record.results.map((result) => result.attempts);
    const minAttempts = Math.min(...attempts);
    const maxAttempts = Math.max(...attempts);
    const avgAttempts =
        attempts.reduce((sum, current) => sum + current, 0) / attempts.length;

    return {
        minGameLimits,
        maxGameLimits,
        minAttempts,
        maxAttempts,
        avgAttempts,
    };
};

// 11. 통계 보여주는 함수
// 통계를 보여주고 initGame()으로 돌아가게 해줬습니다.
const showStatistics = (record: GameRecord) => {
    if (record.results.length === 0) {
        console.log('통계가 없습니다.\n');
    } else {
        const statistics = getStatistics(record);

        // 가장 적은 횟수: 5회 - [1]
        // 가장 많은 횟수: 5회 - [1]
        // 가장 많이 적용된 승리/패패 횟수: 5회 - [1] // 이건 뭔말인지 이해를 못했습니다..ㅜㅜ
        // 가장 큰 값으로 적용된 승리/패패 횟수: 5회 - [1] // 빈도수?
        // 가장 적은 값으로 적용된 승리/패패 횟수: 5회 - [1]
        // 적용된 승리/패패 횟수 평균: 5회
        // 컴퓨터가 가장 많이 승리한 승리/패패 횟수: 0회 // 이것도..
        // 사용자가 가장 많이 승리한 승리/패패 횟수: 5회 // 이것도..
        console.log(`가장 적은 횟수: ${statistics.minGameLimits}회`);
        console.log(`가장 많은 횟수: ${statistics.maxGameLimits}회`);
        console.log(`가장 많이 적용된 승리/패배 횟수: ${statistics}회`);
        console.log(
            `가장 큰 값으로 적용된 승리/패배 횟수: ${statistics.maxAttempts}회`
        );
        console.log(
            `가장 적은 값으로 적용된 승리/패배 횟수: ${statistics.minAttempts}회`
        );
        console.log(`적용된 승리/패패 횟수 평균: ${statistics.avgAttempts}회`);
        console.log(
            `컴퓨터가 가장 많이 승리한 승리/패배 횟수: ${statistics}회`
        );
        console.log(
            `사용자가 가장 많이 승리한 승리/패배 횟수: ${statistics}회`
        );
        console.log(`-------통계 종료-------\n`);
    }
    return initGame();
};

initGame();
