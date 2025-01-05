const path = require('path');
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: path.resolve(__dirname, './.env') });

const MNEMONIC = "purpose story artwork beyond execute west bless kingdom fine much affair planet";

const INFURA_PROJECT_ID = "4e6abfe74ec3487da3f227fbcd7ba61d";
// const { MNEMONIC, INFURA_PROJECT_ID } = {"purpose story artwork beyond execute west bless kingdom fine much affair planet", };

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: { mnemonic: MNEMONIC }
    }
  },
  // etherscan: {
  //   apiKey: ETHERSCAN_API_KEY
  // }
};
