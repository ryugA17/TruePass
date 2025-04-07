export const CONTRACT_ADDRESS = '0xf206d3e606b510c532bb67f6987b17696668f7ac'; // replace with your actual address

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
