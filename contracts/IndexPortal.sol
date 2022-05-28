// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";


contract IndexPortal is Ownable, Pausable {
    uint256 indexCount;
    uint256 validatorCount;

    event NewIndex(
        address indexed indexer, 
        uint256 timestamp, 
        string url, 
        string domain, 
        string sitename,
        string description,
        string[] tags,
        address[] approvers,
        address[] rejectors
    );

    struct SiteIndex {
        address indexer;
        uint256 timestamp;
        string url;
        string domain;
        string sitename;
        string description;
        string[] tags;
        address[] approvers;
        address[] rejectors;
    }

    SiteIndex[] public indexes;
    mapping(address => bool) public isValidator;

    constructor() payable {
        console.log("We have been constructed!");
    }    

    function index(
            string memory _url, 
            string memory _domain, 
            string memory _sitename, 
            string memory _description, 
            string[] memory _tags,
            address[] memory _approvers,
            address[] memory _rejectors
        ) public {
        indexCount += 1;
        console.log("%s indexd w/ domain %s", msg.sender, _domain);
        indexes.push(SiteIndex(msg.sender, block.timestamp, _url, _domain, _sitename, _description, _tags, _approvers, _rejectors));
        
        emit NewIndex(msg.sender, block.timestamp, _url, _domain, _sitename, _description, _tags, _approvers, _rejectors);

        // 「index」を送ってくれたユーザーに0.0001ETHを送る
        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function upsertValidator(address _account) external onlyOwner {
        isValidator[_account] = true;
        validatorCount++;
    }

    function deleteValidator(address _account) external onlyOwner {
        isValidator[_account] = false;
        validatorCount--;
    }

    modifier onlyValidator() {
        require(isValidator[msg.sender], 'You are not validator');
        _;                                                                                                                                                                                                                                         
    }

    function approve(uint _indexId) external onlyValidator {
        for (uint j = 0; j < indexes[_indexId].approvers.length; j++) {
            if (indexes[_indexId].approvers[j] == msg.sender) {
                return;
            }
        }    
        indexes[_indexId].approvers.push(msg.sender);

        for (uint j = 0; j < indexes[_indexId].rejectors.length; j++) {
            if (indexes[_indexId].rejectors[j] == msg.sender) {
                deleteRejector(_indexId, j);
                return;
            }
        }
    }

    function reject(uint _indexId) external onlyValidator {
        for (uint j = 0; j < indexes[_indexId].rejectors.length; j++) {
            if (indexes[_indexId].rejectors[j] == msg.sender) {
                return;
            }
        }
        indexes[_indexId].rejectors.push(msg.sender);

        for (uint j = 0; j < indexes[_indexId].approvers.length; j++) {
            if (indexes[_indexId].approvers[j] == msg.sender) {
                deleteApprover(_indexId, j);
                return;
            }
        }
    }

    function deleteApprover(uint _siteIndexId, uint _approverIndex) internal {
        for(uint i = _approverIndex; i < indexes[_siteIndexId].approvers.length-1; i++){
            indexes[_siteIndexId].approvers[i] = indexes[_siteIndexId].approvers[i+1];
        }
        indexes[_siteIndexId].approvers.pop();
    }

    function deleteRejector(uint _siteIndexId, uint _rejectorIndex) internal {
        for(uint i = _rejectorIndex; i < indexes[_siteIndexId].rejectors.length-1; i++){
            indexes[_siteIndexId].rejectors[i] = indexes[_siteIndexId].rejectors[i+1];
        }
        indexes[_siteIndexId].rejectors.pop();
    }

    function getAllIndexes() public view returns (SiteIndex[] memory) {
        return indexes;
    }

    function checkValidator() public view returns (bool) {
        return isValidator[msg.sender];
    }

    function getValidatorCount() public view returns (uint256) {
        return validatorCount;
    }

    function getAllValidators() public view returns (address[] memory) {

    }

    function getIndexCount() public view returns (uint256) {
        console.log("We have %d indexes!", indexCount);
        return indexCount;
    }
}