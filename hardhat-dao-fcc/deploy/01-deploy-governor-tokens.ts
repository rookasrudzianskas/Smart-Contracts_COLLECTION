// @ts-nocheck
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../helper-functions";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("----------------------------------------------------");
    log("Deploying GovernanceToken and waiting for confirmations...");

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    });
    log(`GovernanceToken at ${governanceToken.address}`);
    if(developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceToken.address, []);
    }

}








deployGovernanceToken.tags = ["all", "governor"];
