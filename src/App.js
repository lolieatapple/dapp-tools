import { useLocalStorageState } from "ahooks";
import { useState } from "react";
import { Button, Card, Input, Space, message } from "antd";
import "./App.css";
import Wallet from "./Wallet";
import { exitPool } from "./balancer";
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { TextField } from "@mui/material";

const erc20Abi = require("./erc20.abi.json");
const erc721Abi = require("./erc721.abi.json");
const MAX =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

function App() {
  const [wallet, setWallet] = useState({});
  const connected = wallet.connected;
  const address = wallet.address;
  const web3 = wallet.web3;
  const networkId = wallet.networkId;

  const [tokenAddress, setTokenAddress] = useLocalStorageState(
    "tokenAddress",
    ""
  );
  const [destAddress, setDestAddress] = useLocalStorageState("destAddress", "");

  const [tokenID, setTokenID] = useLocalStorageState("tokenID", "");

  const [data, setData] = useState({});
  const balancerSchema = {
    type: "object",
    properties: {
      vault: {
        type: "string",
        description: "Vault SC address, such as: 0xf2BAaF9D8B4B0CFb19d46Ac9FFb8102e5930fadE"
      },
      poolId: {
        type: "string",
        description: "Pool ID, such as: 0x19ae2c19eb845db54177ccaacf524931cbf15482000200000000000000000027"
      },
      bptIn: {
        type: "string",
        description: "BPT burn amount in wei, such as: 7247796636776810343162562"
      },
      tokensOut: {
        type: 'array',
        items: {
          type: 'string',
          description: "Token Address"
        }
      }
    },
    // required: ["vault","poolId","bptIn","tokensOut"]
  }

  const [rawTx, setRawTx] = useState('');

  return (
    <div className="App">
      <Wallet wallet={wallet} setWallet={setWallet} />
      <header className="App-header">
        <h2 style={{ color: "white" }}>DApp tools</h2>
        <Button
          style={{
            margin: "20px",
            width: "200px",
            textAlign: "center",
            height: "40px",
            borderRadius: "20px",
          }}
          onClick={() => {
            try {
              if (connected) {
                wallet.resetApp();
              } else {
                wallet.connect();
              }
            } catch (err) {
              wallet.resetApp();
            }
          }}
        >
          {connected && address
            ? address.slice(0, 6) + "..." + address.slice(-4)
            : "Connect Wallet"}
        </Button>
        <div
          style={{
            borderRadius: "50%",
            padding: "10px",
            border: "1px solid white",
            fontSize: "16px",
          }}
        >
          {networkId}
        </div>
        {/* <hr style={{ width: "800px", height: '0px' }} /> */}

        <div style={{display: 'flex', alignItems:'center', justifyContent:'center', flexFlow:'row wrap' }}>
          <Card style={{borderRadius: '20px', margin: "20px"}}>
            <Space direction="vertical" >
              <h2>ERC20 tools</h2>
              <Input
                value={tokenAddress}
                onChange={(e) => {
                  setTokenAddress(e.target.value);
                }}
                placeholder={"Token SC Address"}
                style={{
                  // margin: "20px",
                  width: "400px",
                  textAlign: "center",
                  height: "40px",
                }}
              />
              <Input
                value={destAddress}
                onChange={(e) => {
                  setDestAddress(e.target.value);
                }}
                placeholder={"Destination Address"}
                style={{
                  // margin: "20px",
                  width: "400px",
                  textAlign: "center",
                  height: "40px",
                }}
              />
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress)
                  ) {
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .approve(destAddress, MAX)
                      .send({ from: address })
                      .then((ret) => {
                        console.log(ret.status);
                        message.success('success', 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Approve MAX
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress)
                  ) {
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .approve(destAddress, "0x0")
                      .send({ from: address })
                      .then((ret) => {
                        message.success('success', 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Approve 0
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (web3 && web3.utils.isAddress(tokenAddress)) {
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .allowance(address, destAddress)
                      .call()
                      .then((ret) => {
                        message.info(ret, 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Allowance
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (web3 && web3.utils.isAddress(tokenAddress)) {
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .balanceOf(address)
                      .call()
                      .then((ret) => {
                        message.info(ret, 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Get Balance
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress)
                  ) {
                    let amount = window.prompt("Input amount in wei:");
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .transfer(destAddress, amount)
                      .send({ from: address })
                      .then((ret) => {
                        message.success('success', 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Transfer
              </Button>
            </Space>
          </Card>

          <Card style={{borderRadius: '20px', margin: "20px"}}>
            <Space direction="vertical" >
              <h2>ERC721 tools</h2>
              <Input
                value={tokenAddress}
                onChange={(e) => {
                  setTokenAddress(e.target.value);
                }}
                placeholder={"Token SC Address"}
                style={{
                  // margin: "20px",
                  width: "400px",
                  textAlign: "center",
                  height: "40px",
                }}
              />
              <Input
                value={destAddress}
                onChange={(e) => {
                  setDestAddress(e.target.value);
                }}
                placeholder={"Destination Address"}
                style={{
                  // margin: "20px",
                  width: "400px",
                  textAlign: "center",
                  height: "40px",
                }}
              />
              <Input
                value={tokenID}
                onChange={(e) => {
                  setTokenID(e.target.value);
                }}
                placeholder={"Token ID"}
                style={{
                  // margin: "20px",
                  width: "400px",
                  textAlign: "center",
                  height: "40px",
                }}
              />
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress)
                  ) {
                    const sc = new web3.eth.Contract(erc721Abi, tokenAddress);
                    sc.methods
                      .isApprovedForAll(address, destAddress)
                      .call({ from: address })
                      .then((ret) => {
                        console.log(ret);
                        message.success(ret.toString(), 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                isApprovedForAll
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress)
                  ) {
                    const sc = new web3.eth.Contract(erc721Abi, tokenAddress);
                    sc.methods
                      .setApprovalForAll(destAddress, true)
                      .send({ from: address })
                      .then((ret) => {
                        console.log(ret.status);
                        message.success('success', 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                setApprovalForAll: true
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress)
                  ) {
                    const sc = new web3.eth.Contract(erc721Abi, tokenAddress);
                    sc.methods
                      .setApprovalForAll(destAddress, false)
                      .send({ from: address })
                      .then((ret) => {
                        console.log(ret.status);
                        message.success('success', 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                setApprovalForAll: false
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (web3 && web3.utils.isAddress(tokenAddress)) {
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .balanceOf(address)
                      .call()
                      .then((ret) => {
                        message.info(ret, 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Get Balance
              </Button>
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (
                    web3 &&
                    web3.utils.isAddress(tokenAddress) &&
                    web3.utils.isAddress(destAddress) && tokenID !== ""
                  ) {
                    const sc = new web3.eth.Contract(erc20Abi, tokenAddress);
                    sc.methods
                      .transferFrom(address, destAddress, tokenID)
                      .send({ from: address })
                      .then((ret) => {
                        message.success('success', 20);
                      })
                      .catch((err) => {
                        message.info(err.message);
                      });
                  } else {
                    message.info("input not good");
                  }
                }}
              >
                Transfer
              </Button>
            </Space>
          </Card>
          
          <Card style={{borderRadius: '20px', margin: "20px"}}>
            <Space direction="vertical" >
              <h2 style={{width:'400px'}}>Send Raw Transaction</h2>
              <TextField label="Raw Transaction Hex" fullWidth multiline value={rawTx} onChange={e=>setRawTx(e.target.value)} />
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={()=>{
                  if (!web3) {
                    window.alert("please connect wallet first");
                    return;
                  }
                  console.log('sending...');
                  web3.eth.sendSignedTransaction(rawTx).then(ret=>{
                    message.success(`success, ${ret}`, 20);
                  }).catch(err=>{
                    message.error(`${err.message}`);
                  });
              }}>Send</Button>
            </Space>
          </Card>

          <Card style={{borderRadius: '20px', margin: "20px"}}>
            <Space direction="vertical" >
              <h2 style={{width:'400px'}}>Balancer Exit Pool</h2>
              <JsonForms
                data={data}
                schema={balancerSchema}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={e=>setData(e.data)}
              />
              <Button
                style={{
                  // margin: "20px",
                  width: "200px",
                  textAlign: "center",
                  height: "40px",
                  borderRadius: "20px",
                }}
                onClick={()=>{
                  exitPool(address, web3, data).then(ret=>{

                  }).catch(err=>{

                  });
              }}>ExitPool</Button>
            </Space>
          </Card>


        </div>
      </header>
    </div>
  );
}

export default App;
