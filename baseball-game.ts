window.onload = function () {
    const userInput = <HTMLInputElement>document.querySelector('.user-input');
    const hintOutput = <HTMLDivElement>document.querySelector('.hint-output');
    const resultOutput = <HTMLParagraphElement>(
        document.querySelector('.result-output')
    );

    const userGuess = <HTMLInputElement>document.querySelector('.user-guess');
    const goBtn = <HTMLButtonElement>document.querySelector('.go-btn');

    let computerNumbers = generateThreeUniqueDigits();
    let gameOver = false;

    let guessCount = 1;
    let hintCount = 1;
    let restartBtn: HTMLButtonElement | null = null;

    goBtn.addEventListener('click', handleUserInput);

    function handleUserInput(): void {
        const input = userInput.value;
        const userNumbers = input.split('').map(Number);

        if (!validateUserNumbers(userNumbers)) {
            alert('1~9까지의 서로 다른 세자리 수를 입력하세요');
            userInput.value = '';
            return;
        }

        if (guessCount === 1) {
            userGuess.textContent = 'Your Number: ';
        }

        if (hintCount === 1) {
            hintOutput.textContent = 'Hint: ';
        }

        userGuess.textContent = `${userGuess.textContent} ${input}`;
        guessCount++;
        userInput.value = '';
        userInput.focus();

        const hint = calculateStrikeOrBall(computerNumbers, userNumbers);
        hintOutput.textContent = `${hintOutput.textContent} ${hint}`;
        hintCount++;

        if (hint === '3스트라이크') {
            resultOutput.textContent = `정답입니다 👍`;
            gameOver = true;
            setGameOver();
        }
    }

    function setGameOver(): void {
        if (!restartBtn) {
            restartBtn = document.createElement('button');
            restartBtn.textContent = 'Start New Game';

            if (resultOutput) {
                resultOutput.after(restartBtn);
            }

            restartBtn.classList.add('restart-btn');

            restartBtn.addEventListener('click', resetGame);
        }

        userInput.disabled = true;
    }

    function resetGame(): void {
        if (!gameOver) return;

        computerNumbers = generateThreeUniqueDigits();
        resultOutput.textContent = '';
        hintOutput.textContent = '';
        userInput.value = '';
        userGuess.textContent = '';
        guessCount = 1;
        hintCount = 1;
        gameOver = false;
        userInput.disabled = false;

        if (restartBtn) {
            restartBtn.remove();
            restartBtn = null;
        }
    }

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
    ): string {
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

        const hint = hintMessage(countStrike, countBall);
        return hint;
    }

    // 힌트 문자열 반환
    function hintMessage(countStrike: number, countBall: number): string {
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

    // 사용자 입력값 유효성 검사
    function validateUserNumbers(userNumbers: number[]): boolean {
        const userInputLength = userNumbers.length;
        const includeZero = userNumbers.includes(0);
        const countUniqueNumber = new Set(userNumbers).size;

        return userInputLength === 3 && !includeZero && countUniqueNumber === 3;
    }
};
