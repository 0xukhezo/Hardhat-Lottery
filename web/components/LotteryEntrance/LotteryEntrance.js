import React, { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../../constants"
import { ethers } from "ethers"

function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const [entranceFee, setEntranceFee] = useState()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: getEntraenceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntraenceFee",
        params: {},
    })

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    async function updateUIValues() {
        const entranceFeeFromCall = (await getEntraenceFee()).toString()
        setEntranceFee(entranceFeeFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <>
            {raffleAddress && entranceFee !== undefined ? (
                <div>
                    Entrance Fee {ethers.utils.formatEther(entranceFee)} ETH
                    <button onClick={async () => await enterRaffle()}>
                        Enter Raffle
                    </button>
                </div>
            ) : (
                <div>No raffle address detected</div>
            )}
        </>
    )
}

export default LotteryEntrance
