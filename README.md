# TruePass - NFT Marketplace

A modern NFT marketplace built with React, TypeScript, and Ethereum smart contracts.

## Project Overview

TruePass is a decentralized marketplace for buying, selling, and trading NFTs. The platform connects to Ethereum wallets and allows users to interact with smart contracts to manage their digital assets.

## Features

- Browse and search NFT collections
- Connect to Ethereum wallets
- Buy, sell, and trade NFTs
- View transaction history
- User profiles and collections

## Tech Stack

- **Frontend**: React, TypeScript, Material UI
- **Blockchain**: Ethereum, Ethers.js
- **Authentication**: Firebase
- **Animations**: GSAP

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Ethereum wallet

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/TruePass.git
   cd TruePass
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_CONTRACT_ADDRESS=your_contract_address
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Development Workflow

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run clean` - Remove build artifacts
- `npm run build:prod` - Clean and build for production

### Code Structure

- `/src` - Source code
  - `/assets` - Static assets
  - `/components` - React components
  - `/contracts` - Smart contract ABIs
  - `/hooks` - Custom React hooks
  - `/pages` - Page components
  - `/services` - API and service functions
  - `/store` - State management
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/public` - Public assets
- `/contracts` - Smart contract source code

## Deployment

### Building for Production

```bash
npm run build:prod
# or
yarn build:prod
```

The build artifacts will be stored in the `build/` directory.

### Deploying to Hosting

The project can be deployed to various hosting platforms:

- Firebase Hosting
- Netlify
- Vercel
- AWS Amplify

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for smart contract libraries
- [Ethers.js](https://docs.ethers.io/) for Ethereum interactions
- [React](https://reactjs.org/) for the UI framework
