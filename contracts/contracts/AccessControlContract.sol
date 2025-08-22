// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IVerifier {
    function verify(bytes calldata proof, bytes32 signalHash) external view returns (bool);
}

contract AccessControlContract is Ownable {
    using ECDSA for bytes32;

    struct AccessRequest {
        address requester;
        address subject;
        bytes32 purposeHash; // hash(purpose, fields)
        uint256 timestamp;
        bool approved;
    }

    mapping(bytes32 => AccessRequest) public requestOf; // requestId => request
    IVerifier public zkVerifier; // optional

    event AccessRequested(bytes32 indexed requestId, address indexed requester, address indexed subject, bytes32 purposeHash);
    event AccessApproved(bytes32 indexed requestId, address indexed subject);

    constructor(address owner_) Ownable(owner_) {}

    function setVerifier(address verifier) external onlyOwner {
        zkVerifier = IVerifier(verifier);
    }

    function requestAccess(address subject, bytes32 purposeHash) external returns (bytes32) {
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, subject, purposeHash, block.timestamp));
        requestOf[requestId] = AccessRequest({
            requester: msg.sender,
            subject: subject,
            purposeHash: purposeHash,
            timestamp: block.timestamp,
            approved: false
        });
        emit AccessRequested(requestId, msg.sender, subject, purposeHash);
        return requestId;
    }

    // Subject consents by signing EIP-191: keccak256("\x19Ethereum Signed Message:\n32" || requestId)
    function approve(bytes32 requestId, bytes calldata signature, bytes calldata optionalProof) external {
        AccessRequest storage req = requestOf[requestId];
        require(req.subject == msg.sender, "Not subject");
        require(!req.approved, "Already approved");
        bytes32 ethHash = ECDSA.toEthSignedMessageHash(requestId);
        address signer = ECDSA.recover(ethHash, signature);
        require(signer == msg.sender, "Bad signature");
        if (address(zkVerifier) != address(0) && optionalProof.length > 0) {
            require(zkVerifier.verify(optionalProof, req.purposeHash), "Invalid zk proof");
        }
        req.approved = true;
        emit AccessApproved(requestId, msg.sender);
    }

    function isApproved(bytes32 requestId) external view returns (bool) {
        return requestOf[requestId].approved;
    }
}
