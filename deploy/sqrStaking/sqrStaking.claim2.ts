import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { callWithTimerHre, waitTx } from '~common';
import { SQR_STAKING_NAME } from '~constants';
import { contractConfig } from '~seeds';
import { getAddressesFromHre, getContext } from '~utils';
import { deployData } from './deployData';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  await callWithTimerHre(async () => {
    const { sqrStakingAddress } = getAddressesFromHre(hre);
    console.log(`${SQR_STAKING_NAME} ${sqrStakingAddress} is staking...`);
    const erc20TokenAddress = contractConfig.erc20Token;
    const context = await getContext(erc20TokenAddress, sqrStakingAddress);
    const { user2SQRStaking } = context;

    const params = {
      userStakeId: deployData.userStakeId2_0,
    };

    console.table(params);

    await waitTx(user2SQRStaking.claim(params.userStakeId), 'claim');
  }, hre);
};

func.tags = [`${SQR_STAKING_NAME}:claim2`];

export default func;