const main = async () => {
  const [owner] = await ethers.getSigners();
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
  let indexTxn = await indexContract.index(
    "https://uniswap.org",
    "uniswap.org",
    'Uniswap',
    'Swap, earn, and build on the leading decentralized crypto trading protocol.',
    Array('dex', 'ethereum', 'swap'),
    Array(),
    Array()
  );
  await indexTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(indexContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

  let allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);

  // test upsertValidator
  const upsertValidatorTxn = await indexContract.upsertValidator(owner.address);
  await upsertValidatorTxn.wait();
  const isValidator = await indexContract.checkValidator();
  console.log('isValidator: ', isValidator);

  // test approve
  const approveTxn = await indexContract.approve(0);
  await approveTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log('approvers: ', allIndexes[0].approvers);
  console.log('rejectors: ', allIndexes[0].rejectors);

  // test reject
  const rejectTxn = await indexContract.reject(0);
  await rejectTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log('approvers: ', allIndexes[0].approvers);
  console.log('rejectors: ', allIndexes[0].rejectors);
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