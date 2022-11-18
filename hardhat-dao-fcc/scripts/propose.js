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
exports.propose = void 0;
// @ts-nocheck
var hardhat_1 = require("hardhat");
var helper_hardhat_config_1 = require("../helper-hardhat-config");
var fs = require("fs");
var move_blocks_1 = require("../utils/move-blocks");
function propose(args, functionToCall, proposalDescription) {
    return __awaiter(this, void 0, void 0, function () {
        var governor, box, encodedFunctionCall, proposeTx, proposedReceipt, proposalId, proposalState, proposalSnapShot, proposalDeadline, proposals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContract("GovernorContract")];
                case 1:
                    governor = _a.sent();
                    return [4 /*yield*/, hardhat_1.ethers.getContract("Box")];
                case 2:
                    box = _a.sent();
                    encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
                    console.log("Proposing ".concat(functionToCall, " on ").concat(box.address, " with ").concat(args));
                    console.log("Proposal Description:\n  ".concat(proposalDescription));
                    return [4 /*yield*/, governor.propose([box.address], [0], [encodedFunctionCall], proposalDescription)];
                case 3:
                    proposeTx = _a.sent();
                    if (!helper_hardhat_config_1.developmentChains.includes(hardhat_1.network.name)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, move_blocks_1.moveBlocks)(helper_hardhat_config_1.VOTING_DELAY)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, proposeTx.wait(1)];
                case 6:
                    proposedReceipt = _a.sent();
                    proposalId = proposeReceipt.events[0].args.proposalId;
                    console.log("Proposed with proposal ID:\n  ".concat(proposalId));
                    return [4 /*yield*/, governor.state(proposalId)];
                case 7:
                    proposalState = _a.sent();
                    return [4 /*yield*/, governor.proposalSnapshot(proposalId)];
                case 8:
                    proposalSnapShot = _a.sent();
                    return [4 /*yield*/, governor.proposalDeadline(proposalId)];
                case 9:
                    proposalDeadline = _a.sent();
                    proposals = JSON.parse(fs.readFileSync(helper_hardhat_config_1.proposalsFile, "utf8"));
                    proposals[hardhat_1.network.config.chainId.toString()].push(proposalId.toString());
                    fs.writeFileSync(helper_hardhat_config_1.proposalsFile, JSON.stringify(proposals));
                    return [2 /*return*/];
            }
        });
    });
}
exports.propose = propose;
propose([helper_hardhat_config_1.NEW_STORE_VALUE], helper_hardhat_config_1.FUNC, helper_hardhat_config_1.PROPOSAL_DESCRIPTION)
    .then(function () { return process.exit(0); })["catch"](function (error) {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=propose.js.map