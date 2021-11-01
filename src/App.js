import { useLocalStorageState } from 'ahooks';
import { useState } from 'react';
import './App.css';
import Wallet from './Wallet';
const erc20Abi = require('./erc20.abi.json');
const MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

function App() {
  const [wallet, setWallet] = useState({});
  const connected = wallet.connected;
  const address = wallet.address;
  const web3 = wallet.web3;
  const networkId = wallet.networkId;

  const [tokenAddress, setTokenAddress] = useLocalStorageState("tokenAddress", "");
  const [destAddress, setDestAddress] = useLocalStorageState("destAddress", "");

  return (
    <div className="App">
      <Wallet wallet={wallet} setWallet={setWallet} />
      <header className="App-header">
        <h2>DApp tools</h2>
        <button style={{margin: "20px", width:"200px", textAlign: "center", height: "40px", borderRadius: "20px"}} onClick={()=>{
          if (connected) {
            wallet.resetApp();
          } else {
            wallet.connect();
          }
        }} >
        {
          connected && address ? address.slice(0, 6) + '...' + address.slice(-4) : "Connect Wallet"
        }
        </button>
        <div style={{borderRadius:"50%", padding:"10px", border:"1px solid white", fontSize:"16px"}}>{networkId}</div>
        <hr style={{width: "800px"}} />
        Token tools
        <input value={tokenAddress} onChange={e=>{setTokenAddress(e.target.value)}} placeholder={"Token SC Address"} style={{margin: "20px", width:"400px", textAlign: "center", height: "40px"}} />
        <input value={destAddress} onChange={e=>{setDestAddress(e.target.value)}} placeholder={"Destination Address"} style={{margin: "20px", width:"400px", textAlign: "center", height: "40px"}} />
        <button style={{margin: "20px", width:"200px", textAlign: "center", height: "40px", borderRadius: "20px"}} onClick={()=>{
          if (web3 && web3.utils.isAddress(tokenAddress) && web3.utils.isAddress(destAddress)) {
            const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
            sc.methods.approve(destAddress, MAX).send({from: address}).then(ret=>{
              window.alert(ret.status);
            }).catch(err=>{
              window.alert(err.message);
            })
          } else {
            window.alert("input not good");
          }
        }}>Approve MAX</button>
        <button style={{margin: "20px", width:"200px", textAlign: "center", height: "40px", borderRadius: "20px"}} onClick={()=>{
          if (web3 && web3.utils.isAddress(tokenAddress) && web3.utils.isAddress(destAddress)) {
            const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
            sc.methods.approve(destAddress, '0x0').send({from: address}).then(ret=>{
              window.alert(ret.status);
            }).catch(err=>{
              window.alert(err.message);
            })
          } else {
            window.alert("input not good");
          }
        }}>Approve 0</button>
        <button style={{margin: "20px", width:"200px", textAlign: "center", height: "40px", borderRadius: "20px"}} onClick={()=>{
          if (web3 && web3.utils.isAddress(tokenAddress)) {
            const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
            sc.methods.balanceOf(address).call().then(ret=>{
              window.alert(ret);
            }).catch(err=>{
              window.alert(err.message);
            })
          } else {
            window.alert("input not good");
          }
        }} >Get Balance</button>
        <button style={{margin: "20px", width:"200px", textAlign: "center", height: "40px", borderRadius: "20px"}}  onClick={()=>{
          if (web3 && web3.utils.isAddress(tokenAddress) && web3.utils.isAddress(destAddress)) {
            let amount = window.prompt("Input amount in wei:");
            const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
            sc.methods.transfer(destAddress, amount).send({from: address}).then(ret=>{
              window.alert(ret.status);
            }).catch(err=>{
              window.alert(err.message);
            })
          } else {
            window.alert("input not good");
          }
        }} >Send</button>
      </header>
    </div>
  );
}

export default App;
