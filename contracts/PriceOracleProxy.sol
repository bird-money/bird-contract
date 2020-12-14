pragma solidity ^0.5.16;

import "./BErc20.sol";
import "./BToken.sol";
import "./PriceOracle.sol";

interface V1PriceOracleInterface {
    function assetPrices(address asset) external view returns (uint);
}

contract PriceOracleProxy is PriceOracle {
    /// @notice Indicator that this is a PriceOracle contract (for inspection)
    bool public constant isPriceOracle = true;

    /// @notice The v1 price oracle, which will continue to serve prices for v1 assets
    V1PriceOracleInterface public v1PriceOracle;

    /// @notice Address of the guardian, which may set the SAI price once
    address public guardian;

    /// @notice Address of the bUSDC contract, which we hand pick a key for
    address public bUsdcAddress;

    /// @notice Address of the bUSDT contract, which uses the bUSDC price
    address public bUsdtAddress;

    /// @notice Address of the pDAI contract, which we hand pick a key for
    address public pDaiAddress;

    /// @notice Handpicked key for USDC
    address public constant usdcOracleKey = address(1);

    /// @notice Handpicked key for DAI
    address public constant daiOracleKey = address(2);

    /**
     * @param guardian_ The address of the guardian, which may set the SAI price once
     * @param v1PriceOracle_ The address of the v1 price oracle, which will continue to operate and hold prices for collateral assets
     * @param bUsdcAddress_ The address of bUSDC, which will be read from a special oracle key
     * @param pDaiAddress_ The address of pDAI, which will be read from a special oracle key
     * @param bUsdtAddress_ The address of bUSDT, which uses the bUSDC price
     */
    constructor(address guardian_,
                address v1PriceOracle_,
                address bUsdcAddress_,
                address pDaiAddress_,
                address bUsdtAddress_) public {
        guardian = guardian_;
        v1PriceOracle = V1PriceOracleInterface(v1PriceOracle_);

        bUsdcAddress = bUsdcAddress_;
        pDaiAddress = pDaiAddress_;
        bUsdtAddress = bUsdtAddress_;
    }

    /**
     * @notice Get the underlying price of a listed bToken asset
     * @param bToken The bToken to get the underlying price of
     * @return The underlying asset price mantissa (scaled by 1e18)
     */
    function getUnderlyingPrice(BToken bToken) public view returns (uint) {
        address bTokenAddress = address(bToken);

        if (bTokenAddress == bUsdcAddress || bTokenAddress == bUsdtAddress) {
            return v1PriceOracle.assetPrices(usdcOracleKey);
        }

        if (bTokenAddress == pDaiAddress) {
            return v1PriceOracle.assetPrices(daiOracleKey);
        }

        // otherwise just read from v1 oracle
        address underlying = BErc20(bTokenAddress).underlying();
        return v1PriceOracle.assetPrices(underlying);
    }
}