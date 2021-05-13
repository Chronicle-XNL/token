module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.3", // A version or constraint - Ex. "^0.5.0"
    }
  }
};
