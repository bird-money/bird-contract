const request = require('request');

function getBscscanApiUrl(network) {
    let host = {
        mainnet: 'api.bscscan.com',
        testnet: 'api-testnet.bscscan.com'
    }[network];

    if (!host) {
        throw new Error(`Unknown bscscan API host for network ${network}`);
    }

    return `https://${host}/api`;
}

function getBscscanUrl(network) {
    let host = {
        mainnet: 'bscscan.com',
        testnet: 'testnet.bscscan.com'
    }[network];

    if (!host) {
        throw new Error(`Unknown bscscan host for network ${network}`);
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
    getBscscanApiUrl,
    getBscscanUrl,
    post,
    get,
}
