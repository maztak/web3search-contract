// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract IndexPortal {
    uint256 totalIndexes;
    event NewIndex(
        address indexed indexer, 
        uint256 timestamp, 
        string url, 
        string domain, 
        string sitename,
        string description,
        string[] tags,
        string[] approvers,
        string[] rejectors
    );

    struct SiteIndex {
        address indexer;
        uint256 timestamp;
        string url;
        string domain;
        string sitename;
        string description;
        string[] tags;
        string[] approvers;
        string[] rejectors;
    }

    SiteIndex[] public indexes;

    constructor() payable {
        console.log("We have been constructed!");
    }    

    function index(
            string memory _url, 
            string memory _domain, 
            string memory _sitename, 
            string memory _description, 
            string[] memory _tags,
            string[] memory _approvers,
            string[] memory _rejectors
        ) public {
        totalIndexes += 1;
        console.log("%s indexd w/ domain %s", msg.sender, _domain);
        indexes.push(SiteIndex(msg.sender, block.timestamp, _url, _domain, _sitename, _description, _tags, _approvers, _rejectors));
        
        emit NewIndex(msg.sender, block.timestamp, _url, _domain, _sitename, _description, _tags, _approvers, _rejectors);

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