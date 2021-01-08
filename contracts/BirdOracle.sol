/**
 *Submitted for verification at Etherscan.io on 2020-12-26
*/

pragma solidity ^0.5.16;

 // SPDX-License-Identifier: MIT
/**
Bird On-chain Oracle to confirm rating with 2+ consensus before update using the off-chain API https://www.bird.money/docs
*/

contract BirdOracle {
  BirdRequest[] onChainRequests; //keep track of list of on-chain requests
  uint minConsensus = 2; //minimum number of consensus before confirmation 
  uint birdNest = 3; // bird consensus count
  uint trackId = 0; //increament id's

    /**
   * Bird Standard API Request
   * id: "1"
   * url: "https://www.bird.money/analytics/address/ethaddress"
   * key: "bird_rating"
   * value: "0.4" => 400000000000000000
   * response: response from off-chain oracles 
   * nest: approved off-chain oracles nest/addresses and keep track of vote (1=not voted, 2=voted)
   */
  struct BirdRequest {
    uint id;   
    string url; 
    string key; 
    uint value;  
    bool resolved;
    mapping(uint => uint) response;
    mapping(address => uint) nest; 
  }
  
    /**
   * Bird Standard API Request
   * Off-Chain-Request from outside the blockchain 
   */
  event OffChainRequest (
    uint id,
    string url,
    string key
  );

    /**
   * To call when there is consensus on final result
   */
   
  event UpdatedRequest (
    uint id,
    string url,
    string key,
    uint value
  );

  // container for the ratings
  mapping (string => uint) ratings;

  mapping (address => uint) userRatings;

  function newChainRequest (
    string memory _url,
    string memory _key
  )
  public   
  {
    uint lenght = onChainRequests.push(BirdRequest(trackId, _url, _key, 0, false));
    BirdRequest storage r = onChainRequests[lenght-1];

    /**
   * trusted oracles in bird nest
   */
    address trustedBird1 = address(0x35fA8692EB10F87D17Cd27fB5488598D33B023E5);
    address trustedBird2 = address(0x58Fd79D34Edc6362f92c6799eE46945113A6EA91);
    address trustedBird3 = address(0x0e4338DFEdA53Bc35467a09Da483410664d34e88);
    address trustedBird4 = address(0x6f20FEeECcd51783779Ca10431b60B15f83d06F1);

    
    /**
   * track votes
   */
    r.nest[trustedBird1] = 1;
    r.nest[trustedBird2] = 1;
    r.nest[trustedBird3] = 1;
    r.nest[trustedBird4] = 1;

    /**
   * Off-Chain event trigger
   */
    emit OffChainRequest (
      trackId,
      _url,
      _key
    );

    /**
   * Off-Chain event trigger
   */
    trackId++;
  }

  //called by the oracle to record its answer
    /**
   * Off-Chain oracle to update its consensus answer
   */
  function updatedChainRequest (
    uint _id,
    uint _valueResponse
  ) public {

    BirdRequest storage trackRequest = onChainRequests[_id];

    if (trackRequest.resolved)
      return;

    /**
   * To confirm an address/oracle is part of the trusted nest and has not voted
   */
    if(trackRequest.nest[address(msg.sender)] == 1){
        
        /**
       * change vote value to = 2 from 1
       */
      trackRequest.nest[msg.sender] = 2;
      
        /**
       * Loop through responses for empty position, save the response
       * TODO: refactor
       */
      uint tmpI = 0;
      bool found = false;
      while(!found) {
          
        if(trackRequest.response[tmpI] == 0){
          found = true;
          trackRequest.response[tmpI] = _valueResponse;
        }
        tmpI++;
      }

      uint currentConsensusCount = 0;
      
        /**
       * Loop through list and check if min consensus has been reached
       */
      
      for(uint i = 0; i < birdNest; i++){
        uint a = trackRequest.response[i];
        uint b = _valueResponse;

        if(a == b){
          currentConsensusCount++;
          if(currentConsensusCount >= minConsensus){
            trackRequest.value = _valueResponse;

            trackRequest.resolved = true;

            // Save value and user information into the bird rating container
            ratings[trackRequest.url] = trackRequest.value;
            

            emit UpdatedRequest (
              trackRequest.id,
              trackRequest.url,
              trackRequest.key,
              trackRequest.value
            );
          }
        }
      }
    }
  }

  /**
   * access to saved ratings after Oracle consensus
   */
  function getRating(string memory _url) public view returns (uint) {
        return ratings[_url];
  }

  function updateRating(address _address, uint value) public {
    userRatings[_address] = value;
  }
  /**
   * get rating by address
   */
  function getAddressRating(address _address) public view returns (uint){
    return userRatings[_address];
  }

  function concatString(string memory _a, string memory _b) internal pure returns (string memory) {
    return string(abi.encodePacked(_a,_b));
  }

}