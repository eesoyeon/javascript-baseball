import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 서로 다른 세자리 수 생성 함수
function generateThreeUniqueDigits(): number[] {
    const uniqueDigits = new Set<number>();

    while (uniqueDigits.size < 3) {
        const number = Math.floor(Math.random() * 9) + 1;
        uniqueDigits.add(number);
    }
    return Array.from(uniqueDigits);
}

// 스트라이크, 볼 개수 계산 함수
function calculateStrikeOrBall(
    computerNumbers: number[],
    userNumbers: number[]
): number[] {
    let countStrike = 0;
    let countBall = 0;

    let digit = 0;
    while (digit < 3) {
        if (computerNumbers[digit] === userNumbers[digit]) {
            countStrike++;
        } else if (computerNumbers.includes(userNumbers[digit])) {
            countBall++;
        }
        digit++;
    }

    return [countStrike, countBall];
}

// 힌트 문자열 반환
function getHintMessage(
    computerNumbers: number[],
    userNumbers: number[]
): string {
    const [countStrike, countBall] = calculateStrikeOrBall(
        computerNumbers,
        userNumbers
    );

    if (countStrike === 0 && countBall === 0) {
        return '낫싱';
    } else if (countBall !== 0) {
        return `${countBall}볼`;
    } else if (countStrike !== 0) {
        return `${countStrike}스트라이크`;
    } else {
        return `${countBall}볼 ${countStrike}스트라이크`;
    }
}

// 게임 시작
async function startGame(): Promise<void> {
    const computerNumbers = generateThreeUniqueDigits();
    console.log('컴퓨터가 숫자를 뽑았습니다.\n');

    while (true) {
        const userNumbers = await getUserInput();

        if (!isValidUserNumbers(userNumbers)) {
            console.log(
                '1~9까지의 숫자 중에서 서로 다른 세자리 수를 입력하세요.'
            );
            continue;
        }

        const hint = getHintMessage(computerNumbers, userNumbers);
        console.log(hint);

        if (hint === '3스트라이크') {
            winGame();
            break;
        }
    }
}

// 사용자 입력값 받는 함수
function getUserInput(): Promise<number[]> {
    return new Promise<number[]>((resolve) =>
        rl.question('숫자를 입력해주세요: ', (userInput) =>
            resolve(userInput.split('').map(Number))
        )
    );
}

// 모두 맞췄을 때 출력하는 함수
function winGame(): void {
    console.log('\n3개의 숫자를 모두 맞히셨습니다.');
    console.log('-------게임 종료-------\n');
}

// 사용자 입력값 유효성 검사
function isValidUserNumbers(userNumbers: number[]): boolean {
    const userInputLength = userNumbers.length;
    const includeZero = userNumbers.includes(0);
    const countUniqueNumber = new Set(userNumbers).size;

    return userInputLength === 3 && !includeZero && countUniqueNumber === 3;
}

// 애플리케이션 실행
async function startApplication(): Promise<void> {
    let isRunning = true;

    while (isRunning) {
        const input = await new Promise<string>((resolve) =>
            rl.question(
                '게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n',
                resolve
            )
        );

        isRunning = await startOrEndGame(input);
    }
}

// 게임 시작 or 종료
async function startOrEndGame(input: string): Promise<boolean> {
    if (input === '1') {
        await startGame();
    } else if (input === '9') {
        endGame();
        return false;
    } else {
        console.log('잘못된 입력입니다. 1 또는 9를 입력해주세요.\n');
    }
    return true;
}

// 애플리케이션 종료
function endGame(): void {
    console.log('\n애플리케이션이 종료되었습니다.');
    rl.close();
}

startApplication();
