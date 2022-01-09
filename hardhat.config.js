/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const fs = require('fs')

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
 mumbai: {
   url: `https://polygon-mumbai.infura.io/v3/${process.env.PROJECT_ID}`,
   accounts: [proces.env.PRIVATE_KEY]
 },
  mainnet: {
    url: `https://polygon-mainnet.infura.io/v3/${process.env.PROJECT_ID}`,
    accounts: [process.env.PRIVATE_KEY]
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