require("dotenv").config();
const verify = require("../src/verify");

const BErc20LINKDelegate = artifacts.require("BErc20LINKDelegate");
const BErc20LINKDelegator = artifacts.require("BErc20LINKDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bLINK
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let LINK_TOKEN_ADDRESS = "0x5AA034CCBDFc3CF8cbDe2711bf9C3fd90B96F24B";

  /* Deploy Bird LINK */
  await deployer.deploy(
    BErc20LINKDelegator,
    LINK_TOKEN_ADDRESS,
    BirdCore.address,
    JumpRateModel.address,
    "200000000000000000000000000",
    "Bird LINK",
    "bLINK",
    8,
    ADMIN_ADDRESS,
    BErc20LINKDelegate.address,
    "0x0"
  );

  if (network !== "development")
    await verify.bscscanVerify(
      BErc20LINKDelegator,
      network,
      process.env.BSCSCANAPIKEY,
      1
    );
};
