import dayjs from 'dayjs';
import { toUnixTime, toWei } from '~common';
import { MATAN_WALLET_STAKING } from '~common-contract';
import { DAYS, MINUTES, ZERO } from '~constants';
import { DeployNetworkKey } from '~types';
import { calculateAprForContract } from '~utils';
import { defaultNetwork } from '../hardhat.config';
import { ContractConfig, DeployContractArgs, DeployTokenArgs, TokenConfig } from './types';

type DeployType = 'test' | 'main' | 'stage' | 'prod';

const deployType: DeployType = (process.env.ENV as DeployType) ?? 'main';

// const isProd = deployType === ('prod' as any);
// if (isProd) {
//   throw 'Are you sure? It is PROD!';
// }

const chainDecimals: Record<DeployNetworkKey, number> = {
  bsc: 8,
};

export const erc20Decimals = chainDecimals[defaultNetwork];

export const now = dayjs();

// const priceDiv = BigInt(10_000);
const priceDiv = BigInt(1000);
const userDiv = BigInt(2);

export const contractConfigDeployMap: Record<DeployType, Partial<ContractConfig>> = {
  test: {
    newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF', //owner2
    // erc20Token: '0x4072b57e9B3dA8eEB9F8998b69C868E9a1698E54', //tWEB3
    erc20Token: '0x8364a68c32E581332b962D88CdC8dBe8b3e0EE9c', //tWEB32
    // erc20Token: '0x2B72867c32CF673F7b02d208B26889fEd353B1f8', //WEB3
    duration: 20 * MINUTES,
    // depositDeadline: toUnixTime(now.add(1, 'days').toDate()),
    depositDeadline: 1873465218,
  },
  main: {
    newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF', //owner2
    // erc20Token: '0x4072b57e9B3dA8eEB9F8998b69C868E9a1698E54', //tWEB3
    erc20Token: '0x8364a68c32E581332b962D88CdC8dBe8b3e0EE9c', //tWEB32
    // erc20Token: '0x2B72867c32CF673F7b02d208B26889fEd353B1f8', //WEB3
    duration: 20 * DAYS,
    // depositDeadline: toUnixTime(now.add(100, 'days').toDate()),
    depositDeadline: 1732205548,
    accountLimit: toWei(2, erc20Decimals),
  },
  stage: {
    newOwner: MATAN_WALLET_STAKING,
    erc20Token: '0x2B72867c32CF673F7b02d208B26889fEd353B1f8', //WEB3
    limit: toWei(1_000_000, erc20Decimals),
    minStakeAmount: ZERO,
    maxStakeAmount: toWei(1_000_000, erc20Decimals),
  },
  prod: {
    newOwner: MATAN_WALLET_STAKING,
    erc20Token: '0x2B72867c32CF673F7b02d208B26889fEd353B1f8', //WEB3
    limit: toWei(1_000_000, erc20Decimals),
    minStakeAmount: ZERO,
    maxStakeAmount: toWei(1_000_000, erc20Decimals),
  },
};

const extContractConfig = contractConfigDeployMap[deployType];

const depositDeadline = toUnixTime(now.add(100, 'days').toDate());
const limit = toWei(3000, erc20Decimals) / priceDiv;
const minStakeAmount = toWei(1, erc20Decimals) / priceDiv;
const maxStakeAmount = toWei(1500, erc20Decimals) / priceDiv;
// const accountLimit = toWei(3000, erc20Decimals) / priceDiv;
const accountLimit = ZERO;

export const contractConfig: ContractConfig = {
  newOwner: '0x1D5eeCbD950C22Ec2B5813Ab1D65ED5fFD83F32B',
  erc20Token: '0x4072b57e9B3dA8eEB9F8998b69C868E9a1698E54', //tWEB3
  duration: 30 * DAYS,
  apr: calculateAprForContract(20),
  depositDeadline,
  limit,
  minStakeAmount,
  maxStakeAmount,
  accountLimit,
  ...extContractConfig,
};

export function getContractArgs(contractConfig: ContractConfig): DeployContractArgs {
  const {
    newOwner,
    erc20Token,
    duration,
    apr,
    depositDeadline,
    limit,
    minStakeAmount,
    maxStakeAmount,
    accountLimit,
  } = contractConfig;

  return [
    newOwner,
    erc20Token,
    duration,
    apr,
    depositDeadline,
    limit,
    minStakeAmount,
    maxStakeAmount,
    accountLimit,
  ];
}

export const tokenConfig: TokenConfig = {
  name: 'empty',
  symbol: 'empty',
  newOwner: '0x627Ab3fbC3979158f451347aeA288B0A3A47E1EF',
  initMint: toWei(1_000_000_000, erc20Decimals),
  decimals: erc20Decimals,
};

export function getTokenArgs(tokenConfig: TokenConfig): DeployTokenArgs {
  const { name, symbol, newOwner, initMint, decimals } = tokenConfig;
  return [name, symbol, newOwner, initMint, decimals];
}

const userInitBalance = toWei(10_000, erc20Decimals) / priceDiv;
const minStake = toWei(0.001, erc20Decimals) / priceDiv;
const stake1 = toWei(100, erc20Decimals) / priceDiv;
const unstake = toWei(30, erc20Decimals) / priceDiv;
const extraStake1 = toWei(1000, erc20Decimals) / priceDiv;
const companyRewards = toWei(1000, erc20Decimals) / priceDiv;

const userStakeId1_0 = 0;
const userStakeId1_1 = 1;
const userStakeId2_0 = 0;

export const seedData = {
  zero: ZERO,
  userInitBalance,
  totalAccountBalance: tokenConfig.initMint,
  minStake,
  stake1,
  stake2: stake1 / userDiv,
  unstake2: unstake / userDiv,
  stake3: stake1 / userDiv / userDiv,
  extraStake1,
  maximumStake: maxStakeAmount + BigInt(1),
  tokenMicroDelta: BigInt(10),
  tokenDelta: toWei(0.001, erc20Decimals),
  timeDelta: 50,
  now: toUnixTime(),
  userStakeId1_0,
  userStakeId1_1,
  userStakeId2_0,
  stakeIdNonExistent: 789,
  companyRewards,
};
