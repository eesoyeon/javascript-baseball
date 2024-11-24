"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
// 게임 진행 상태
var GameState;
(function (GameState) {
    GameState["startGame"] = "1";
    GameState["showGameRecords"] = "2";
    GameState["showGameStatistics"] = "3";
    GameState["endGame"] = "9";
    GameState["runningGame"] = "RUNNING";
})(GameState || (exports.GameState = GameState = {}));
