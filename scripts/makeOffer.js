require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");
const {
  ethers: { utils },
} = hre;
const deployedAddresses = require("../helpers/deployedAddress.json");

async function main() {
  const signers = await ethers.getSigners();
  let account1 = signers[3];
  let account2 = signers[4];
  const marketplace = await ethers.getContractAt(
    "Marketplace",
    deployedAddresses.MarketPlace
  );

  const dummyNFT = await hre.ethers.getContractAt(
    "DummyNFT",
    deployedAddresses.DummyNFT
  );

  const offerAmount = utils.parseEther("0.5");
  const tx1 = await marketplace
    .connect(account1)
    .makeOffer(deployedAddresses.DummyNFT, 1, offerAmount);
  const reciept1 = await tx1.wait();
  let newBidEvent1 = reciept1.events[0].args;

  console.log(
    `New offer of ${utils.formatEther(newBidEvent1.price)}Weth recieved for ${
      newBidEvent1.erc721
    } with tokenId ${newBidEvent1.tokenId.toNumber()}  from ${
      newBidEvent1.seller
    }`
  );
  await dummyNFT.connect(account1).approve(deployedAddresses.MarketPlace, 1);

  const tx2 = await marketplace
    .connect(account2)
    .makeOffer(deployedAddresses.DummyNFT, 2, offerAmount);
  const reciept2 = await tx2.wait();
  let newBidEvent2 = reciept2.events[0].args;

  console.log(
    `New offer of ${utils.formatEther(newBidEvent2.price)}Weth recieved for ${
      newBidEvent2.erc721
    } with tokenId ${newBidEvent2.tokenId.toNumber()}  from ${
      newBidEvent2.seller
    }`
  );
  await dummyNFT.connect(account2).approve(deployedAddresses.MarketPlace, 2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
