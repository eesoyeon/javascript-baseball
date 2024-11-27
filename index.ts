import * as readline from 'readline';
import { User, Computer, GameRecord, GameResult } from './models/interfaces';
import { GameState } from './models/enums';
import { BallNumber, ballNumberArray, gameRecord } from './models/types';

const inputInterface = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

const MAX_GAME_LIMIT = 15 as const;
const THREE_NUMBER_LENGTH = 3 as const;

const getThreeRandomNumbers = (): BallNumber[] => {
   const shuffledArray = [...ballNumberArray].sort(() => Math.random() - 0.5);

   return shuffledArray.slice(0, THREE_NUMBER_LENGTH);
};

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
               resolve(getSubmitLimit());
            }
         }
      )
   );
};

const isValidSubmitLimit = (limit: number): boolean => {
   return limit >= 1 && limit <= MAX_GAME_LIMIT;
};

const getUserNumbers = (submitCount: number): Promise<BallNumber[]> => {
   return new Promise((resolve) =>
      inputInterface.question('숫자를 입력해주세요: ', (userInput) => {
         const userNumbers = userInput.split('').map(Number) as BallNumber[];

         if (isValidUserNumbers(userNumbers)) {
            resolve(userNumbers);
         } else {
            console.log(
               '잘못된 입력입니다. 중복되지 않은 1~9에서 3개의 숫자를 입력해주세요.\n'
            );
            resolve(getUserNumbers(submitCount));
         }
      })
   );
};

const isValidUserNumbers = (userNumbers: BallNumber[]): boolean => {
   const isAllBallNumbers = userNumbers.every((number) =>
      ballNumberArray.includes(number)
   );
   const isValidLength = userNumbers.length === THREE_NUMBER_LENGTH;
   const hasNoDuplicate = new Set(userNumbers).size === THREE_NUMBER_LENGTH;

   return isAllBallNumbers && isValidLength && hasNoDuplicate;
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

const formatDate = () => {
   const date = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
   });

   return date;
};

const recordGame = (
   winner: 'User' | 'Computer',
   attempts: number,
   startTime: string,
   gameLimit: number
) => {
   const result: GameResult = {
      id: gameRecord.totalGames + 1,
      startTime,
      endTime: formatDate(),
      gameLimit,
      attempts,
      winner,
   };

   gameRecord.results.push(result);
   gameRecord.totalGames++;

   if (winner === 'User') {
      gameRecord.userWins++;
   } else {
      gameRecord.computerWins++;
   }
};

const showRecords = (record: GameRecord) => {
   if (record.results.length === 0) {
      console.log('기록이 없습니다.\n');
   } else {
      const records = record.results.map((result) => {
         const id = `[${result.id}]`;
         const startTime = `시작 시간: ${result.startTime}`;
         const endTime = `종료 시간: ${result.endTime}`;
         const attempts = `시도 횟수: ${result.attempts}`;
         const winner = `승리자: ${result.winner}`;

         return [id, startTime, endTime, attempts, winner].join(' / ');
      });

      console.log([...records].join('\n'));
   }

   return initGame();
};

const getStatistics = (record: GameRecord) => {
   if (record.results.length === 0) {
      return null;
   }

   const gameLimits = record.results.map((result) => result.gameLimit);
   const minGameLimits = Math.min(...gameLimits);
   const maxGameLimits = Math.max(...gameLimits);
   const maxGameLimitIds = record.results
      .filter((result) => result.gameLimit === maxGameLimits)
      .map((result) => result.id);
   const minGameLimitIds = record.results
      .filter((result) => result.gameLimit === minGameLimits)
      .map((result) => result.id);

   const attempts = record.results.map((result) => result.attempts);
   const minAttempts = Math.min(...attempts);
   const maxAttempts = Math.max(...attempts);
   const avgAttempts = (
      attempts.reduce((sum, current) => sum + current, 0) / attempts.length
   ).toFixed(2);
   const maxAttemptsIds = record.results
      .filter((result) => result.attempts === maxAttempts)
      .map((result) => result.id);
   const minAttemptsIds = record.results
      .filter((result) => result.attempts === minAttempts)
      .map((result) => result.id);

   const computerWinsCount = record.computerWins;
   const userWinsCount = record.userWins;

   return {
      minGameLimits,
      maxGameLimits,
      minAttempts,
      maxAttempts,
      avgAttempts,
      computerWinsCount,
      userWinsCount,
      maxGameLimitIds,
      minGameLimitIds,
      maxAttemptsIds,
      minAttemptsIds,
   };
};

const showStatistics = (record: GameRecord) => {
   if (record.results.length === 0) {
      console.log('통계가 없습니다.\n');
   } else {
      const statistics = getStatistics(record);

      console.log(
         `게임 중 가장 적은 수의 제출 횟수 : ${statistics.minGameLimits}회 - [${statistics.minGameLimitIds}]`
      );
      console.log(
         `게임 중 가장 많은 수의 제출 횟수 : ${statistics.maxGameLimits}회 - [${statistics.maxGameLimitIds}]`
      );
      console.log(`가장 많이 적용된 승리/패배 횟수: ${statistics}회`); // 가장 많이 적용된 승리/패패 횟수: 5회 - [1] // 이건 뭔말인지 이해를 못했습니다..ㅜㅜ
      console.log(
         `게임 중 가장 적은 수의 시도 횟수 : ${statistics.minAttempts}회 - [${statistics.minAttemptsIds}]`
      );
      console.log(
         `게임 중 가장 많은 수의 시도 횟수 : ${statistics.maxAttempts}회 - [${statistics.maxAttemptsIds}]`
      );
      console.log(`시도 횟수의 평균 : ${statistics.avgAttempts}회`);
      console.log(`컴퓨터가 총 승리한 횟수: ${statistics.computerWinsCount}회`);
      console.log(`사용자가 총 승리한 횟수: ${statistics.userWinsCount}회`);
      console.log(`\n-------통계 종료-------\n`);
   }
   return initGame();
};

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
};
inputInterface.on('close', () => process.exit());

const startGame = async () => {
   const computer: Computer = {
      computerNumbers: getThreeRandomNumbers(),
      answer: '3스트라이크',
   };

   console.log('컴퓨터가 숫자를 뽑았습니다.\n');
   const gameLimit = await getSubmitLimit();
   const userNumbers = await getUserNumbers(0);
   const startTime = formatDate();

   playGame({ userNumbers, submitCount: 1 }, computer, gameLimit, startTime);
};

const playGame = (
   user: User,
   computer: Computer,
   gameLimit: number,
   startTime: string
) => {
   const hint = hintMessage(computer.computerNumbers, user.userNumbers);
   console.log(hint);

   if (hint === computer.answer) {
      console.log('\n3개의 숫자를 모두 맞히셨습니다.\n');
      console.log('사용자가 승리하였습니다.\n');
      console.log('-------게임 종료-------\n-------기록 종료-------\n');
      recordGame('User', user.submitCount, startTime, gameLimit);
      return initGame();
   }

   if (user.submitCount >= gameLimit) {
      console.log(
         '\n제한된 횟수를 모두 사용하였습니다. 컴퓨터가 승리합니다.\n'
      );
      console.log(`정답은 ${computer.computerNumbers.join('')}입니다.\n`);
      recordGame('Computer', user.submitCount, startTime, gameLimit);

      return initGame();
   }

   getUserNumbers(user.submitCount + 1).then((nextNumbers) => {
      playGame(
         { userNumbers: nextNumbers, submitCount: user.submitCount + 1 },
         computer,
         gameLimit,
         startTime
      );
   });
};

initGame();
