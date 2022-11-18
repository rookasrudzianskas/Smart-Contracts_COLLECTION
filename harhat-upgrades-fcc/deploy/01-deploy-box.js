const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { network } = require("hardhat");


module.exports = async ({ getNamedAccounts, deployments }) => {
    const {deploy, log} = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");

    const box = await deploy("Box", {
        from: deployer,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
        proxies: {
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            }
        }
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        const boxAddress = (await ethers.getContract("Box_Implementation")).address;
        await verify(boxAddress, []);
    }
    log("----------------------------------------------------");;

}


module.exports.tags = ["all", "box"];
