const XNL = artifacts.require("XNLToken");
const BN = require('bn.js');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();


contract('XNLToken', function ([owner, account1, account2, account3, account4, account5, account6, account7, account8, account9, _]) {

  const intitialSupply = 100000000 * (10 ** 18);
  const amount = web3.utils.toBN(1 * (10 ** 18)) ; // 1XNL
  const zero = web3.utils.toBN(0);

  beforeEach(async function () {
    this.token = await XNL.new({ from: owner });
  });

  it("..init supply is assigned to owner", async function () {
    let balance = await this.token.balanceOf(owner);
    assert.equal(balance, intitialSupply);
  });

  it("..is pausable and only owner can unpause and pause token", async function () {
    let paused = await this.token.paused();
    assert.equal(paused, false);

    await this.token.pause({ from: account1 }).should.be.rejectedWith(Error);
    
    paused = await this.token.paused();
    assert.equal(paused, false);

    await this.token.pause({ from: owner });

    paused = await this.token.paused();
    assert.equal(paused, true);

    await this.token.unpause({ from: account1 }).should.be.rejectedWith(Error);;

    await this.token.unpause({ from: owner });
    paused = await this.token.paused();
    assert.equal(paused, false);

  });

  it("..transfer is pausable", async function () {
    await this.token.transfer(account1, amount, { from: owner });
    let balance = await this.token.balanceOf(account1);
    balance.should.be.bignumber.equal(amount);

    await this.token.pause({ from: owner });

    await this.token.transfer(account2, amount, { from: account1 }).should.be.rejectedWith(Error);;
    balance = await this.token.balanceOf(account2);
    balance.should.be.bignumber.equal(zero);
    await this.token.unpause({ from: owner });
    await this.token.transfer(account2, amount, { from: account1 });
    balance = await this.token.balanceOf(account2);
    balance.should.be.bignumber.equal(amount);
    balance = await this.token.balanceOf(account1);
    balance.should.be.bignumber.equal(zero);
  });

  it("..approval is pausable", async function () {
    await this.token.approve(account1, amount, { from: owner });
    let allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(amount);
    await this.token.increaseAllowance(account1, amount, { from: owner });
    allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(web3.utils.toBN(2 * amount));
    await this.token.decreaseAllowance(account1, amount, { from: owner });
    allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(amount);

    await this.token.pause({ from: owner });

    await this.token.approve(account1, zero, { from: owner }).should.be.rejectedWith(Error);
    allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(amount);
    await this.token.increaseAllowance(account1, amount, { from: owner }).should.be.rejectedWith(Error);
    allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(amount);
    await this.token.decreaseAllowance(account1, amount, { from: owner }).should.be.rejectedWith(Error);
    allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(amount);

    await this.token.unpause({ from: owner });

    await this.token.approve(account1, zero, { from: owner });
    allowance = await this.token.allowance(owner, account1);
    allowance.should.be.bignumber.equal(zero);
  });

  it("..transferFrom is pausable", async function () {
    await this.token.approve(account1, amount, { from: owner });
    await this.token.transferFrom(owner, account1, amount, { from: account1 });
    let balance = await this.token.balanceOf(account1);
    balance.should.be.bignumber.equal(amount);
    await this.token.approve(account2, amount, { from: owner });

    await this.token.pause({ from: owner });
    let allowance = await this.token.allowance(owner, account2);
    allowance.should.be.bignumber.equal(amount);

    await this.token.transferFrom(owner, account2, amount, { from: account2 }).should.be.rejectedWith(Error);
    balance = await this.token.balanceOf(account2);
    balance.should.be.bignumber.equal(zero);
  });

  it("..transfer ownership only to verified account", async function () {

    await this.token.transferOwnership(account1, { from: owner }).should.be.rejectedWith(Error);

    await this.token.registerAccount({ from: account1 });

    await this.token.transferOwnership(account1, { from: owner });

    let newOwner = await this.token.owner();
    newOwner.should.equal(account1)
  });

});