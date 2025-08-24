import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();
const wseiAbi = ['function deposit() public payable'];
const wseiAddress = '0xF8EB55EC97B59d91fe9E91A1d61147e0d2A7b6F7';
const rpcUrl = 'https://evm-rpc.atlantic-2.seinetwork.io';
async function main() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error('Please provide a PRIVATE_KEY in your .env file');
        return;
    }
    console.log('Connecting to provider...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    console.log('Creating wallet...');
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Wallet address: ${wallet.address}`);
    console.log('Creating contract instance...');
    const wseiContract = new ethers.Contract(wseiAddress, wseiAbi, wallet);
    const amountToWrap = '1'; // Wrap 1 SEI
    const value = ethers.parseUnits(amountToWrap, 6);
    console.log(`Attempting to wrap ${amountToWrap} SEI (${value.toString()} wei)...`);
    try {
        const tx = await wseiContract.deposit({ value });
        console.log('Transaction sent! Hash:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed!');
    }
    catch (error) {
        console.error('Error sending transaction:', error);
    }
}
main();
