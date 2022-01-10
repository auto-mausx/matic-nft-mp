/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const dotenv = require('dotenv')
dotenv.config();
const fs = require('fs')
const PROJECT_ID = process.env.PROJECT_ID
const PRIVATE_KEY = process.env.PRIVATE_KEY


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
 mumbai: {
   url: `https://polygon-mumbai.infura.io/v3/${PROJECT_ID}`,
   accounts: [PRIVATE_KEY]
 },
  mainnet: {
    url: `https://polygon-mainnet.infura.io/v3/${PROJECT_ID}`,
    accounts: [PRIVATE_KEY]
  },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}