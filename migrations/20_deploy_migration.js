require("dotenv").config();
const verify = require("../src/verify");

const BErc20LINKDelegate = artifacts.require("BErc20LINKDelegate");
const BErc20LINKDelegator = artifacts.require("BErc20LINKDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bLINK
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let LINK_TOKEN_ADDRESS = "0x514910771af9ca656af840dff83e8264ecf986ca";

//   if (network === "kovan" || "development") {
//     LINK_TOKEN_ADDRESS = "0x27e39557EA165Ec5388Ac9cF42690D48daC6Ebe1";
//   } else if (network === "mainnet") {
//     LINK_TOKEN_ADDRESS = "0x514910771af9ca656af840dff83e8264ecf986ca";
//   }

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
    await verify.etherscanVerify(
      BErc20LINKDelegator,
      network,
      process.env.ETHERSCAN_KEY,
      1
    );
};
