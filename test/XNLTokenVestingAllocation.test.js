const XNL = artifacts.require("XNLToken");
const BN = require('bn.js');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();


contract('XNLTokenVesting', function ([owner, account1, account2, account3, account4, account5, account6, account7, account8, account9, _]) {

  const ZEROS = '000000000000000000'

  const checkBalance = async (token, address, expected) => {
    let balance = await token.balanceOf(address);
    console.log('BalanceOf [', address, '] with expected [', expected.toString(), ']: ', balance.toString())
    balance.should.be.bignumber.equal(expected);
  }

  const checkVesting = async (token, address, day, expected) => {
    let res = await token.vestingAsOf(day, { from: address });
    // console.log(`${day}, ${day - dateTGE}, ${res.amountVested.toString()}, ${expected.toString()}`)
    res.amountVested.should.be.bignumber.equal(expected);
  }

  const checkVestingApproximatly = async (token, address, day, expectedMin, expectedMax) => {
    let res = await token.vestingAsOf(day, { from: address });
    // console.log(`${day}, ${day - dateTGE}, ${res.amountVested.toString()}, ${expectedMin.toString()}, ${expectedMax.toString()}`)
    res.amountVested.should.be.bignumber.least(expectedMin);
    res.amountVested.should.be.bignumber.most(expectedMax);
  }

  const dateTGE = 18757;

  const zero = new BN(0);

  beforeEach(async function () {
    this.token = await XNL.new({ from: owner });
    console.log('Today: ', (await this.token.today()).toString())
  });

  it("..seed tokens are vested 5% initially, then starting 1 month later daily for 10 months", async function () {
    const seed1 = new BN(`1000000${ZEROS}`)
    const seed1Vested = new BN(`950000${ZEROS}`)
    const seed1DailyMin = new BN(`3166666666666666666666`)
    const seed1DailyMax = new BN(`3166666666666666666667`)
    const seed2 = new BN(`1333333${ZEROS}`)
    const seed2Vested = new BN(`1266666350000000000000000`)
    const seed2DailyMin = new BN(`4222221166666666666666`)
    const seed2DailyMax = new BN(`4222221166666666666667`)
    const seed3 = new BN(`133333${ZEROS}`)
    const seed3Vested = new BN(`126666350000000000000000`)
    const seed3DailyMin = new BN(`422221166666666666666`)
    const seed3DailyMax = new BN(`422221166666666666667`)


    await this.token.grantVestingTokens(
      account1, seed1, seed1Vested, dateTGE + 30, 300, 0, 1,
      { from: owner }
    );
    await this.token.grantVestingTokens(
      account2, seed2, seed2Vested, dateTGE + 30, 300, 0, 1,
      { from: owner }
    );
    await this.token.grantVestingTokens(
      account3, seed3, seed3Vested, dateTGE + 30, 300, 0, 1,
      { from: owner }
    );

    await checkBalance(this.token, account1, seed1);
    await checkBalance(this.token, account2, seed2);
    await checkBalance(this.token, account3, seed3);

    for (let index = 0; index < 331; index++) {
      if (index < 31) {
        await checkVesting(this.token, account1, dateTGE + index, zero);
        await checkVesting(this.token, account2, dateTGE + index, zero);
        await checkVesting(this.token, account3, dateTGE + index, zero);
      } else if (index < 330) {
        let mul = new BN(index - 30);
        await checkVestingApproximatly(this.token, account1, dateTGE + index, seed1DailyMin.mul(mul), seed1DailyMax.mul(mul));
        await checkVestingApproximatly(this.token, account2, dateTGE + index, seed2DailyMin.mul(mul), seed2DailyMax.mul(mul));
        await checkVestingApproximatly(this.token, account3, dateTGE + index, seed3DailyMin.mul(mul), seed3DailyMax.mul(mul));
      } else {
        await checkVesting(this.token, account1, dateTGE + index, seed1Vested);
        await checkVesting(this.token, account2, dateTGE + index, seed2Vested);
        await checkVesting(this.token, account3, dateTGE + index, seed3Vested);
      }
    }
  });

  it("..partnership tokens (10,000,000) are distibuted 6 month cliff, then 20% released every 3 months", async function () {
    const allocated = new BN('15000000000000000000000000');
    await this.token.grantVestingTokens(
      account1, allocated, allocated, dateTGE + 90, 450, 0, 90,
      { from: owner }
    );
    await checkBalance(this.token, account1, allocated);
    const interval1 = new BN('3000000000000000000000000');
    const interval2 = new BN('6000000000000000000000000');
    const interval3 = new BN('9000000000000000000000000');
    const interval4 = new BN('12000000000000000000000000');
    for (let index = 0; index < 600; index++) {
      if (index < 180) {
        await checkVesting(this.token, account1, dateTGE + index, zero);
      } else if (index < 270) {
        await checkVesting(this.token, account1, dateTGE + index, interval1);
      } else if (index < 360) {
        await checkVesting(this.token, account1, dateTGE + index, interval2);
      } else if (index < 450) {
        await checkVesting(this.token, account1, dateTGE + index, interval3);
      } else if (index < 540) {
        await checkVesting(this.token, account1, dateTGE + index, interval4);
      } else {
        await checkVesting(this.token, account1, dateTGE + index, allocated);
      }
    }
  });

  it("..team tokens (15,000,000) are distibuted 12 months cliff, then 20% released every 3 months", async function () {
    const allocated = new BN('15000000000000000000000000'); // 15,000,000XNL
    await this.token.grantVestingTokens(
      account1, allocated, allocated, dateTGE + 270, 450, 0, 90,
      { from: owner }
    );
    await checkBalance(this.token, account1, allocated);
    const interval1 = new BN('3000000000000000000000000');
    const interval2 = new BN('6000000000000000000000000');
    const interval3 = new BN('9000000000000000000000000');
    const interval4 = new BN('12000000000000000000000000');

    for (let index = 0; index < 750; index++) {
      if (index < 360) {
        await checkVesting(this.token, account1, dateTGE + index, zero);
      } else if (index < 450) {
        await checkVesting(this.token, account1, dateTGE + index, interval1);
      } else if (index < 540) {
        await checkVesting(this.token, account1, dateTGE + index, interval2);
      } else if (index < 630) {
        await checkVesting(this.token, account1, dateTGE + index, interval3);
      } else if (index < 720) {
        await checkVesting(this.token, account1, dateTGE + index, interval4);
      } else {
        await checkVesting(this.token, account1, dateTGE + index, allocated);
      }
    }
  });

  it("..advisors tokens (5,000,000) are distibuted 12 months cliff, then 20% released every 3 months", async function () {
    const allocated = new BN('5000000000000000000000000');
    await this.token.grantVestingTokens(
      account1, allocated, allocated, dateTGE + 270, 450, 0, 90,
      { from: owner }
    );
    await checkBalance(this.token, account1, allocated);
    const interval1 = new BN('1000000000000000000000000');
    const interval2 = new BN('2000000000000000000000000');
    const interval3 = new BN('3000000000000000000000000');
    const interval4 = new BN('4000000000000000000000000');
    for (let index = 0; index < 750; index++) {
      if (index < 360) {
        await checkVesting(this.token, account1, dateTGE + index, zero);
      } else if (index < 450) {
        await checkVesting(this.token, account1, dateTGE + index, interval1);
      } else if (index < 540) {
        await checkVesting(this.token, account1, dateTGE + index, interval2);
      } else if (index < 630) {
        await checkVesting(this.token, account1, dateTGE + index, interval3);
      } else if (index < 720) {
        await checkVesting(this.token, account1, dateTGE + index, interval4);
      } else {
        await checkVesting(this.token, account1, dateTGE + index, allocated);
      }
    }
  });

  it("..community tokens (17,000,000) are distibuted, 1 month cliff, then 8.33% released every 1 month for 12months", async function () {
    const allocated = new BN('17000000000000000000000000');
    await this.token.grantVestingTokens(
      account1, allocated, allocated, dateTGE, 360, 0, 30,
      { from: owner }
    );
    await checkBalance(this.token, account1, allocated);
    const interval1 = new BN('1416666666666666666666666');
    const interval2 = new BN('2833333333333333333333333');
    const interval3 = new BN('4250000000000000000000000');
    const interval4 = new BN('5666666666666666666666666');
    const interval5 = new BN('7083333333333333333333333');
    const interval6 = new BN('8500000000000000000000000');
    const interval7 = new BN('9916666666666666666666666');
    const interval8 = new BN('11333333333333333333333333')
    const interval9 = new BN('12750000000000000000000000');
    const interval10 = new BN('14166666666666666666666666');
    const interval11 = new BN('15583333333333333333333333');

    for (let index = 0; index < 400; index++) {
      if (index < 30) {
        await checkVesting(this.token, account1, dateTGE + index, zero);
      } else if (index < 60) {
        await checkVesting(this.token, account1, dateTGE + index, interval1);
      } else if (index < 90) {
        await checkVesting(this.token, account1, dateTGE + index, interval2);
      } else if (index < 120) {
        await checkVesting(this.token, account1, dateTGE + index, interval3);
      } else if (index < 150) {
        await checkVesting(this.token, account1, dateTGE + index, interval4);
      } else if (index < 180) {
        await checkVesting(this.token, account1, dateTGE + index, interval5);
      } else if (index < 210) {
        await checkVesting(this.token, account1, dateTGE + index, interval6);
      } else if (index < 240) {
        await checkVesting(this.token, account1, dateTGE + index, interval7);
      } else if (index < 270) {
        await checkVesting(this.token, account1, dateTGE + index, interval8);
      } else if (index < 300) {
        await checkVesting(this.token, account1, dateTGE + index, interval9);
      } else if (index < 330) {
        await checkVesting(this.token, account1, dateTGE + index, interval10);
      } else if (index < 360) {
        await checkVesting(this.token, account1, dateTGE + index, interval11);
      } else {
        await checkVesting(this.token, account1, dateTGE + index, allocated);
      }
    }
  });

  it("..foundation tokens (10,000,000) are distibuted 6 month cliff, then 20% released every 3 months", async function () {
    const allocated = new BN('10000000000000000000000000');
    await this.token.grantVestingTokens(
      account1, allocated, allocated, dateTGE + 90, 450, 0, 90,
      { from: owner }
    );
    await checkBalance(this.token, account1, allocated);
    const interval1 = new BN('2000000000000000000000000');
    const interval2 = new BN('4000000000000000000000000');
    const interval3 = new BN('6000000000000000000000000');
    const interval4 = new BN('8000000000000000000000000');
    for (let index = 0; index < 600; index++) {
      if (index < 180) {
        await checkVesting(this.token, account1, dateTGE + index, zero);
      } else if (index < 270) {
        await checkVesting(this.token, account1, dateTGE + index, interval1);
      } else if (index < 360) {
        await checkVesting(this.token, account1, dateTGE + index, interval2);
      } else if (index < 450) {
        await checkVesting(this.token, account1, dateTGE + index, interval3);
      } else if (index < 540) {
        await checkVesting(this.token, account1, dateTGE + index, interval4);
      } else {
        await checkVesting(this.token, account1, dateTGE + index, allocated);
      }
    }
  });

});