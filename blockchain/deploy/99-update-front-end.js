const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE_PATH = "../web/constants/contractAddresses.json"
const FRONT_END_ABI_FILE_PATH = "../web/constants/abi.json"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle = await artifacts.readArtifact("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE_PATH, JSON.stringify(raffle.abi))
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    let chainIdNetwork

    switch (chainId) {
        case "5":
            chainIdNetwork = "goerli"
            break
        default:
            chainIdNetwork = "localhost"
            break
    }

    const ADDRESS_FILE_RAFFLE = `../blockchain/deployments/${chainIdNetwork}/Raffle.json`

    const contractDeployedAddress = JSON.parse(
        fs.readFileSync(ADDRESS_FILE_RAFFLE, "utf8")
    )

    const contractAddresses = JSON.parse(
        fs.readFileSync(FRONT_END_ADDRESSES_FILE_PATH, "utf8")
    )

    if (chainId in contractAddresses) {
        if (
            !contractAddresses[chainId].includes(
                contractDeployedAddress.address
            )
        ) {
            contractAddresses[chainId].push(contractDeployedAddress.address)
        }
    } else {
        contractAddresses[chainId] = [contractDeployedAddress.address]
    }
    fs.writeFileSync(
        FRONT_END_ADDRESSES_FILE_PATH,
        JSON.stringify(contractAddresses)
    )
}
module.exports.tags = ["all", "frontend"]
