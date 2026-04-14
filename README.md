
# Arc Testnet Smart Contract Studio
**Arc Testnet Smart Contract Studio** is a comprehensive developer toolkit designed to simplify the process of writing, deploying, and managing smart contracts on the **Arc Testnet** (Circle's Layer-1 blockchain).
Arc is a next-generation L1 optimized for stablecoin finance, using USDC as its native gas token. This studio provides the necessary boilerplates, scripts, and configurations to get you started quickly.
## 🚀 Features
 * **Optimized for Arc:** Pre-configured for Arc Testnet (Chain ID: 5042002).
 * **Native USDC Gas:** Integrated workflows for handling USDC as the native gas token.
 * **Smart Contract Templates:** Includes standard templates (ERC-20, ERC-721, and specialized financial primitives).
 * **Deployment Scripts:** Easy-to-use Hardhat/Foundry scripts for seamless deployment.
 * **Developer-Friendly:** Designed for both beginners and experienced blockchain developers.
## 🛠 Network Details (Arc Testnet)
| Property | Value |
|---|---|
| **Network Name** | Arc Testnet |
| **RPC URL** | https://rpc.testnet.arc.network |
| **Chain ID** | 5042002 |
| **Currency Symbol** | USDC |
| **Block Explorer** | ArcScan |
## ⚙️ Getting Started
### Prerequisites
 * Node.js (v16.x or later)
 * npm or yarn
 * A wallet (e.g., MetaMask) with **Arc Testnet USDC** (Get some from the Circle Faucet).
### Installation
 1. Clone the repository:
   ```bash
   git clone https://github.com/CuriQusEth/Arc-Testnet-Smart-Contract-Studio.git
   cd Arc-Testnet-Smart-Contract-Studio
   
   ```
 2. Install dependencies:
   ```bash
   npm install
   
   ```
 3. Configure environment variables:
   Create a .env file in the root directory:
   ```env
   PRIVATE_KEY=your_private_key_here
   ARC_RPC_URL=https://rpc.testnet.arc.network
   
   ```
### Deployment
To deploy your contract to the Arc Testnet:
```bash
npx hardhat run scripts/deploy.js --network arcTestnet

```
## 📁 Project Structure
 * /contracts: Solidity smart contracts.
 * /scripts: Deployment and interaction scripts.
 * /test: Automated tests for your contracts.
 * hardhat.config.js: Network configurations for Arc.
## 🧪 Testing
Run the test suite to ensure everything is working correctly:
```bash
npx hardhat test

```
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
 1. Fork the Project
 2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
 3. Commit your Changes (git commit -m 'Add some AmazingFeature')
 4. Push to the Branch (git push origin feature/AmazingFeature)
 5. Open a Pull Request
## 📄 License
Distributed under the MIT License. See LICENSE for more information.
## 🌟 Acknowledgments
 * Circle for building the Arc Network.
 * The open-source blockchain community.
**Developed with ❤️ by CuriQusEth**
