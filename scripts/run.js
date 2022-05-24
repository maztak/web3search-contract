const main = async () => {
  const indexContractFactory = await hre.ethers.getContractFactory("IndexPortal");
  const indexContract = await indexContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await indexContract.deployed();
  console.log("Contract deployed to:", indexContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    indexContract.address
  );
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

  // test index
  let indexTxn = await indexContract.index("https://uniswap.org", "uniswap.org", 'Uniswap');
  await indexTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(indexContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

  let allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();