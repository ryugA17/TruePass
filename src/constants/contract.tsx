export const CONTRACT_ADDRESS = '0x83412990439483714A5ab3CBa7a03AFb7363508C'; // replace with your actual address

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "eventName", "type": "string" },
      { "internalType": "string", "name": "seatNumber", "type": "string" },
      { "internalType": "uint256", "name": "eventDate", "type": "uint256" }
    ],
    "name": "mintTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
