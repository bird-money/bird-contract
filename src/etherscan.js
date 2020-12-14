const request = require('request');

function getEtherscanApiUrl(network) {
    let host = {
        kovan: 'api-kovan.etherscan.io',
        rinkeby: 'api-rinkeby.etherscan.io',
        ropsten: 'api-ropsten.etherscan.io',
        goerli: 'api-goerli.etherscan.io',
        mainnet: 'api.etherscan.io'
    }[network];

    if (!host) {
        throw new Error(`Unknown etherscan API host for network ${network}`);
    }

    return `https://${host}/api`;
}

function getEtherscanUrl(network) {
    let host = {
        kovan: 'kovan.etherscan.io',
        rinkeby: 'rinkeby.etherscan.io',
        ropsten: 'ropsten.etherscan.io',
        goerli: 'goerli.etherscan.io',
        mainnet: 'etherscan.io'
    }[network];

    if (!host) {
        throw new Error(`Unknown etherscan host for network ${network}`);
    }

    return `https://${host}`;
}

function post(url, data) {
    return new Promise((resolve, reject) => {
        request.post(url, { form: data }, (err, httpResponse, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

function get(url, data, parser) {
    return new Promise((resolve, reject) => {
        request.get(url, { form: data }, (err, httpResponse, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(parser ? parser(body) : body);
            }
        });
    });
}

module.exports = {
    getEtherscanApiUrl,
    getEtherscanUrl,
    post,
    get,
}
