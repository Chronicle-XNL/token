var Token = artifacts.require("./XNLToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Token);
};
