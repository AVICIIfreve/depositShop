//用于在测试中复用部署逻辑，避免重复部署合约，提高测试效率
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
//来自 chai 库，用于断言测试结果是否符合预期
import { expect } from "chai";
//Hardhat 提供的工具库，用于与以太坊网络交互，如部署合约、获取签名者等。
import { ethers } from "hardhat";
//从 typechain-types 导入的合约类型，提供类型提示和代码补全。
import type { SimpleBank } from "../typechain-types";

//定义一个测试套件，描述测试的主题
describe("Bank Contract", function () {
  async function deployContract() {
    //获取SimpleBank合约的工厂实例
    const BankFactory = await ethers.getContractFactory("SimpleBank");
    //部署SimpleBank合约，并返回和合约实例
    const bank = await BankFactory.deploy();
    //返回一个包含bank实例的对象，供测试用例使用
    return { bank };
  }
  //定义一个测试用例，描述测试的具体功能
  it("Should deposit correctly", async function () {
    //调用 deployContract 函数部署合约，并复用部署结果。
    const { bank } = await loadFixture(deployContract);
    //取测试账户列表，[user] 取第一个账户作为用户。
    const [user] = await ethers.getSigners();
    //将 1.5 ETH 转换为 Wei（以太坊的最小单位）。
    const depositAmount = ethers.parseEther("1.5");
    //用户调用deposit方法，存入1.5ETH
    await bank.connect(user).deposit({ value: depositAmount });
    //断言用户余额是都等于存款金额，验证存款从功能是否正确
    expect(await bank.balanceOf(user.address)).to.equal(depositAmount);
  });
});
