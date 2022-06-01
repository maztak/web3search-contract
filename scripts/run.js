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
  let isIndexer;
  let isValidator;
  let validatorCount;
  let users;
  let indexers;
  let validators;

  // test upsertIndexer
  const upsertIndexerTxn = await indexContract.upsertIndexer(owner.address);
  await upsertIndexerTxn.wait();
  isIndexer = await indexContract.checkIndexer();
  console.log('isIndexer: ', isIndexer);
  indexers = await indexContract.getAllIndexers();
  console.log('indexers: ', indexers);
  users = await indexContract.getAllUsers();
  console.log('users: ', users);

  // test index
  let indexCount = await indexContract.getIndexCount()
  console.log('indexCount: ', indexCount)

  let indexTxn = await indexContract.index(
    "https://app.uniswap.org",
    "app.uniswap.org",
    'Uniswap',
    'Swap, earn, and build on the leading decentralized crypto trading protocol.',
    Array('DEX'),
    Array('Ethereum'),
    Array('swap'),
    Array(),
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

  // test updateSitename
  const updateSitenameTxn = await indexContract.updateSitename(0, "Uniswap Interface");
  await updateSitenameTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);

  // test upsertValidator
  const upsertValidatorTxn = await indexContract.upsertValidator(owner.address);
  await upsertValidatorTxn.wait();
  isValidator = await indexContract.checkValidator();
  console.log('isValidator: ', isValidator);

  validatorCount = await indexContract.getValidatorCount()
  console.log('validatorCount: ', validatorCount);

  validators = await indexContract.getAllValidators();
  console.log('validators: ', validators);

  users = await indexContract.getAllUsers();
  console.log('users: ', users);

  // test updateDescription
  const updateDescriptionTxn = await indexContract.updateDescription(0, 'Swap or provide liquidity on the Uniswap Protocol.');
  await updateDescriptionTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);

  // test updateCategories
  const updateCategoriesTxn = await indexContract.updateCategories(0, Array('DEX', 'DeFi', 'AMM'));
  await updateCategoriesTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);

  // test updateChains
  const updateChainsTxn = await indexContract.updateChains(0, Array('Ethereum', 'Polygon', 'Optimizm', 'Arbitrum'));
  await updateChainsTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);
  
  // test updateTags
  const updateTagsTxn = await indexContract.updateTags(0, Array('swap', 'liquidity', 'lp', 'uni'));
  await updateTagsTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log("allIndexes: ", allIndexes);

  // test approve
  const approveTxn = await indexContract.approve(0);
  await approveTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log('approvers: ', allIndexes[0].approvers);
  console.log('rejectors: ', allIndexes[0].rejectors);
  console.log('stayers: ', allIndexes[0].stayers);

  // test reject
  const rejectTxn = await indexContract.reject(0);
  await rejectTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log('approvers: ', allIndexes[0].approvers);
  console.log('rejectors: ', allIndexes[0].rejectors);
  console.log('stayers: ', allIndexes[0].stayers);

  // test stay
  const stayTxn = await indexContract.stay(0);
  await stayTxn.wait();
  allIndexes = await indexContract.getAllIndexes();
  console.log('approvers: ', allIndexes[0].approvers);
  console.log('rejectors: ', allIndexes[0].rejectors);
  console.log('stayers: ', allIndexes[0].stayers);

  // test deleteValidator
  const deleteValidatorTxn = await indexContract.deleteValidator(owner.address);
  await deleteValidatorTxn.wait();
  isValidator = await indexContract.checkValidator();
  console.log('isValidator: ', isValidator);

  validatorCount = await indexContract.getValidatorCount()
  console.log('validatorCount: ', validatorCount);

  validators = await indexContract.getAllValidators();
  console.log('validators: ', validators);

  users = await indexContract.getAllUsers();
  console.log('users: ', users);

  // test deleteIndexer
  const deleteIndexerTxn = await indexContract.deleteIndexer(owner.address);
  await deleteIndexerTxn.wait();
  isIndexer = await indexContract.checkIndexer();
  console.log('isIndexer: ', isIndexer);

  indexers = await indexContract.getAllIndexers();
  console.log('indexers: ', indexers);

  users = await indexContract.getAllUsers();
  console.log('users: ', users);

    // // test updateDescription
    // const updateDescriptionTxn = await indexContract.updateDescription(0, 'Swap or provide liquidity on the Uniswap Protocol.');
    // await updateDescriptionTxn.wait();
    // allIndexes = await indexContract.getAllIndexes();
    // console.log("allIndexes: ", allIndexes);
  
    // // test updateTags
    // const updateTagsTxn = await indexContract.updateTags(0, Array('dex', 'defi', 'swap', 'liquidity'));
    // await updateTagsTxn.wait();
    // allIndexes = await indexContract.getAllIndexes();
    // console.log("allIndexes: ", allIndexes);
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