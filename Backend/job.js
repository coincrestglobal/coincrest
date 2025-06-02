const { ethers } = require("ethers");
const solc = require("solc");

const source = `
pragma solidity ^0.8.0;

contract MyToken {
    string public name = "TestToken";
    string public symbol = "TTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * (10 ** uint256(decimals));
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Not enough balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
`;

async function main() {
  const input = {
    language: "Solidity",
    sources: { "MyToken.sol": { content: source } },
    settings: {
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (
    !output.contracts ||
    !output.contracts["MyToken.sol"] ||
    !output.contracts["MyToken.sol"]["MyToken"]
  ) {
    throw new Error("Compilation failed");
  }

  const contract = output.contracts["MyToken.sol"]["MyToken"];
  const ABI = contract.abi;
  const BYTECODE = contract.evm.bytecode.object;

  const BSC_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
  const PRIVATE_KEY =
    "7df749e69a793cd41c9e9bbd2d1d503234d73f1c3915304e320effc977666734"; // apni private key daalo

  const provider = new ethers.JsonRpcProvider(BSC_TESTNET_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const factory = new ethers.ContractFactory(ABI, BYTECODE, wallet);
  const initialSupply = 1_000_000; // 1 million tokens (without decimals)

  console.log("Deploying contract...");
  const contractInstance = await factory.deploy(initialSupply);
  await contractInstance.waitForDeployment();

  console.log("✅ Contract deployed at:", contractInstance.target);
  console.log("Deployer address:", wallet.address);

  // Transfer example: deployer se kisi dusre address ko tokens bhejna
  const receiver = "0x7c1a71F38c152c4B9782B3c55C2831e371a936C7"; // yahan receiver ka wallet address daalo
  const amountToSend = ethers.parseUnits("1000000", 18); // 100 tokens (18 decimals)

  console.log(
    `Transferring ${ethers.formatUnits(
      amountToSend,
      18
    )} tokens to ${receiver}...`
  );

  const tx = await contractInstance.transfer(receiver, amountToSend);
  await tx.wait();

  console.log("✅ Transfer complete!");
}

main().catch(console.error);
