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

  let allIndexes;
  let isValidator;
  let validatorCount;

  // test index
  let indexCount = await indexContract.getIndexCount()
  console.log('indexCount: ', indexCount)

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

  allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);

  indexCount = await indexContract.getIndexCount()
  console.log('indexCount: ', indexCount)

  // test upsertValidator
  const upsertValidatorTxn = await indexContract.upsertValidator(owner.address);
  await upsertValidatorTxn.wait();
  isValidator = await indexContract.checkValidator();
  console.log('isValidator: ', isValidator);

  validatorCount = await indexContract.getValidatorCount()
  console.log('validatorCount: ', validatorCount);

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

  // test deleteValidator
  const deleteValidatorTxn = await indexContract.deleteValidator(owner.address);
  await deleteValidatorTxn.wait();
  isValidator = await indexContract.checkValidator();
  console.log('isValidator: ', isValidator);
  validatorCount = await indexContract.getValidatorCount()
  console.log('validatorCount: ', validatorCount);
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