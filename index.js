"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
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
    return [countStrike, countBall];
}
// 힌트 문자열 반환
function getHintMessage(computerNumbers, userNumbers) {
    var _a = calculateStrikeOrBall(computerNumbers, userNumbers), countStrike = _a[0], countBall = _a[1];
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
// 게임 시작
function startGame() {
    return __awaiter(this, void 0, void 0, function () {
        var computerNumbers, userNumbers, hint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    computerNumbers = generateThreeUniqueDigits();
                    console.log('컴퓨터가 숫자를 뽑았습니다.\n');
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, getUserInput()];
                case 2:
                    userNumbers = _a.sent();
                    if (!isValidUserNumbers(userNumbers)) {
                        console.log('1~9까지의 숫자 중에서 서로 다른 세자리 수를 입력하세요.');
                        return [3 /*break*/, 1];
                    }
                    hint = getHintMessage(computerNumbers, userNumbers);
                    console.log(hint);
                    if (hint === '3스트라이크') {
                        winGame();
                        return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 사용자 입력값 받는 함수
function getUserInput() {
    return new Promise(function (resolve) {
        return rl.question('숫자를 입력해주세요: ', function (userInput) {
            return resolve(userInput.split('').map(Number));
        });
    });
}
// 모두 맞췄을 때 출력하는 함수
function winGame() {
    console.log('\n3개의 숫자를 모두 맞히셨습니다.');
    console.log('-------게임 종료-------\n');
}
// 사용자 입력값 유효성 검사
function isValidUserNumbers(userNumbers) {
    var userInputLength = userNumbers.length;
    var includeZero = userNumbers.includes(0);
    var countUniqueNumber = new Set(userNumbers).size;
    return userInputLength === 3 && !includeZero && countUniqueNumber === 3;
}
// 애플리케이션 실행
function startApplication() {
    return __awaiter(this, void 0, void 0, function () {
        var isRunning, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isRunning = true;
                    _a.label = 1;
                case 1:
                    if (!isRunning) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            return rl.question('게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n', resolve);
                        })];
                case 2:
                    input = _a.sent();
                    return [4 /*yield*/, startOrEndGame(input)];
                case 3:
                    isRunning = _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 게임 시작 or 종료
function startOrEndGame(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(input === '1')) return [3 /*break*/, 2];
                    return [4 /*yield*/, startGame()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    if (input === '9') {
                        endGame();
                        return [2 /*return*/, false];
                    }
                    else {
                        console.log('잘못된 입력입니다. 1 또는 9를 입력해주세요.\n');
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, true];
            }
        });
    });
}
// 애플리케이션 종료
function endGame() {
    console.log('\n애플리케이션이 종료되었습니다.');
    rl.close();
}
startApplication();
