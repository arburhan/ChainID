// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AuditContract {
    event ActionLogged(address indexed actor, bytes32 indexed actionType, bytes data, uint256 timestamp);

    function log(bytes32 actionType, bytes calldata data) external {
        emit ActionLogged(msg.sender, actionType, data, block.timestamp);
    }
}
