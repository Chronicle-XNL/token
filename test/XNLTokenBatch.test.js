const XNL = artifacts.require("XNLToken");
const XNLDistribution = artifacts.require("XNLDistribution");
const BN = require('bn.js');

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bn')(BN))
    .should();


contract('XNLTokenBatch', function ([owner, account1, account2, account3, account4, account5, account6, account7, private, seed, _]) {
    const ZEROS = '000000000000000000';

    const seedAllocation = '11200000000000000000000000';
    const seedUnlocked = '1680000000000000000000000';
    const privateAllocation = '21000000000000000000000000';
    const privateUnlocked = '4200000000000000000000000'

    const checkBalance = async (token, address, expected) => {
        let balance = await token.balanceOf(address);
        console.log('BalanceOf [', address, '] with expected [', expected.toString(), ']: ', balance.toString())
        balance.should.be.bignumber.equal(expected);
    }

    beforeEach(async function () {
        this.token = await XNL.new({ from: owner });
        await this.token.transfer(seed, seedAllocation, { from: owner })
        await this.token.transfer(private, privateAllocation, { from: owner })
        this.xnlDistribution = await XNLDistribution.new(this.token.address, { from: owner })
    });

    it("..test batch distribution", async function () {
        await this.token.approve(this.xnlDistribution.address, seedUnlocked, { from: seed });
        await this.token.approve(this.xnlDistribution.address, privateUnlocked, { from: private });

        await this.xnlDistribution.distribute([account1, account2, account3], [142500,7500,249743], { from: seed });
        checkBalance(this.token, account1, `142500${ZEROS}`);
        checkBalance(this.token, account2, `7500${ZEROS}`);
        checkBalance(this.token, account3, `249743${ZEROS}`);

        await this.xnlDistribution.distribute([account4, account5],[20000, 11453],{from: private});
        checkBalance(this.token, account4, `20000${ZEROS}`);
        checkBalance(this.token, account5, `11453${ZEROS}`);
    });
});