const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { network, deployments, deployer, getNamedAccounts} = require("hardhat");

async function main() {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
    const transparentProxy = await ethers.getContract("Box_Proxy");

    const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address);
    const versionV1 = await proxyBoxV1.version();
    console.log("version", versionV1);

    const boxV2 = await ethers.getContract("BoxV2");
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address);
    await upgradeTx.wait(1);

    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address);
    const versionV2 = await proxyBoxV2.version;
    log("Box upgraded to version ", versionV2);

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------");


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
