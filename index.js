const SHA256 = require("crypto-js/sha256");
class CryptoBlock {
  constructor(index, timestamp, data, lastHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.lastHash = lastHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.lastHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new CryptoBlock(0, "01/01/1970", "Starting Block", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.lastHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.lastHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let LeathleyCoin = new CryptoBlockchain();
LeathleyCoin.addNewBlock(new CryptoBlock(1, "04/02/2024", {sender: "Gary Leathley", recipient: "Jim LOVE", quantity: 50000}));
LeathleyCoin.addNewBlock(new CryptoBlock(2, "04/02/2024", {sender: "Jim LOVE", recipient: "Gary Leathley", quantity: 500}));
console.log(JSON.stringify(LeathleyCoin, null, 4));
