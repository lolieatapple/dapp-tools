import {WeightedPoolEncoder} from './encoder';
const vaultAbi = require('./abis/Vault.json');

function encodeExitWeightedPool(exitData) {
  if (exitData.kind === 'ExactBPTInForOneTokenOut') {
    return WeightedPoolEncoder.exitExactBPTInForOneTokenOut(
      exitData.bptAmountIn,
      exitData.exitTokenIndex
    );
  } else if (exitData.kind === 'ExactBPTInForTokensOut') {
    return WeightedPoolEncoder.exitExactBPTInForTokensOut(exitData.bptAmountIn);
  } else {
    return WeightedPoolEncoder.exitBPTInForExactTokensOut(
      exitData.amountsOut,
      exitData.maxBPTAmountIn
    );
  }
}

function txData(
  amountsOut,
  bptIn,
  exitTokenIndex,
  exactOut
) {
  const isSingleAssetOut = exitTokenIndex !== null;

  const dataEncodeFn = encodeExitWeightedPool;

  if (isSingleAssetOut) {
    return dataEncodeFn({
      kind: 'ExactBPTInForOneTokenOut',
      bptAmountIn: bptIn,
      exitTokenIndex
    });
  } else if (exactOut) {
    return dataEncodeFn({
      amountsOut,
      maxBPTAmountIn: bptIn
    });
  } else {
    return dataEncodeFn({
      kind: 'ExactBPTInForTokensOut',
      bptAmountIn: bptIn
    });
  }
}

function serialize(
  poolId,
  account,
  amountsOut,
  tokensOut,
  bptIn,
  exitTokenIndex,
  exactOut
) {
  const parsedAmountsOut = amountsOut;
  const parsedBptIn = bptIn;
  const assets = tokensOut;
  const data = txData(
    parsedAmountsOut,
    parsedBptIn,
    exitTokenIndex,
    exactOut
  );

  return [
    poolId,
    account,
    account,
    {
      assets,
      minAmountsOut: parsedAmountsOut,
      userData: data,
      toInternalBalance: false
    }
  ];
}

export const exitPool = async (addr, web3, data) => {
  console.log('exitPool', addr, data);
  let vault = data.vault; //'0xf2BAaF9D8B4B0CFb19d46Ac9FFb8102e5930fadE';
  let poolId = data.poolId; //'0x19ae2c19eb845db54177ccaacf524931cbf15482000200000000000000000027';
  let account = addr;
  let amountsOut = ['0','0'];
  let tokensOut = data.tokensOut; //['0x8b989b35290d7c8db36082b9249902f75ed3ff8c','0x9f58f83aa52f423afb1fcc074fe6a4159ea794d0'];
  let bptIn = data.bptIn; //'7247796636776810343162562';
  let exitTokenIndex = null;
  let exactOut = false;

  console.log('input', {poolId, account, amountsOut, tokensOut, bptIn, exitTokenIndex, exactOut})

  const txParams = serialize(poolId, account, amountsOut, tokensOut, bptIn, exitTokenIndex, exactOut);
  console.log('txParams', JSON.stringify(txParams));

  const sc = new web3.eth.Contract(vaultAbi, vault);
  let ret = await sc.methods.exitPool(...txParams).send({from: addr});
  console.log('ret', ret);
}
