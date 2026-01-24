// scripts/find_transfers.js
const fs = require('fs');
const { ethers } = require('ethers');

(async function () {
  try {
    const p = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com');
    const addr = '0x93f8256de602703Af0b7Ecc3f0C2Dd4cbAe57B65';
    const owner = '0x6377cd174b35f3630B6D0dB695f175d5f0dc5541';
    const transferSig = ethers.utils.id('Transfer(address,address,uint256)');
    const ownerTopic = ethers.utils.hexZeroPad(owner, 32);

    console.log('Provider:', p.connection ? p.connection.url : 'default');
    const latest = await p.getBlockNumber();
    console.log('Latest block:', latest);

    // Buscar bloque de creación por binaria
    let low = 0, high = latest;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const code = await p.getCode(addr, mid);
      if (code && code !== '0x') high = mid;
      else low = mid + 1;
    }
    const creationBlock = low;
    console.log('Inferred creation block:', creationBlock);

    if (creationBlock > latest) {
      console.log('No code found on chain');
      process.exit(0);
    }

    // Escanear logs en tramos para evitar error de rango grande
    const chunk = 20000;
    let totalFound = 0;
    const art = JSON.parse(fs.readFileSync('./artifacts/contracts/NFT_DOA.sol/NFT_DOA.json', 'utf8'));
    const contract = new ethers.Contract(addr, art.abi, p);

    for (let from = creationBlock; from <= latest; from += chunk) {
      const to = Math.min(from + chunk - 1, latest);
      try {
        const logs = await p.getLogs({ address: addr, fromBlock: from, toBlock: to, topics: [transferSig, null, ownerTopic] });
        if (logs.length) {
          console.log('Found ' + logs.length + ' logs in range ' + from + '-' + to);
          for (const l of logs) {
            const tokenId = ethers.BigNumber.from(l.topics[3]);
            console.log('---');
            console.log('block:', l.blockNumber);
            console.log('tx:', l.transactionHash);
            console.log('tokenId:', tokenId.toString());
            try {
              const uri = await contract.tokenURI(tokenId);
              console.log('tokenURI:', uri);
            } catch (err) {
              console.log('tokenURI error:', err.message);
            }
            totalFound++;
          }
        }
      } catch (err) {
        console.log('Error fetching logs for range', from, to, ':', err.message);
      }
    }

    console.log('Total Transfer logs to owner found:', totalFound);
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  }
})();