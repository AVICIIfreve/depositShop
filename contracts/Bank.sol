// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleBank {
    //记录金额，根据地址记录金额
    mapping(address => uint256) private balances;

    //定义存取款事件
    event Deposited(address sender,uint amount);
    event Withdrawal(address receiver,uint residue);

    //存款,因为是给外部调用且省gas使用external
    function deposit() external payable{
        //随合约发送的eth数量必须大于0,msg.value表示随交易发送的eth数量
        require(msg.value > 0," amount must >0");
        //发起这个操作的人的余额增加,msg.sender 发起这个操作的人的地址
        balances[msg.sender] += msg.value;
        //触发事件
        emit Deposited(msg.sender, msg.value);
    }

    //取款
    function withdraw(uint256 _amount) external{
        //合约调用者才可以取款,取款金额不得大于他自己的余额
        require(balances[msg.sender] >= _amount,"Insufficient balance");
        //扣除取款金额
        balances[msg.sender] -= _amount;
        //发送取款金额给提款者,先将发起者地址转化为可支付地址，然后向改地址发送金额，transfer 发送金额
        payable(msg.sender).transfer(_amount);
        //触发事件
        emit Withdrawal(msg.sender, _amount);
    }

    //查询余额
    function balanceOf(address _account) external view returns(uint256){
        return balances[_account];
    }
}