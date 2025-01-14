import appRoot from 'app-root-path';
import { readFileSync, writeFileSync } from 'fs';
import { DeployFunction } from 'hardhat-deploy/types';
import { checkFilePathSync, getParentDirectory } from '~common';
import { callWithTimerHre } from '~common-contract';
import { WEB3_STAKING_NAME } from '~constants';
import { getSourcePath } from './utils';

const func: DeployFunction = async (): Promise<void> => {
  await callWithTimerHre(async () => {
    const root = appRoot.toString();
    const sourcePath = getSourcePath(WEB3_STAKING_NAME);

    const file = readFileSync(sourcePath, { encoding: 'utf8', flag: 'r' });
    const jsonFile = JSON.parse(file);

    const abi = jsonFile.abi;
    const targetPath = `${root}/abi/${WEB3_STAKING_NAME}.json`;
    checkFilePathSync(getParentDirectory(targetPath));
    writeFileSync(targetPath, JSON.stringify(abi, null, 2));

    console.log(`ABI-file was saved to ${targetPath}`);
  });
};

func.tags = [`${WEB3_STAKING_NAME}:publish-abi`];

export default func;
