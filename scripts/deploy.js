const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Load environment variables
const mnemonic = process.env.MNEMONIC;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

// Initialize provider and web3 instance
const provider = new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/${infuraProjectId}`);
const web3 = new Web3(provider);

// Function to deploy a contract
const deployContract = async (contractName, abi, bytecode, args = []) => {
  const accounts = await web3.eth.getAccounts();
  const balance = await web3.eth.getBalance(accounts[0]);
  console.log(`Deploying ${contractName} from account:`, accounts[0]);
  console.log(`Account balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);

  const contract = new web3.eth.Contract(abi);
  const deployTx = contract.deploy({ data: bytecode, arguments: args });

  const deployedContract = await deployTx.send({
    from: accounts[0],
    gas: '3000000', // Adjust gas limit as needed
    gasPrice: web3.utils.toWei('5', 'gwei') // Adjust gas price as needed
  });

  console.log(`${contractName} deployed to:`, deployedContract.options.address);
  return deployedContract.options.address;
};

const deploy = async () => {
  const contractsDir = path.resolve(__dirname, '../artifacts/contracts');
  const addresses = {};

  // Deploy MemersNFT
  const memersNFTPath = path.resolve(contractsDir, 'MemersNFT.sol/MemersNft.json');
  const { abi: memersNFTAbi, bytecode: memersNFTBytecode } = JSON.parse(fs.readFileSync(memersNFTPath, 'utf8'));
  const memersNFTAddress = await deployContract('MemersNFT', memersNFTAbi, memersNFTBytecode);
  addresses.MemersNFT = memersNFTAddress;

  // Deploy DemoNFTMarketplace
  const demoNFTMarketplacePath = path.resolve(contractsDir, 'DemoNFTMarketplace.sol/DemoNFTMarketplace.json');
  const { abi: demoNFTMarketplaceAbi, bytecode: demoNFTMarketplaceBytecode } = JSON.parse(fs.readFileSync(demoNFTMarketplacePath, 'utf8'));
  const demoNFTMarketplaceAddress = await deployContract('DemoNFTMarketplace', demoNFTMarketplaceAbi, demoNFTMarketplaceBytecode);
  addresses.DemoNFTMarketplace = demoNFTMarketplaceAddress;

  // Deploy MemersDAO with addresses of MemersNFT and DemoNFTMarketplace
  const memersDAOPath = path.resolve(contractsDir, 'MemersDAO.sol/MemersDAO.json');
  const { abi: memersDAOAbi, bytecode: memersDAOBytecode } = JSON.parse(fs.readFileSync(memersDAOPath, 'utf8'));
  const memersDAOAddress = await deployContract('MemersDAO', memersDAOAbi, memersDAOBytecode, [demoNFTMarketplaceAddress, memersNFTAddress]);
  addresses.MemersDAO = memersDAOAddress;

  // Export addresses to a JSON file
  const addressesPath = path.resolve(__dirname, '../deployedAddresses.json');
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

  provider.engine.stop();
};

deploy().catch((error) => {
  console.error(error);
  process.exit(1);
});