window.onload = function () {
    var userInput = document.querySelector('.user-input');
    var hintOutput = document.querySelector('.hint-output');
    var resultOutput = (document.querySelector('.result-output'));
    var userGuess = document.querySelector('.user-guess');
    var goBtn = document.querySelector('.go-btn');
    var computerNumbers = generateThreeUniqueDigits();
    var gameOver = false;
    var guessCount = 1;
    var hintCount = 1;
    var restartBtn = null;
    goBtn.addEventListener('click', handleUserInput);
    function handleUserInput() {
        var input = userInput.value;
        var userNumbers = input.split('').map(Number);
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
        userGuess.textContent = "".concat(userGuess.textContent, " ").concat(input);
        guessCount++;
        userInput.value = '';
        userInput.focus();
        var hint = calculateStrikeOrBall(computerNumbers, userNumbers);
        hintOutput.textContent = "".concat(hintOutput.textContent, " ").concat(hint);
        hintCount++;
        if (hint === '3스트라이크') {
            resultOutput.textContent = "\uC815\uB2F5\uC785\uB2C8\uB2E4 \uD83D\uDC4D";
            gameOver = true;
            setGameOver();
        }
    }
    function setGameOver() {
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
    function resetGame() {
        if (!gameOver)
            return;
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
    function generateThreeUniqueDigits() {
        var uniqueDigits = new Set();
        while (uniqueDigits.size < 3) {
            var number = Math.floor(Math.random() * 9) + 1;
            uniqueDigits.add(number);
        }
        return Array.from(uniqueDigits);
    }
    // 스트라이크, 볼 개수 계산 함수
    function calculateStrikeOrBall(computerNumbers, userNumbers) {
        var countStrike = 0;
        var countBall = 0;
        var digit = 0;
        while (digit < 3) {
            if (computerNumbers[digit] === userNumbers[digit]) {
                countStrike++;
            }
            else if (computerNumbers.includes(userNumbers[digit])) {
                countBall++;
            }
            digit++;
        }
        var hint = hintMessage(countStrike, countBall);
        return hint;
    }
    // 힌트 문자열 반환
    function hintMessage(countStrike, countBall) {
        if (countStrike === 0 && countBall === 0) {
            return '낫싱';
        }
        else if (countBall !== 0) {
            return "".concat(countBall, "\uBCFC");
        }
        else if (countStrike !== 0) {
            return "".concat(countStrike, "\uC2A4\uD2B8\uB77C\uC774\uD06C");
        }
        else {
            return "".concat(countBall, "\uBCFC ").concat(countStrike, "\uC2A4\uD2B8\uB77C\uC774\uD06C");
        }
    }
    // 사용자 입력값 유효성 검사
    function validateUserNumbers(userNumbers) {
        var userInputLength = userNumbers.length;
        var includeZero = userNumbers.includes(0);
        var countUniqueNumber = new Set(userNumbers).size;
        return userInputLength === 3 && !includeZero && countUniqueNumber === 3;
    }
};
