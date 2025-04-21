// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EventTicketNFT is ERC721, Ownable2Step, ReentrancyGuard {
    uint256 private _nextTokenId = 1; // ✅ Initialized to 1 to avoid zero-to-non-zero SSTORE

    struct Ticket {
        string eventName;
        string seatNumber;
        uint256 eventDate;
        bool isUsed;         // Track if ticket has been used
        string secretHash;   // Hash of TOTP secret (optional, for on-chain verification)
    }

    mapping(uint256 tokenId => Ticket) private _tickets;
    mapping(string => bool) private _usedOTPs; // Track used OTPs to prevent replay attacks

    event TicketMinted(
        uint256 indexed tokenId,
        address indexed to,
        string eventName,
        string seatNumber,
        uint256 eventDate
    );

    event TicketValidated(
        uint256 indexed tokenId,
        address indexed validator,
        uint256 timestamp
    );

    event ContractDeployed(address indexed owner);

    constructor() payable ERC721("EventTicket", "ETK") {
        _transferOwnership(msg.sender);
        emit ContractDeployed(msg.sender);
    }

    function mintTicket(
        address to,
        string memory eventName,
        string memory seatNumber,
        uint256 eventDate,
        string memory secretHash
    ) external payable nonReentrant onlyOwner {
        require(to != address(0), "Invalid address");

        uint256 tokenId = _nextTokenId;
        _nextTokenId = tokenId + 1;

        _safeMint(to, tokenId);

        Ticket storage t = _tickets[tokenId];
        t.eventName = eventName;
        t.seatNumber = seatNumber;
        t.eventDate = eventDate;
        t.isUsed = false;
        t.secretHash = secretHash; // Store hash of TOTP secret

        emit TicketMinted(tokenId, to, eventName, seatNumber, eventDate);
    }

    function getTicket(uint256 tokenId) external view returns (
        string memory eventName,
        string memory seatNumber,
        uint256 eventDate,
        bool isUsed
    ) {
        require(_exists(tokenId), "Ticket does not exist");
        Ticket storage t = _tickets[tokenId];
        return (t.eventName, t.seatNumber, t.eventDate, t.isUsed);
    }

    function validateTicket(uint256 tokenId, string memory otpHash) external {
        require(_exists(tokenId), "Ticket does not exist");
        require(!_tickets[tokenId].isUsed, "Ticket already used");
        require(!_usedOTPs[otpHash], "OTP already used");

        // Mark ticket as used
        _tickets[tokenId].isUsed = true;

        // Mark OTP as used to prevent replay attacks
        _usedOTPs[otpHash] = true;

        // Emit validation event
        emit TicketValidated(tokenId, msg.sender, block.timestamp);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId < _nextTokenId && tokenId > 0;
    }
}
