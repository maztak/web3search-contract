const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying with private keys of: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const indexContractFactory = await hre.ethers.getContractFactory("IndexPortal");

  console.log("Now deploying..");

  const indexContract = await indexContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await indexContract.deployed();

  console.log("IndexPortal address: ", indexContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();