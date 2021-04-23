pragma solidity ^0.5.16;

pragma experimental ABIEncoderV2;

import "./PriceOracle.sol";
import "./BErc20.sol";

contract SimplePriceOracle is PriceOracle {
    address public admin;
    address public pendingAdmin;
    mapping(string => address) birdTokens;
    mapping(address => uint256) prices;
    event PricePosted(
        string symbol,
        address asset,
        uint256 previousPriceMantissa,
        uint256 requestedPriceMantissa,
        uint256 newPriceMantissa
    );

    constructor() public {
        admin = msg.sender;
    }

    function initialiseTokens(string[] memory symbols, address[] memory bTokens)
        public
    {
        // Check caller = admin
        require(msg.sender == admin);
        require(symbols.length == bTokens.length);

        // Associate symbols with tokens
        for (uint256 i = 0; i < symbols.length; i++) {
            birdTokens[symbols[i]] = bTokens[i];
        }
    }

    function postPrices(string[] memory symbols, uint256[] memory priceMantissa)
        public
    {
        // Check caller = admin
        require(msg.sender == admin);
        require(symbols.length == priceMantissa.length);

        // Post prices
        for (uint256 i = 0; i < symbols.length; i++) {
            if (compareStrings(symbols[i], "BNB")) {
                setDirectPrice(
                    address(birdTokens[symbols[i]]),
                    priceMantissa[i]
                );
            } else {
                setUnderlyingPrice(
                    BToken(birdTokens[symbols[i]]),
                    priceMantissa[i]
                );
            }
        }
    }

    function getUnderlyingPrice(BToken bToken) public view returns (uint256) {
        if (compareStrings(bToken.symbol(), "bBNB")) {
            return prices[address(bToken)];
        } else {
            return prices[address(BErc20(address(bToken)).underlying())];
        }
    }

    function setUnderlyingPrice(BToken bToken, uint256 underlyingPriceMantissa)
        public
    {
        // Check caller = admin
        require(msg.sender == admin);

        address asset = address(BErc20(address(bToken)).underlying());

        emit PricePosted(
            bToken.symbol(),
            address(bToken),
            prices[asset],
            underlyingPriceMantissa,
            underlyingPriceMantissa
        );
        prices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint256 price) public {
        // Check caller = admin
        require(msg.sender == admin);

        emit PricePosted("bBNB", asset, prices[asset], price, price);
        prices[asset] = price;
    }

    // v1 price oracle interface for use as backing of proxy
    function assetPrices(address asset) external view returns (uint256) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function _setPendingAdmin(address newPendingAdmin) public {
        // Check caller = admin
        require(msg.sender == admin);

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;
    }

    function _acceptAdmin() public {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == pendingAdmin && msg.sender != address(0));

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);
    }
}
