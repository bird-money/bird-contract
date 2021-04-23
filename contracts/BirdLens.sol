pragma solidity ^0.5.16;

pragma experimental ABIEncoderV2;

import "./BErc20.sol";
import "./BToken.sol";
import "./PriceOracle.sol";
import "./EIP20Interface.sol";
import "./BirdPlus.sol";

interface BControllerLensInterface {
    function markets(address) external view returns (bool, uint256);

    function oracle() external view returns (PriceOracle);

    function getAccountLiquidity(address)
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        );

    function getAssetsIn(address) external view returns (BToken[] memory);

    function claimBirdPlus(address) external;

    function birdAccrued(address) external view returns (uint256);
}

contract BirdLens {
    struct BTokenMetadata {
        address bToken;
        uint256 exchangeRateCurrent;
        uint256 supplyRatePerBlock;
        uint256 borrowRatePerBlock;
        uint256 reserveFactorMantissa;
        uint256 totalBorrows;
        uint256 totalReserves;
        uint256 totalSupply;
        uint256 totalCash;
        bool isListed;
        uint256 collateralFactorMantissa;
        address underlyingAssetAddress;
        uint256 bTokenDecimals;
        uint256 underlyingDecimals;
    }

    function bTokenMetadata(BToken bToken)
        public
        returns (BTokenMetadata memory)
    {
        uint256 exchangeRateCurrent = bToken.exchangeRateCurrent();
        BControllerLensInterface bController =
            BControllerLensInterface(address(bToken.bController()));
        (bool isListed, uint256 collateralFactorMantissa) =
            bController.markets(address(bToken));
        address underlyingAssetAddress;
        uint256 underlyingDecimals;

        if (birdareStrings(bToken.symbol(), "bBNB")) {
            underlyingAssetAddress = address(0);
            underlyingDecimals = 18;
        } else {
            BErc20 cErc20 = BErc20(address(bToken));
            underlyingAssetAddress = cErc20.underlying();
            underlyingDecimals = EIP20Interface(cErc20.underlying()).decimals();
        }

        return
            BTokenMetadata({
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

    function bTokenMetadataAll(BToken[] calldata bTokens)
        external
        returns (BTokenMetadata[] memory)
    {
        uint256 bTokenCount = bTokens.length;
        BTokenMetadata[] memory res = new BTokenMetadata[](bTokenCount);
        for (uint256 i = 0; i < bTokenCount; i++) {
            res[i] = bTokenMetadata(bTokens[i]);
        }
        return res;
    }

    struct BTokenBalances {
        address bToken;
        uint256 balanceOf;
        uint256 borrowBalanceCurrent;
        uint256 balanceOfUnderlying;
        uint256 tokenBalance;
        uint256 tokenAllowance;
    }

    function bTokenBalances(BToken bToken, address payable account)
        public
        returns (BTokenBalances memory)
    {
        uint256 balanceOf = bToken.balanceOf(account);
        uint256 borrowBalanceCurrent = bToken.borrowBalanceCurrent(account);
        uint256 balanceOfUnderlying = bToken.balanceOfUnderlying(account);
        uint256 tokenBalance;
        uint256 tokenAllowance;

        if (birdareStrings(bToken.symbol(), "bBNB")) {
            tokenBalance = account.balance;
            tokenAllowance = account.balance;
        } else {
            BErc20 cErc20 = BErc20(address(bToken));
            EIP20Interface underlying = EIP20Interface(cErc20.underlying());
            tokenBalance = underlying.balanceOf(account);
            tokenAllowance = underlying.allowance(account, address(bToken));
        }

        return
            BTokenBalances({
                bToken: address(bToken),
                balanceOf: balanceOf,
                borrowBalanceCurrent: borrowBalanceCurrent,
                balanceOfUnderlying: balanceOfUnderlying,
                tokenBalance: tokenBalance,
                tokenAllowance: tokenAllowance
            });
    }

    function bTokenBalancesAll(
        BToken[] calldata bTokens,
        address payable account
    ) external returns (BTokenBalances[] memory) {
        uint256 bTokenCount = bTokens.length;
        BTokenBalances[] memory res = new BTokenBalances[](bTokenCount);
        for (uint256 i = 0; i < bTokenCount; i++) {
            res[i] = bTokenBalances(bTokens[i], account);
        }
        return res;
    }

    struct BTokenUnderlyingPrice {
        address bToken;
        uint256 underlyingPrice;
    }

    function bTokenUnderlyingPrice(BToken bToken)
        public
        returns (BTokenUnderlyingPrice memory)
    {
        BControllerLensInterface bController =
            BControllerLensInterface(address(bToken.bController()));
        PriceOracle priceOracle = bController.oracle();

        return
            BTokenUnderlyingPrice({
                bToken: address(bToken),
                underlyingPrice: priceOracle.getUnderlyingPrice(bToken)
            });
    }

    function bTokenUnderlyingPriceAll(BToken[] calldata bTokens)
        external
        returns (BTokenUnderlyingPrice[] memory)
    {
        uint256 bTokenCount = bTokens.length;
        BTokenUnderlyingPrice[] memory res =
            new BTokenUnderlyingPrice[](bTokenCount);
        for (uint256 i = 0; i < bTokenCount; i++) {
            res[i] = bTokenUnderlyingPrice(bTokens[i]);
        }
        return res;
    }

    struct AccountLimits {
        BToken[] markets;
        uint256 liquidity;
        uint256 shortfall;
    }

    function getAccountLimits(
        BControllerLensInterface bController,
        address account
    ) public returns (AccountLimits memory) {
        (uint256 errorCode, uint256 liquidity, uint256 shortfall) =
            bController.getAccountLiquidity(account);
        require(errorCode == 0);

        return
            AccountLimits({
                markets: bController.getAssetsIn(account),
                liquidity: liquidity,
                shortfall: shortfall
            });
    }

    struct BirdBalanceMetadata {
        uint256 balance;
    }

    function getBirdBalanceMetadata(BirdPlus birdPlus, address account)
        external
        view
        returns (BirdBalanceMetadata memory)
    {
        return BirdBalanceMetadata({balance: birdPlus.balanceOf(account)});
    }

    struct BirdBalanceMetadataExt {
        uint256 balance;
        uint256 allocated;
    }

    function getBirdBalanceMetadataExt(
        BirdPlus birdPlus,
        BControllerLensInterface bController,
        address account
    ) external returns (BirdBalanceMetadataExt memory) {
        uint256 balance = birdPlus.balanceOf(account);
        bController.claimBirdPlus(account);
        uint256 newBalance = birdPlus.balanceOf(account);
        uint256 accrued = bController.birdAccrued(account);
        uint256 total = add(accrued, newBalance, "sum birdPlus total");
        uint256 allocated = sub(total, balance, "sub allocated");

        return BirdBalanceMetadataExt({balance: balance, allocated: allocated});
    }

    function birdareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function add(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, errorMessage);
        return c;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;
        return c;
    }
}
