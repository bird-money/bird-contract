require("dotenv").config();
const verify = require("../src/verify");

const BErc20BIRDDelegate = artifacts.require("BErc20BIRDDelegate");
const BErc20BIRDDelegator = artifacts.require("BErc20BIRDDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bBIRD
const ADMIN_ADDRESS = "0x6f20FEeECcd51783779Ca10431b60B15f83d06F1"

module.exports = async (deployer, network) => {
    let BIRD_TOKEN_ADDRESS;

    if (network === "kovan" || "development") {
        BIRD_TOKEN_ADDRESS = "0xd0b8B462dE46c082282e9c5b810760C63b9Fb7B9"
    }

    /* Deploy Bird BIRD */
    await deployer.deploy(
        BErc20BIRDDelegator,
        BIRD_TOKEN_ADDRESS,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "Bird BIRD",
        "bBIRD",
        8,
        ADMIN_ADDRESS,
        BErc20BIRDDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.etherscanVerify(
            BErc20BIRDDelegator,
            network,
            process.env.ETHERSCAN_KEY,
            1
        );
};