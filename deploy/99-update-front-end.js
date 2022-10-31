const { network } = require("hardhat")
const {
    frontEndContractsFile,
    frontEndAbiFile,
} = require("../helper-hardhat-config")
const fs = require("fs")

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
    fs.writeFileSync(frontEndAbiFile, JSON.stringify(raffle.abi))
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

    const DEPLOYED_ADDRESS_FILE_RAFFLE = `./deployments/${chainIdNetwork}/Raffle.json`

    const contractDeployedAddress = JSON.parse(
        fs.readFileSync(DEPLOYED_ADDRESS_FILE_RAFFLE, "utf8")
    )

    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
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
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
