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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var enums_1 = require("./models/enums");
var types_1 = require("./models/types");
var inputInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var MAX_GAME_LIMIT = 15;
var THREE_NUMBER_LENGTH = 3;
var getThreeRandomNumbers = function () {
    var shuffledArray = __spreadArray([], types_1.ballNumberArray, true).sort(function () { return Math.random() - 0.5; });
    return shuffledArray.slice(0, THREE_NUMBER_LENGTH);
};
var getSubmitLimit = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                return inputInterface.question('컴퓨터에게 몇 번을 도전할지 횟수를 입력해주세요. (1~15)\n', function (limitInput) {
                    var limit = Number(limitInput);
                    if (isValidSubmitLimit(limit)) {
                        resolve(limit);
                    }
                    else {
                        console.log('잘못된 입력입니다. 제출 횟수는 1~15 사이의 숫자여야 합니다.\n');
                        resolve(getSubmitLimit());
                    }
                });
            })];
    });
}); };
var isValidSubmitLimit = function (limit) {
    return limit >= 1 && limit <= MAX_GAME_LIMIT;
};
var getUserNumbers = function (submitCount) {
    return new Promise(function (resolve) {
        return inputInterface.question('숫자를 입력해주세요: ', function (userInput) {
            var userNumbers = userInput.split('').map(Number);
            if (isValidUserNumbers(userNumbers)) {
                resolve(userNumbers);
            }
            else {
                console.log('잘못된 입력입니다. 중복되지 않은 1~9에서 3개의 숫자를 입력해주세요.\n');
                resolve(getUserNumbers(submitCount));
            }
        });
    });
};
var isValidUserNumbers = function (userNumbers) {
    var isAllBallNumbers = userNumbers.every(function (number) {
        return types_1.ballNumberArray.includes(number);
    });
    var isValidLength = userNumbers.length === THREE_NUMBER_LENGTH;
    var hasNoDuplicate = new Set(userNumbers).size === THREE_NUMBER_LENGTH;
    return isAllBallNumbers && isValidLength && hasNoDuplicate;
};
var isBall = function (computerNumbers, userNumber, userNumberIndex) {
    return (computerNumbers.indexOf(userNumber) !== userNumberIndex &&
        computerNumbers.includes(userNumber));
};
var isStrike = function (computerNumbers, userNumber, userNumberIndex) {
    return computerNumbers.indexOf(userNumber) === userNumberIndex;
};
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
var formatDate = function () {
    var date = new Date().toLocaleString('ko-KR', {
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
var recordGame = function (winner, attempts, startTime, gameLimit) {
    var result = {
        id: types_1.gameRecord.totalGames + 1,
        startTime: startTime,
        endTime: formatDate(),
        gameLimit: gameLimit,
        attempts: attempts,
        winner: winner,
    };
    types_1.gameRecord.results.push(result);
    types_1.gameRecord.totalGames++;
    if (winner === 'User') {
        types_1.gameRecord.userWins++;
    }
    else {
        types_1.gameRecord.computerWins++;
    }
};
var showRecords = function (record) {
    if (record.results.length === 0) {
        console.log('기록이 없습니다.\n');
    }
    else {
        var records = record.results.map(function (result) {
            var id = "[".concat(result.id, "]");
            var startTime = "\uC2DC\uC791 \uC2DC\uAC04: ".concat(result.startTime);
            var endTime = "\uC885\uB8CC \uC2DC\uAC04: ".concat(result.endTime);
            var attempts = "\uC2DC\uB3C4 \uD69F\uC218: ".concat(result.attempts);
            var winner = "\uC2B9\uB9AC\uC790: ".concat(result.winner);
            return [id, startTime, endTime, attempts, winner].join(' / ');
        });
        console.log(__spreadArray([], records, true).join('\n'));
    }
    return initGame();
};
var getStatistics = function (record) {
    if (record.results.length === 0) {
        return null;
    }
    var gameLimits = record.results.map(function (result) { return result.gameLimit; });
    var minGameLimits = Math.min.apply(Math, gameLimits);
    var maxGameLimits = Math.max.apply(Math, gameLimits);
    var maxGameLimitIds = record.results
        .filter(function (result) { return result.gameLimit === maxGameLimits; })
        .map(function (result) { return result.id; });
    var minGameLimitIds = record.results
        .filter(function (result) { return result.gameLimit === minGameLimits; })
        .map(function (result) { return result.id; });
    var attempts = record.results.map(function (result) { return result.attempts; });
    var minAttempts = Math.min.apply(Math, attempts);
    var maxAttempts = Math.max.apply(Math, attempts);
    var avgAttempts = (attempts.reduce(function (sum, current) { return sum + current; }, 0) / attempts.length).toFixed(2);
    var maxAttemptsIds = record.results
        .filter(function (result) { return result.attempts === maxAttempts; })
        .map(function (result) { return result.id; });
    var minAttemptsIds = record.results
        .filter(function (result) { return result.attempts === minAttempts; })
        .map(function (result) { return result.id; });
    var computerWinsCount = record.computerWins;
    var userWinsCount = record.userWins;
    return {
        minGameLimits: minGameLimits,
        maxGameLimits: maxGameLimits,
        minAttempts: minAttempts,
        maxAttempts: maxAttempts,
        avgAttempts: avgAttempts,
        computerWinsCount: computerWinsCount,
        userWinsCount: userWinsCount,
        maxGameLimitIds: maxGameLimitIds,
        minGameLimitIds: minGameLimitIds,
        maxAttemptsIds: maxAttemptsIds,
        minAttemptsIds: minAttemptsIds,
    };
};
var showStatistics = function (record) {
    if (record.results.length === 0) {
        console.log('통계가 없습니다.\n');
    }
    else {
        var statistics = getStatistics(record);
        console.log("\uAC8C\uC784 \uC911 \uAC00\uC7A5 \uC801\uC740 \uC218\uC758 \uC81C\uCD9C \uD69F\uC218 : ".concat(statistics.minGameLimits, "\uD68C - [").concat(statistics.minGameLimitIds, "]"));
        console.log("\uAC8C\uC784 \uC911 \uAC00\uC7A5 \uB9CE\uC740 \uC218\uC758 \uC81C\uCD9C \uD69F\uC218 : ".concat(statistics.maxGameLimits, "\uD68C - [").concat(statistics.maxGameLimitIds, "]"));
        console.log("\uAC00\uC7A5 \uB9CE\uC774 \uC801\uC6A9\uB41C \uC2B9\uB9AC/\uD328\uBC30 \uD69F\uC218: ".concat(statistics, "\uD68C")); // 가장 많이 적용된 승리/패패 횟수: 5회 - [1] // 이건 뭔말인지 이해를 못했습니다..ㅜㅜ
        console.log("\uAC8C\uC784 \uC911 \uAC00\uC7A5 \uC801\uC740 \uC218\uC758 \uC2DC\uB3C4 \uD69F\uC218 : ".concat(statistics.minAttempts, "\uD68C - [").concat(statistics.minAttemptsIds, "]"));
        console.log("\uAC8C\uC784 \uC911 \uAC00\uC7A5 \uB9CE\uC740 \uC218\uC758 \uC2DC\uB3C4 \uD69F\uC218 : ".concat(statistics.maxAttempts, "\uD68C - [").concat(statistics.maxAttemptsIds, "]"));
        console.log("\uC2DC\uB3C4 \uD69F\uC218\uC758 \uD3C9\uADE0 : ".concat(statistics.avgAttempts, "\uD68C"));
        console.log("\uCEF4\uD4E8\uD130\uAC00 \uCD1D \uC2B9\uB9AC\uD55C \uD69F\uC218: ".concat(statistics.computerWinsCount, "\uD68C"));
        console.log("\uC0AC\uC6A9\uC790\uAC00 \uCD1D \uC2B9\uB9AC\uD55C \uD69F\uC218: ".concat(statistics.userWinsCount, "\uD68C"));
        console.log("\n-------\uD1B5\uACC4 \uC885\uB8CC-------\n");
    }
    return initGame();
};
var initGame = function () {
    inputInterface.question('게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요.\n', function (state) {
        switch (state) {
            case enums_1.GameState.startGame: // 1
                startGame();
                break;
            case enums_1.GameState.showGameRecords: // 2
                showRecords(types_1.gameRecord);
                break;
            case enums_1.GameState.showGameStatistics: // 3
                showStatistics(types_1.gameRecord);
                break;
            case enums_1.GameState.endGame: // 9
                console.log('애플리케이션이 종료되었습니다.\n');
                inputInterface.close();
                break;
            default:
                console.log('잘못된 입력입니다. 다시 입력해주세요.\n');
                initGame();
                break;
        }
    });
};
inputInterface.on('close', function () { return process.exit(); });
var startGame = function () { return __awaiter(void 0, void 0, void 0, function () {
    var computer, gameLimit, userNumbers, startTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                computer = {
                    computerNumbers: getThreeRandomNumbers(),
                    answer: '3스트라이크',
                };
                console.log('컴퓨터가 숫자를 뽑았습니다.\n');
                return [4 /*yield*/, getSubmitLimit()];
            case 1:
                gameLimit = _a.sent();
                return [4 /*yield*/, getUserNumbers(0)];
            case 2:
                userNumbers = _a.sent();
                startTime = formatDate();
                playGame({ userNumbers: userNumbers, submitCount: 1 }, computer, gameLimit, startTime);
                return [2 /*return*/];
        }
    });
}); };
var playGame = function (user, computer, gameLimit, startTime) {
    var hint = hintMessage(computer.computerNumbers, user.userNumbers);
    console.log(hint);
    if (hint === computer.answer) {
        console.log('\n3개의 숫자를 모두 맞히셨습니다.\n');
        console.log('사용자가 승리하였습니다.\n');
        console.log('-------게임 종료-------\n-------기록 종료-------\n');
        recordGame('User', user.submitCount, startTime, gameLimit);
        return initGame();
    }
    if (user.submitCount >= gameLimit) {
        console.log('\n제한된 횟수를 모두 사용하였습니다. 컴퓨터가 승리합니다.\n');
        console.log("\uC815\uB2F5\uC740 ".concat(computer.computerNumbers.join(''), "\uC785\uB2C8\uB2E4.\n"));
        recordGame('Computer', user.submitCount, startTime, gameLimit);
        return initGame();
    }
    getUserNumbers(user.submitCount + 1).then(function (nextNumbers) {
        playGame({ userNumbers: nextNumbers, submitCount: user.submitCount + 1 }, computer, gameLimit, startTime);
    });
};
initGame();
