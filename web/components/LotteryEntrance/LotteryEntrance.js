import React, { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()

    const [entranceFee, setEntranceFee] = useState("0")
    const [players, setPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState()

    console.log(players, recentWinner)

    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: getEntraenceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntraenceFee",
        params: {},
    })

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const updateUIValues = async () => {
        const entranceFeeFromCall = (await getEntraenceFee()).toString()
        const playersFromCall = (await getNumPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setPlayers(playersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUIValues()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <>
            {raffleAddress ? (
                <div>
                    <p>
                        Entrance Fee: {ethers.utils.formatEther(entranceFee)}
                        ETH
                    </p>
                    <p>Numer of players: {players} </p>
                    <p>Recent Winner: {recentWinner}</p>
                    <button
                        onClick={async () =>
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    >
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
