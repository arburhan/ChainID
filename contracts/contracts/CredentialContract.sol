// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IIdentityContract {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function ISSUER_ROLE() external view returns (bytes32);
}

contract CredentialContract is ERC721URIStorage, AccessControl {
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");

    IIdentityContract public identity;
    uint256 public nextTokenId;
    mapping(uint256 => bytes32) public credentialHashOf; // hash of credential payload

    event CredentialIssued(uint256 indexed tokenId, address indexed to, bytes32 credentialHash);
    event CredentialRevoked(uint256 indexed tokenId);

    constructor(address identityAddress) ERC721("ChainID Credential", "CIDC") {
        identity = IIdentityContract(identityAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REVOKER_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function issue(address to, bytes32 credentialHash, string memory uri) external returns (uint256) {
        require(identity.hasRole(identity.ISSUER_ROLE(), msg.sender), "Not issuer");
        uint256 tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        credentialHashOf[tokenId] = credentialHash;
        emit CredentialIssued(tokenId, to, credentialHash);
        return tokenId;
    }

    function revoke(uint256 tokenId) external onlyRole(REVOKER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "No token");
        _burn(tokenId);
        emit CredentialRevoked(tokenId);
    }
}
