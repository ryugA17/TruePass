// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EventTicketNFT is ERC721, Ownable2Step, ReentrancyGuard, ERC721Burnable {
    using ECDSA for bytes32;
    uint256 private _nextTokenId = 1; // ✅ Initialized to 1 to avoid zero-to-non-zero SSTORE

    struct Ticket {
        string eventName;
        string seatNumber;
        uint256 eventDate;
        bool isUsed;         // Track if ticket has been used
        string secretHash;   // Hash of TOTP secret (optional, for on-chain verification)
        string paymentId;    // Payment ID from Indian Rupee transaction
    }

    mapping(uint256 tokenId => Ticket) private _tickets;
    mapping(string => bool) private _usedOTPs; // Track used OTPs to prevent replay attacks

    // Mapping to track authorized signers for gasless minting
    mapping(address => bool) public authorizedSigners;

    // Mapping to track used payment IDs to prevent replay attacks
    mapping(string => bool) public usedPaymentIds;

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

    event PaymentReceived(address indexed buyer, string paymentId, uint256 amountInr);

    constructor() payable ERC721("EventTicket", "ETK") {
        _transferOwnership(msg.sender);
        emit ContractDeployed(msg.sender);

        // Set contract deployer as an authorized signer
        authorizedSigners[msg.sender] = true;
    }

    function mintTicket(
        address to,
        string memory eventName,
        string memory seatNumber,
        uint256 eventDate,
        string memory secretHash,
        string memory paymentId
    ) external nonReentrant onlyOwner {
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
        t.paymentId = paymentId; // Store payment ID from Indian Rupee transaction

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

    // Override transfer functions to prevent ticket resale
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        // Allow minting (from == 0) and burning (to == 0), but prevent transfers between addresses
        require(from == address(0) || to == address(0), "Ticket transfers are not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Add or remove an authorized signer for gasless minting
     * @param signer Address to authorize or deauthorize
     * @param isAuthorized Whether the address should be authorized
     */
    function setAuthorizedSigner(address signer, bool isAuthorized) external onlyOwner {
        require(signer != address(0), "Invalid signer address");
        authorizedSigners[signer] = isAuthorized;
    }

    /**
     * @dev Mint a ticket with a signature (gasless minting)
     * @param to Address to mint the ticket to
     * @param eventName Name of the event
     * @param seatNumber Seat number
     * @param eventDate Date of the event (timestamp)
     * @param secretHash Hash of TOTP secret
     * @param paymentId Payment ID from INR transaction
     * @param amountInr Amount in INR (for record keeping)
     * @param signature Signature from authorized signer
     */
    function mintTicketWithSignature(
        address to,
        string memory eventName,
        string memory seatNumber,
        uint256 eventDate,
        string memory secretHash,
        string memory paymentId,
        uint256 amountInr,
        bytes memory signature
    ) external nonReentrant {
        // Verify the payment ID hasn't been used before
        require(!usedPaymentIds[paymentId], "Payment ID already used");

        // Create message hash
        bytes32 messageHash = keccak256(abi.encodePacked(
            to,
            eventName,
            seatNumber,
            eventDate,
            secretHash,
            paymentId,
            amountInr
        ));

        // Convert to Ethereum signed message hash
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // Recover signer from signature
        address signer = ethSignedMessageHash.recover(signature);

        // Verify signer is authorized
        require(authorizedSigners[signer], "Invalid signature");

        // Mark payment ID as used
        usedPaymentIds[paymentId] = true;

        // Mint the ticket
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);

        // Store ticket data
        Ticket storage t = _tickets[tokenId];
        t.eventName = eventName;
        t.seatNumber = seatNumber;
        t.eventDate = eventDate;
        t.isUsed = false;
        t.secretHash = secretHash;
        t.paymentId = paymentId;

        // Emit events
        emit TicketMinted(tokenId, to, eventName, seatNumber, eventDate);
        emit PaymentReceived(to, paymentId, amountInr);
    }

    // Function to get payment ID for a ticket
    function getPaymentId(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Ticket does not exist");
        return _tickets[tokenId].paymentId;
    }
}
