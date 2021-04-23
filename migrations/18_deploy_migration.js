require("dotenv").config();
const verify = require("../src/verify");

const BErc20ZRXDelegate = artifacts.require("BErc20ZRXDelegate");
const BErc20ZRXDelegator = artifacts.require("BErc20ZRXDelegator");
const BirdCore = artifacts.require("BirdCore");
const JumpRateModel = artifacts.require("JumpRateModel");

// Admin address for deploying bZRX
const ADMIN_ADDRESS = "0x60b6a57b71f23a8c602eD71b60272FdA321D2666";

module.exports = async (deployer, network) => {
  let ZRX_TOKEN_ADDRESS = "0x6249Cd2d84d9ABB89DD0Ef115Cd334569a50DA8C";

  /* Deploy Bird ZRX */
  await deployer.deploy(
    BErc20ZRXDelegator,
    ZRX_TOKEN_ADDRESS,
    BirdCore.address,
    JumpRateModel.address,
    "200000000000000000000000000",
    "Bird BZRX",
    "bBZRX",
    8,
    ADMIN_ADDRESS,
    BErc20ZRXDelegate.address,
    "0x0"
  );

  if (network !== "development")
    await verify.bscscanVerify(
      BErc20ZRXDelegator,
      network,
      process.env.BSCSCANAPIKEY,
      1
    );
};
