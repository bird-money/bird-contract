pragma solidity ^0.5.16;

pragma experimental ABIEncoderV2;

import "./BErc20.sol";
import "./BToken.sol";
import "./PriceOracle.sol";
import "./EIP20Interface.sol";
import "./BirdPlus.sol";

interface BControllerLensInterface {
    function markets(address) external view returns (bool, uint);
    function oracle() external view returns (PriceOracle);
    function getAccountLiquidity(address) external view returns (uint, uint, uint);
    function getAssetsIn(address) external view returns (BToken[] memory);
    function claimBird(address) external;
    function birdAccrued(address) external view returns (uint);
}

contract BirdLens {
    struct BTokenMetadata {
        address bToken;
        uint exchangeRateCurrent;
        uint supplyRatePerBlock;
        uint borrowRatePerBlock;
        uint reserveFactorMantissa;
        uint totalBorrows;
        uint totalReserves;
        uint totalSupply;
        uint totalCash;
        bool isListed;
        uint collateralFactorMantissa;
        address underlyingAssetAddress;
        uint bTokenDecimals;
        uint underlyingDecimals;
    }

    function bTokenMetadata(BToken bToken) public returns (BTokenMetadata memory) {
        uint exchangeRateCurrent = bToken.exchangeRateCurrent();
        BControllerLensInterface bController = BControllerLensInterface(address(bToken.bController()));
        (bool isListed, uint collateralFactorMantissa) = bController.markets(address(bToken));
        address underlyingAssetAddress;
        uint underlyingDecimals;

        if (birdareStrings(bToken.symbol(), "bETH")) {
            underlyingAssetAddress = address(0);
            underlyingDecimals = 18;
        } else {
            BErc20 cErc20 = BErc20(address(bToken));
            underlyingAssetAddress = cErc20.underlying();
            underlyingDecimals = EIP20Interface(cErc20.underlying()).decimals();
        }

        return BTokenMetadata({
            bToken: address(bToken),
            exchangeRateCurrent: exchangeRateCurrent,
            supplyRatePerBlock: bToken.supplyRatePerBlock(),
            borrowRatePerBlock: bToken.borrowRatePerBlock(),
            reserveFactorMantissa: bToken.reserveFactorMantissa(),
            totalBorrows: bToken.totalBorrows(),
            totalReserves: bToken.totalReserves(),
            totalSupply: bToken.totalSupply(),
            totalCash: bToken.getCash(),
            isListed: isListed,
            collateralFactorMantissa: collateralFactorMantissa,
            underlyingAssetAddress: underlyingAssetAddress,
            bTokenDecimals: bToken.decimals(),
            underlyingDecimals: underlyingDecimals
        });
    }

    function bTokenMetadataAll(BToken[] calldata bTokens) external returns (BTokenMetadata[] memory) {
        uint bTokenCount = bTokens.length;
        BTokenMetadata[] memory res = new BTokenMetadata[](bTokenCount);
        for (uint i = 0; i < bTokenCount; i++) {
            res[i] = bTokenMetadata(bTokens[i]);
        }
        return res;
    }

    struct BTokenBalances {
        address bToken;
        uint balanceOf;
        uint borrowBalanceCurrent;
        uint balanceOfUnderlying;
        uint tokenBalance;
        uint tokenAllowance;
    }

    function bTokenBalances(BToken bToken, address payable account) public returns (BTokenBalances memory) {
        uint balanceOf = bToken.balanceOf(account);
        uint borrowBalanceCurrent = bToken.borrowBalanceCurrent(account);
        uint balanceOfUnderlying = bToken.balanceOfUnderlying(account);
        uint tokenBalance;
        uint tokenAllowance;

        if (birdareStrings(bToken.symbol(), "bETH")) {
            tokenBalance = account.balance;
            tokenAllowance = account.balance;
        } else {
            BErc20 cErc20 = BErc20(address(bToken));
            EIP20Interface underlying = EIP20Interface(cErc20.underlying());
            tokenBalance = underlying.balanceOf(account);
            tokenAllowance = underlying.allowance(account, address(bToken));
        }

        return BTokenBalances({
            bToken: address(bToken),
            balanceOf: balanceOf,
            borrowBalanceCurrent: borrowBalanceCurrent,
            balanceOfUnderlying: balanceOfUnderlying,
            tokenBalance: tokenBalance,
            tokenAllowance: tokenAllowance
        });
    }

    function bTokenBalancesAll(BToken[] calldata bTokens, address payable account) external returns (BTokenBalances[] memory) {
        uint bTokenCount = bTokens.length;
        BTokenBalances[] memory res = new BTokenBalances[](bTokenCount);
        for (uint i = 0; i < bTokenCount; i++) {
            res[i] = bTokenBalances(bTokens[i], account);
        }
        return res;
    }

    struct BTokenUnderlyingPrice {
        address bToken;
        uint underlyingPrice;
    }

    function bTokenUnderlyingPrice(BToken bToken) public returns (BTokenUnderlyingPrice memory) {
        BControllerLensInterface bController = BControllerLensInterface(address(bToken.bController()));
        PriceOracle priceOracle = bController.oracle();

        return BTokenUnderlyingPrice({
            bToken: address(bToken),
            underlyingPrice: priceOracle.getUnderlyingPrice(bToken)
        });
    }

    function bTokenUnderlyingPriceAll(BToken[] calldata bTokens) external returns (BTokenUnderlyingPrice[] memory) {
        uint bTokenCount = bTokens.length;
        BTokenUnderlyingPrice[] memory res = new BTokenUnderlyingPrice[](bTokenCount);
        for (uint i = 0; i < bTokenCount; i++) {
            res[i] = bTokenUnderlyingPrice(bTokens[i]);
        }
        return res;
    }

    struct AccountLimits {
        BToken[] markets;
        uint liquidity;
        uint shortfall;
    }

    function getAccountLimits(BControllerLensInterface bController, address account) public returns (AccountLimits memory) {
        (uint errorCode, uint liquidity, uint shortfall) = bController.getAccountLiquidity(account);
        require(errorCode == 0);

        return AccountLimits({
            markets: bController.getAssetsIn(account),
            liquidity: liquidity,
            shortfall: shortfall
        });
    }

    struct BirdBalanceMetadata {
        uint balance;
    }

    function getBirdBalanceMetadata(BirdPlus birdPlus, address account) external view returns (BirdBalanceMetadata memory) {
        return BirdBalanceMetadata({
            balance: birdPlus.balanceOf(account)
        });
    }

    struct BirdBalanceMetadataExt {
        uint balance;
        uint allocated;
    }

    function getBirdBalanceMetadataExt(BirdPlus birdPlus, BControllerLensInterface bController, address account) external returns (BirdBalanceMetadataExt memory) {
        uint balance = birdPlus.balanceOf(account);
        bController.claimBird(account);
        uint newBalance = birdPlus.balanceOf(account);
        uint accrued = bController.birdAccrued(account);
        uint total = add(accrued, newBalance, "sum birdPlus total");
        uint allocated = sub(total, balance, "sub allocated");

        return BirdBalanceMetadataExt({
            balance: balance,
            allocated: allocated
        });
    }

    function birdareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function add(uint a, uint b, string memory errorMessage) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a, errorMessage);
        return c;
    }

    function sub(uint a, uint b, string memory errorMessage) internal pure returns (uint) {
        require(b <= a, errorMessage);
        uint c = a - b;
        return c;
    }
}