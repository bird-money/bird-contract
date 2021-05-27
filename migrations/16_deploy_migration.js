require("dotenv").config();
const verify = require("../src/verify");

const BErc20WBTCDelegate = artifacts.require("BErc20WBTCDelegate");
const BErc20WBTCDelegator = artifacts.require("BErc20WBTCDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bWBTC
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666"

module.exports = async (deployer, network) => {
    let WBTC_TOKEN_ADDRESS = "0x3E090FfB054d69c32f8129D55F64B0047224204F";

    /* Deploy Bird WBTC */
    await deployer.deploy(
        BErc20WBTCDelegator,
        WBTC_TOKEN_ADDRESS,
        BirdCore.address,
        JumpRateModel.address,
        "200000000000000000000000000",
        "Bird WBTC",
        "bWBTC",
        8,
        ADMIN_ADDRESS,
        BErc20WBTCDelegate.address,
        '0x0'
    );

    if (network !== "development")
        await verify.bscscanVerify(
            BErc20WBTCDelegator,
            network,
            process.env.BSCSCANAPIKEY,
            1
        );
};