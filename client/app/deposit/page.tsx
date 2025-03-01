"use client";

import React from "react";
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import type { SimpleBank } from "../../../typechain-types";

export default function Home() {
  // 状态管理
  const [balance, setBalance] = useState<string>("0"); // 用户余额
  const [contract, setContract] = useState<SimpleBank | null>(null); // 合约实例
  const [account, setAccount] = useState<string>(""); // 当前连接的钱包地址

  // 初始化合约连接
  useEffect(() => {
    const initContract = async () => {
      try {
        // 检查是否安装了以太坊钱包
        if (!window.ethereum) {
          console.error("未检测到以太坊钱包");
          return;
        }

        // 创建以太坊提供者
        const provider = new BrowserProvider(window.ethereum);
        // 获取签名者
        const signer = await provider.getSigner();
        // 获取当前账户地址
        const address = await signer.getAddress();
        setAccount(address);

        // 加载合约ABI和地址
        const contractABI = (await import("./SimpleBank.json")).abi;
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为实际部署地址

        // 实例化合约
        const bankContract = new Contract(
          contractAddress,
          contractABI,
          signer
        ) as unknown as SimpleBank;

        // 设置合约实例并更新余额
        setContract(bankContract);
        await updateBalance(bankContract, address);
      } catch (error) {
        console.error("初始化失败:", error);
      }
    };

    // 如果钱包已连接，则初始化合约
    if (window.ethereum?.isConnected()) {
      initContract();
    }
  }, []);

  // 更新余额方法
  const updateBalance = async (contract: SimpleBank, address: string) => {
    try {
      // 调用合约的balanceOf方法获取余额
      const balance = await contract.balanceOf(address);
      // 将wei转换为ether并更新状态
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("获取余额失败:", error);
    }
  };

  // 存款操作
  const handleDeposit = async () => {
    if (!contract || !account) return;

    try {
      // 调用合约的deposit方法，存入0.1 ETH
      const tx = await contract.deposit({
        value: ethers.parseEther("0.1"), // 将ETH转换为wei
      });

      // 等待交易确认
      await tx.wait();
      // 更新余额
      await updateBalance(contract, account);
    } catch (error) {
      console.error("存款失败:", error);
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("请安装MetaMask!");
      return;
    }

    try {
      // 请求连接钱包
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // 重新加载页面以初始化合约
      window.location.reload();
    } catch (error) {
      console.error("连接失败:", error);
    }
  };

  return (
    <div className="container">
      {!account ? (
        // 如果未连接钱包，显示连接按钮
        <button onClick={connectWallet}>连接钱包</button>
      ) : (
        // 如果已连接钱包，显示账户信息和操作按钮
        <>
          <p>
            当前账户: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          <button onClick={handleDeposit}>存入0.1 ETH</button>
          <p>当前余额: {balance} ETH</p>
        </>
      )}
    </div>
  );
}
