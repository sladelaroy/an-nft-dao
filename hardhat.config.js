const path = require('path');
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: path.resolve(__dirname, './.env') });

// const { MNEMONIC, INFURA_PROJECT_ID } = {"purpose story artwork beyond execute west bless kingdom fine much affair planet", };

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: { mnemonic: process.env.MNEMONIC }
    }
  },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY
  // }
};
