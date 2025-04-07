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
    }

    mapping(uint256 tokenId => Ticket) private _tickets;

    event TicketMinted(
        uint256 indexed tokenId,
        address indexed to,
        string eventName,
        string seatNumber,
        uint256 eventDate
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
        uint256 eventDate
    ) external payable nonReentrant onlyOwner {
        require(to != address(0), "Invalid address");

        uint256 tokenId = _nextTokenId;
        _nextTokenId = tokenId + 1;

        _safeMint(to, tokenId);

        Ticket storage t = _tickets[tokenId];
        t.eventName = eventName;
        t.seatNumber = seatNumber;
        t.eventDate = eventDate;

        emit TicketMinted(tokenId, to, eventName, seatNumber, eventDate);
    }

    function getTicket(uint256 tokenId) external view {
    Ticket storage t = _tickets[tokenId];
    // No return, function used for access or external inspection (e.g., via call)
}

}
