// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract IdentityContract is Ownable, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");

    struct DID {
        address owner;
        bytes32 profileHash; // hash of off-chain encrypted profile
        uint256 registeredAt;
    }

    mapping(address => DID) public didOf;

    event DIDRegistered(address indexed owner, bytes32 profileHash);
    event DIDUpdated(address indexed owner, bytes32 profileHash);
    event IssuerAdded(address indexed account);
    event IssuerRemoved(address indexed account);

    constructor(address initialOwner) Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(GOVERNMENT_ROLE, initialOwner);
    }

    function registerDID(bytes32 profileHash) external {
        require(didOf[msg.sender].owner == address(0), "DID exists");
        didOf[msg.sender] = DID({ owner: msg.sender, profileHash: profileHash, registeredAt: block.timestamp });
        emit DIDRegistered(msg.sender, profileHash);
    }

    function updateDID(bytes32 newProfileHash) external {
        require(didOf[msg.sender].owner == msg.sender, "Not owner");
        didOf[msg.sender].profileHash = newProfileHash;
        emit DIDUpdated(msg.sender, newProfileHash);
    }

    function addIssuer(address account) external onlyRole(GOVERNMENT_ROLE) {
        _grantRole(ISSUER_ROLE, account);
        emit IssuerAdded(account);
    }

    function removeIssuer(address account) external onlyRole(GOVERNMENT_ROLE) {
        _revokeRole(ISSUER_ROLE, account);
        emit IssuerRemoved(account);
    }

    function isRegistered(address user) external view returns (bool) {
        return didOf[user].owner != address(0);
    }
}
