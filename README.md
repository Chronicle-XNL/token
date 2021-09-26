# XNL token - ethereum smart contract

Preminted pauseable burnable ERC20 token with vesting ability.

The token smart contract was implemented using [OpenZeppelin library](https://github.com/OpenZeppelin/openzeppelin-contracts) 
and vesting feature is inspired by [CPUcoin](https://github.com/cpu-coin/CPUcoin).

- Symbol: **XNL**
- Supply: **100,000,000 XNL**

Implementation with imported contract is in XNLToken.sol and there is also flattend version XNLToken.flat.sol.

## Technical stack

#### Smart contract/Solidity
- Truffle

## Prerequisites
In order to run the project, you will need [Node.js](https://nodejs.org) (tested with version 8.x.x). This will include npm, needed to install dependencies.

## Installation and Building

1. Install truffle.
    ```javascript    
    npm install -g truffle
    ```


2. Download and install ethereum client for local development - Ganache Client. This client is recomended because migration script is customised for this setup to compile smart contracts, deploye them to network and in the end to udpate smart contracts defifinition abi and config file in react-app-typescript.
    ```javascript    
    http://truffleframework.com/ganache/
    ```

3. Install yarn.

    ```javascript
    ## MacOS
    brew install yarn

    ## Windows
    https://yarnpkg.com/en/docs/install#windows-tab
    ```

4. Download or clone repository.

5. Install the node dependencies.
    ```javascript
    yarn install
    ```

6. Launch Ganache client

7. Compile and migrate the contracts. This command compile all smart contracts and redeploy them on the network
    ```javascript
    truffle migrate --compile-all --reset
    ```
8. Truffle's own suite is included for smart contracts. Be sure you've compile your contracts before running jest, or you'll receive some file not found errors.
    ```javascript
    // Runs Truffle's test suite for smart contract tests.
    truffle test
    ```


## Generating flat version of contract
Flat version of contract is the easist way how to load contract in Remix-IDE, deploy to ETH network and attach code to deployed contract.

1. Install truffle-flattener.
    ```javascript    
    npm install -g truffle-flattener -g
    ```

2. Delete old version of XNLToken.flat.sol

3. Run flattener
    ```javascript
    truffle-flattener contracts/XNLToken.sol >> contracts/XNLToken.flat.sol
    truffle-flattener contracts/XNLDistribution.sol >> contracts/XNLDistribution.flat.sol
    ```
4. Leave only first occurance of this line in flattend file 

    // SPDX-License-Identifier: MIT

    and remove all others