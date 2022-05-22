// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract IndexPortal {
    uint256 totalIndexes;
    event NewIndex(address indexed from, uint256 timestamp, string domain, string sitename, string[] tags);

    struct SiteIndex {
        address indexer;
        uint256 timestamp;
        string domain;
        string sitename;
        string[] tags;
    }

    SiteIndex[] indexes;

    constructor() payable {
        console.log("We have been constructed!");
    }    

    function index(string memory _domain, string memory _sitename, string[] memory _tags) public {
        totalIndexes += 1;
        console.log("%s indexd w/ domain %s", msg.sender, _domain);
        indexes.push(SiteIndex(msg.sender,  block.timestamp, _domain, _sitename, _tags));
        
        emit NewIndex(msg.sender, block.timestamp, _domain, _sitename, _tags);

        // 「👋（index）」を送ってくれたユーザーに0.0001ETHを送る
        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllIndexes() public view returns (SiteIndex[] memory) {
        return indexes;
    }

    function getTotalIndexes() public view returns (uint256) {
        console.log("We have %d total indexes!", totalIndexes);
        return totalIndexes;
    }
}