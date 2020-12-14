require("dotenv").config();
const verify = require("../src/verify");

const BController = artifacts.require("BController");
const BirdCore = artifacts.require("BirdCore");

module.exports = async (deployer, network) => {

    /* Deploy Bird Controller */
    await deployer.deploy(BController);

    if (network !== "development")
        await verify.etherscanVerify(
            BController,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );

    console.log(BirdCore.address)

    birdCoreInstance = await BirdCore.deployed();

    // Add BController as pending implementation in BirdCore
    birdCoreInstance._setPendingImplementation(BController.address);

    bControllerInstance = await BController.deployed();
    
    // Approve the implementation by calling _become in BController
    bControllerInstance._become(BirdCore.address);
};