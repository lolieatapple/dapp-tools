import { useLocalStorageState } from "ahooks";
import { useState } from "react";
import { Button, Card, Input, Space, message } from "antd";
import "./App.css";
import Wallet from "./Wallet";
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
            if (connected) {
              wallet.resetApp();
            } else {
              wallet.connect();
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
        
      </header>
    </div>
  );
}

export default App;
