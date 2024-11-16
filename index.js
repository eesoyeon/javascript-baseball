"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var ballNumberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 정답 맞히는 횟수 제한
var GAME_LIMIT = 10;
// 게임 진행 상태
var GameState;
(function (GameState) {
    GameState["startGame"] = "1";
    GameState["endGame"] = "9";
})(GameState || (GameState = {}));
// 게임 제출 횟수 입력받기
var getUserSubmitLimit = function () {
    return new Promise(function (resolve) {
        return inputInterface.question('게임 제출 횟수를 입력해주세요: ', function (userSubmitLimit) {
            var submitCount = Number(userSubmitLimit);
            resolve({ gameLimit: GAME_LIMIT, submitCount: submitCount });
        });
    });
};
// user 숫자 입력받기 - 반환값이 [1, 1, 2] + 중복 제거/방지
var getUserInput = function (submitCount) {
    return new Promise(function (resolve) {
        return inputInterface.question('숫자를 입력해주세요: ', function (userInput) {
            var userNumbers = userInput
                .split('')
                .map(Number);
            if (isValidUserInput) {
                resolve({
                    userNumbers: userNumbers,
                    gameLimit: GAME_LIMIT,
                    submitCount: submitCount,
                });
            }
            else {
                console.log('잘못된 입력입니다. 중복되지 않은 3개의 숫자를 입력해주세요.');
            }
        });
    });
};
// 사용자 입력 값 유효성 검사 - 길이 3, 중복 x, 0 포함 x
var isValidUserInput = function (userNumbers) {
    if (userNumbers.filter(function (number) { return isNaN(number); }).length !== 0)
        return false;
    return (userNumbers.length === 3 &&
        !userNumbers.includes(0) &&
        new Set(userNumbers).size === 3);
};
// 제출 횟수 유효성 검사
var isValidSubmitLimit = function (submitCount) {
    if (submitCount > GAME_LIMIT) {
        console.log('잘못된 입력입니다. 제출 횟수는 10번 이하여야 합니다.');
        return false;
    }
    return true;
};
// 컴퓨터가 뽑은 세자리 랜덤 숫자
var getThreeRandomNumbers = function (ballNumberArray) {
    var shuffledArray = ballNumberArray.sort(function () { return Math.random() - 0.5; });
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
var isBall = function (computerNumbers, userNumber, userNumberIndex) {
    return (computerNumbers.indexOf(userNumber) !== userNumberIndex &&
        computerNumbers.includes(userNumber));
};
var isStrike = function (computerNumbers, userNumber, userNumberIndex) {
    return computerNumbers.indexOf(userNumber) === userNumberIndex;
};
/**
 *  볼, 스트라이크 개수 세기
 * @param computerNumbers
 * @param userNumbers
 * @returns
 */
var ballCount = function (computerNumbers, userNumbers) {
    return userNumbers.filter(function (userNumber, userNumberIndex) {
        return isBall(computerNumbers, userNumber, userNumberIndex);
    }).length;
};
var strikeCount = function (computerNumbers, userNumbers) {
    return userNumbers.filter(function (userNumber, userNumberIndex) {
        return isStrike(computerNumbers, userNumber, userNumberIndex);
    }).length;
};
// 힌트 출력
var hintMessage = function (computerNumbers, userNumbers) {
    var ballNumber = ballCount(computerNumbers, userNumbers);
    var strikeNumber = strikeCount(computerNumbers, userNumbers);
    if (strikeNumber === 0 && ballNumber === 0) {
        return '낫싱';
    }
    else if (strikeNumber === 0 && ballNumber !== 0) {
        return "".concat(ballNumber, "\uBCFC");
    }
    else if (strikeNumber !== 0 && ballNumber === 0) {
        return "".concat(strikeNumber, "\uC2A4\uD2B8\uB77C\uC774\uD06C");
    }
    else {
        return "".concat(ballNumber, "\uBCFC ").concat(strikeNumber, "\uC2A4\uD2B8\uB77C\uC774\uD06C");
    }
};
// 전적
// 통계
// 게임 시작
