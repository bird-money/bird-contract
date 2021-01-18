pragma solidity ^0.5.16;

contract BirdOracleInterface {

  function newChainRequest (
    string memory _url,
    string memory _key
  ) public;

  /**
   * Off-Chain oracle to update its consensus answer
   */
  function updatedChainRequest (
    uint _id,
    uint _valueResponse
  ) public;

  /**
   * access to saved ratings after Oracle consensus
   */
  function getRating(address _addr) public view returns (uint);

  function getRating(string memory _str) public view returns (uint);

  function getRating() public view returns (uint);
}