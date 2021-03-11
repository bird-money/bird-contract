require("dotenv").config();
const verify = require("../src/verify");

const BErc20ZRXDelegate = artifacts.require("BErc20ZRXDelegate");
const BErc20ZRXDelegator = artifacts.require("BErc20ZRXDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bZRX
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let ZRX_TOKEN_ADDRESS = "0xe41d2489571d322189246dafa5ebde1f4699f498";

  //   if (network === "kovan" || "development") {
  //     ZRX_TOKEN_ADDRESS = "0xdA44108a60d411B129BCF953a99013E8E4Af7503";
  //   } else if (network === "mainnet") {
  //     ZRX_TOKEN_ADDRESS = "0xe41d2489571d322189246dafa5ebde1f4699f498";
  //   }

  /* Deploy Bird ZRX */
  await deployer.deploy(
    BErc20ZRXDelegator,
    ZRX_TOKEN_ADDRESS,
    BirdCore.address,
    JumpRateModel.address,
    "200000000000000000000000000",
    "Bird ZRX",
    "bZRX",
    8,
    ADMIN_ADDRESS,
    BErc20ZRXDelegate.address,
    "0x0"
  );

  if (network !== "development")
    await verify.etherscanVerify(
      BErc20ZRXDelegator,
      network,
      process.env.ETHERSCAN_KEY,
      1
    );
};
