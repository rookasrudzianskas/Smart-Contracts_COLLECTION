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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.queueAndExecute = void 0;
var hardhat_1 = require("hardhat");
var helper_hardhat_config_1 = require("../helper-hardhat-config");
var move_blocks_1 = require("../utils/move-blocks");
var move_time_1 = require("../utils/move-time");
function queueAndExecute() {
    return __awaiter(this, void 0, void 0, function () {
        var args, functionToCall, box, encodedFunctionCall, descriptionHash, governor, queueTx, executeTx, boxNewValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = [helper_hardhat_config_1.NEW_STORE_VALUE];
                    functionToCall = helper_hardhat_config_1.FUNC;
                    return [4 /*yield*/, hardhat_1.ethers.getContract("Box")];
                case 1:
                    box = _a.sent();
                    encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
                    descriptionHash = hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes(helper_hardhat_config_1.PROPOSAL_DESCRIPTION));
                    return [4 /*yield*/, hardhat_1.ethers.getContract("GovernorContract")];
                case 2:
                    governor = _a.sent();
                    console.log("Queueing...");
                    return [4 /*yield*/, governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)];
                case 3:
                    queueTx = _a.sent();
                    return [4 /*yield*/, queueTx.wait(1)];
                case 4:
                    _a.sent();
                    if (!helper_hardhat_config_1.developmentChains.includes(hardhat_1.network.name)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, move_time_1.moveTime)(helper_hardhat_config_1.MIN_DELAY + 1)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, move_blocks_1.moveBlocks)(1)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    console.log("Executing...");
                    return [4 /*yield*/, governor.execute([box.address], [0], [encodedFunctionCall], descriptionHash)];
                case 8:
                    executeTx = _a.sent();
                    return [4 /*yield*/, executeTx.wait(1)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, box.retrieve()];
                case 10:
                    boxNewValue = _a.sent();
                    console.log(boxNewValue.toString());
                    return [2 /*return*/];
            }
        });
    });
}
exports.queueAndExecute = queueAndExecute;
queueAndExecute()
    .then(function () { return process.exit(0); })["catch"](function (error) {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=%20queue-and-execute.js.map