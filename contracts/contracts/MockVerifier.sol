// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockVerifier {
    // This mock accepts any non-empty proof and any signalHash for demo purposes
    function verify(bytes calldata proof, bytes32 /*signalHash*/) external pure returns (bool) {
        return proof.length > 0;
    }
}
