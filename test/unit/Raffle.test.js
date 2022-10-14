const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async function () {
          let raffle,
              vrfCoordinatorV2Mock,
              raffleEntranceFee,
              deployer,
              interval
          const chainId = network.config.chainId

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              const contractAddress = await deployments.fixture(["all"])
              raffle = await ethers.getContractAt(
                  "Raffle",
                  contractAddress.Raffle.address,
                  deployer.address
              )
              vrfCoordinatorV2Mock = await ethers.getContractAt(
                  "VRFCoordinatorV2Mock",
                  contractAddress.VRFCoordinatorV2Mock.address,
                  deployer.address
              )
              raffleEntranceFee = await raffle.getEntraenceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", async function () {
              it("Initializesthe the raffle correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(
                      interval.toString(),
                      networkConfig[chainId]["interval"]
                  )
              })
          })

          describe("enterRaffle", async function () {
              it("Revert when you don´t pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered"
                  )
              })
              it("Records players when they enter the raffle", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playersFromContract = await raffle.getPlayers(0)
                  assert.equal(playersFromContract, deployer)
              })
              it("Emit event on enter", async function () {
                  await expect(
                      raffle.enterRaffle({ value: raffleEntranceFee })
                  ).to.emit(raffle, "RaffleEnter")
              })
              it("Doesn't allow entrance when raffle is calculating", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [
                      interval.toNumber() + 1,
                  ])
                  await network.provider.request({
                      method: "evm_mine",
                      params: [],
                  })
                  await expect(
                      raffle.enterRaffle({ value: raffleEntranceFee })
                  ).to.be.revertedWith("Raffle__NotOpen")
              })
          })
      })
