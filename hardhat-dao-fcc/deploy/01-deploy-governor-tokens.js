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
var hardhat_1 = require("hardhat");
var deployGovernanceToken = function (hre) {
    return __awaiter(this, void 0, void 0, function () {
        var getNamedAccounts, deployments, network, deploy, log, deployer, governanceToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getNamedAccounts = hre.getNamedAccounts, deployments = hre.deployments, network = hre.network;
                    deploy = deployments.deploy, log = deployments.log;
                    return [4 /*yield*/, getNamedAccounts()];
                case 1:
                    deployer = (_a.sent()).deployer;
                    log("----------------------------------------------------");
                    log("Deploying GovernanceToken and waiting for confirmations...");
                    return [4 /*yield*/, deploy("GovernanceToken", {
                            from: deployer,
                            args: [],
                            log: true,
                            // we need to wait if on a live network so we can verify properly
                            waitConfirmations: helper_hardhat_config_1.networkConfig[network.name].blockConfirmations || 1
                        })];
                case 2:
                    governanceToken = _a.sent();
                    log("GovernanceToken at ".concat(governanceToken.address));
                    if (!(helper_hardhat_config_1.developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, helper_functions_1["default"])(governanceToken.address, [])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    log("Delegating to ".concat(deployer));
                    return [4 /*yield*/, delegate(governanceToken.address, deployer)];
                case 5:
                    _a.sent();
                    log("Delegated!");
                    return [2 /*return*/];
            }
        });
    });
};
var delegate = function (governanceTokenAddress, delegatedAccount) { return __awaiter(void 0, void 0, void 0, function () {
    var governanceToken, transactionResponse, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, hardhat_1.ethers.getContractAt("GovernanceToken", governanceTokenAddress)];
            case 1:
                governanceToken = _d.sent();
                return [4 /*yield*/, governanceToken.delegate(delegatedAccount)];
            case 2:
                transactionResponse = _d.sent();
                return [4 /*yield*/, transactionResponse.wait(1)];
            case 3:
                _d.sent();
                _b = (_a = console).log;
                _c = "Checkpoints: ".concat;
                return [4 /*yield*/, governanceToken.numCheckpoints(delegatedAccount)];
            case 4:
                _b.apply(_a, [_c.apply("Checkpoints: ", [_d.sent()])]);
                return [2 /*return*/];
        }
    });
}); };
deployGovernanceToken.tags = ["all", "governor"];
//# sourceMappingURL=01-deploy-governor-tokens.js.map