import { error } from "console";
import { ethers } from "hardhat";
//定义main函数，内部是部署合约逻辑
async function main() {
  //获取合约工厂，找到制造Bank合约机器
  const Bank = await ethers.getContractFactory("SimpleBank");
  //使用工厂来部署合约，制造了一个Bank合约
  const bank = await Bank.deploy();
  //等待部署完成
  await bank.waitForDeployment();
  //获取合约地址方便后续交互
  console.log("合约地址:", await bank.getAddress());
}

//错误处理逻辑
main().catch((error) => {
  console.error(error);
  //设置 Node.js 进程的退出码为 1，表示程序执行失败或出现错误
  process.exitCode = 1;
});
