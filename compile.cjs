const solc = require('solc');
const fs = require('fs');

const simpleStorageSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract SimpleStorage {
    uint256 private value;
    function store(uint256 _value) public { value = _value; }
    function retrieve() public view returns (uint256) { return value; }
}
`;

const gmRegistrySource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract GMRegistry {
    string[] public messages;
    address[] public senders;
    function sendGM(string calldata message) external {
        messages.push(message);
        senders.push(msg.sender);
    }
    function getGMCount() public view returns (uint256) { return messages.length; }
    function getGM(uint256 index) public view returns (address sender, string memory message) {
        return (senders[index], messages[index]);
    }
}
`;

const erc20Source = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MinimalERC20 {
    string public name = "Test Token";
    string public symbol = "TEST";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(value <= balanceOf[from], "Insufficient balance");
        require(value <= allowance[from][msg.sender], "Allowance exceeded");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}
`;

const input = {
    language: 'Solidity',
    sources: {
        'SimpleStorage.sol': { content: simpleStorageSource },
        'GMRegistry.sol': { content: gmRegistrySource },
        'MinimalERC20.sol': { content: erc20Source }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode.object']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contracts = {
    SimpleStorage: {
        abi: output.contracts['SimpleStorage.sol'].SimpleStorage.abi,
        bytecode: output.contracts['SimpleStorage.sol'].SimpleStorage.evm.bytecode.object
    },
    GMRegistry: {
        abi: output.contracts['GMRegistry.sol'].GMRegistry.abi,
        bytecode: output.contracts['GMRegistry.sol'].GMRegistry.evm.bytecode.object
    },
    MinimalERC20: {
        abi: output.contracts['MinimalERC20.sol'].MinimalERC20.abi,
        bytecode: output.contracts['MinimalERC20.sol'].MinimalERC20.evm.bytecode.object
    }
};

fs.writeFileSync('src/contracts.json', JSON.stringify(contracts, null, 2));
console.log('Contracts compiled and saved to src/contracts.json');
