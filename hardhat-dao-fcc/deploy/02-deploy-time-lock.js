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
var helper_functions_1 = require("../helper-functions");
var helper_hardhat_config_1 = require("../helper-hardhat-config");
var deployTimeLock = function (hre) {
    return __awaiter(this, void 0, void 0, function () {
        var getNamedAccounts, deployments, network, deploy, log, deployer, timeLock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getNamedAccounts = hre.getNamedAccounts, deployments = hre.deployments, network = hre.network;
                    deploy = deployments.deploy, log = deployments.log;
                    return [4 /*yield*/, getNamedAccounts()];
                case 1:
                    deployer = (_a.sent()).deployer;
                    log("----------------------------------------------------");
                    log("Deploying TimeLock and waiting for confirmations...");
                    return [4 /*yield*/, deploy("TimeLock", {
                            from: deployer,
                            args: [helper_hardhat_config_1.MIN_DELAY, [], []],
                            log: true,
                            waitConfirmations: helper_hardhat_config_1.networkConfig[network.name].blockConfirmations || 1
                        })];
                case 2:
                    timeLock = _a.sent();
                    log("TimeLock deployed at ".concat(timeLock.address));
                    if (!(!helper_hardhat_config_1.developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, helper_functions_1["default"])(timeLock.address, [])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports["default"] = deployTimeLock;
deployTimeLock.tags = ["all", "timelock"];
//# sourceMappingURL=02-deploy-time-lock.js.map