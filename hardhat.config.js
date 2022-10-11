require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("solidity-coverage")

require("dotenv").config()

const GOERLI_URL_RPC = process.env.URL_RPC_GOERLI
const LOCALHOST_URL_RPC = process.env.URL_RPC_LOCALHOST
const PRIVATE_KEY_ACCOUNT_GOERLI = process.env.PRIVATE_KEY_GOERLI
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        goerli: {
            chainId: 5,
            blockConfirmations: 6,
            url: GOERLI_URL_RPC,
            accounts: [PRIVATE_KEY_ACCOUNT_GOERLI],
        },
    },
}
