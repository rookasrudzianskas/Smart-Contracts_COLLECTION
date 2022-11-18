"use strict";
exports.__esModule = true;
exports.PROPOSAL_DESCRIPTION = exports.FUNC = exports.NEW_STORE_VALUE = exports.ADDRESS_ZERO = exports.VOTING_DELAY = exports.VOTING_PERIOD = exports.MIN_DELAY = exports.QUORUM_PERCENTAGE = exports.proposalsFile = exports.developmentChains = exports.networkConfig = void 0;
exports.networkConfig = {
    localhost: {},
    hardhat: {},
    goerli: {
        blockConfirmations: 6
    }
};
exports.developmentChains = ["hardhat", "localhost"];
exports.proposalsFile = "proposals.json";
// Governor Values
exports.QUORUM_PERCENTAGE = 4; // Need 4% of voters to pass
exports.MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can enact
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
exports.VOTING_PERIOD = 5; // blocks
exports.VOTING_DELAY = 1; // 1 Block - How many blocks till a proposal vote becomes active
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
exports.NEW_STORE_VALUE = 77;
exports.FUNC = "store";
exports.PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!";
//# sourceMappingURL=helper-hardhat-config.js.map