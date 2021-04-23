const AbiCoder = require('web3-eth-abi');
const { getBscscanApiUrl, get, post } = require('./bscscan');
const { merge } = require('sol-merger');
const fs = require("fs");
const querystring = require('querystring');
const axios = require("axios")

async function sleep(timeout) {
    return new Promise((resolve, _reject) => {
        setTimeout(() => resolve(), timeout);
    })
}

// From https://bscscan.com/contract-license-types
const licenses = {
    NO_LICENSE: 1,
    THE_UNLICENSE: 2,
    MIT: 3,
    GPLv2: 4,
    GPLv3: 5,
    LGLPv2_1: 6,
    LGPLv3: 7,
    BSD2: 8,
    BSD3: 9,
    MPL2: 10,
    OSL3: 11,
    APACHE2: 12
};

const RequestStatus = {
    OK: '1',
    NOTOK: '0'
}

async function checkStatus(url, apiKey, token) {
    console.log(`Checking status of ${token}...`);

    // Potential results:
    // { status: '0', message: 'NOTOK', result: 'Fail - Unable to verify' }
    // { status: '0', message: 'NOTOK', result: 'Pending in queue' }
    // { status: '1', message: 'OK', result: 'Pass - Verified' }

    let result = await get(url, {
        apikey: apiKey,
        guid: token,
        module: "contract",
        action: "checkverifystatus"
    });

    result = JSON.parse(result);

    console.log(JSON.stringify(result));

    if (result.result === "Pending in queue") {
        await sleep(5000);
        return await checkStatus(url, apiKey, token);
    }

    if (result.result.startsWith('Fail')) {
        throw new Error(`Bscscan failed to verify contract: ${result.message} "${result.result}"`)
    }

    if (Number(result.status) !== 1) {
        throw new Error(`Bscscan Error: ${result} "${result.result}"`)
    }

    console.log(`Verification result ${result.result}...`);
}

const enforceOrThrow = (condition, message) => {
    if (!condition) throw new Error(message)
}

const fetchMergedSource = async (artifact) => {
    enforceOrThrow(
        fs.existsSync(artifact.sourcePath),
        `Could not find ${artifact.contractName} source file at ${artifact.sourcePath}`
    )

    console.log(`Flattening source file ${artifact.sourcePath}`)

    const pluginList = [];
    let mergedSource = await merge(artifact.sourcePath, { removeComments: false, exportPlugins: pluginList })

    // Bscscan disallows multiple SPDX-License-Identifier statements
    enforceOrThrow(
        (mergedSource.match(/SPDX-License-Identifier:/g) || []).length <= 1,
        'Found duplicate SPDX-License-Identifiers in the Solidity code, please provide the correct license with --license <license identifier>'
    )

    return mergedSource;
}

const fetchConstructorValues = async (artifact, apiKey, apiUrl) => {
    const contractAddress = artifact.address;

    // Fetch the contract creation transaction to extract the input data
    let res
    try {
        const qs = querystring.stringify({
            apiKey: apiKey,
            module: 'account',
            action: 'txlist',
            address: contractAddress,
            page: 1,
            sort: 'asc',
            offset: 1
        })
        const url = `${apiUrl}?${qs}`
        console.log(`Retrieving constructor parameters from ${url}`)
        res = await axios.get(url);
    } catch (e) {
        throw new Error(`Failed to connect to Bscscan API at url ${apiUrl}`)
    }

    // The last part of the transaction data is the constructor arguments
    // If it can't be accessed, try using empty constructor arguments
    const constructorParameters = res.data && res.data.status === RequestStatus.OK && res.data.result[0] !== undefined
        ? res.data.result[0].input.substring(artifact.bytecode.length)
        : ''
    console.log(`Constructor parameters received: 0x${constructorParameters}`)
    return constructorParameters;
}

async function bscscanVerify(artifact, network, apiKey, optimization) {
    await sleep(30000);
    console.log(`Verifying contract ${artifact.contractName} at ${artifact.address}`);

    const mergedSource = await fetchMergedSource(artifact)

    let compilerVersion = `v${artifact.compiler.version.replace('.Emscripten.clang', '')}`;
    let url = getBscscanApiUrl(network);

    const encodedConstructorArgs = await fetchConstructorValues(artifact, apiKey, url);
    console.log("constructor: ", encodedConstructorArgs);

    const verifyData = {
        apikey: apiKey,
        module: 'contract',
        action: 'verifysourcecode',
        codeformat: 'solidity-single-file',
        contractaddress: artifact.address,
        sourceCode: mergedSource,
        contractname: artifact.contractName,
        optimizationUsed: optimization,
        runs: 200,
        compilerversion: compilerVersion,
        constructorArguements: encodedConstructorArgs,
    };

    console.log(`Verifying ${artifact.contractName} at ${artifact.address} with compiler version ${compilerVersion}...`);
    console.log(`Bscscan API Request:\n\n${JSON.stringify(verifyData, undefined, 2)}`);

    // Potential results
    // {"status":"0","message":"NOTOK","result":"Invalid constructor arguments provided. Please verify that they are in ABI-encoded format"}
    // {"status":"1","message":"OK","result":"usjpiyvmxtgwyee59wnycyiet7m3dba4ccdi6acdp8eddlzdde"}

    let result = await post(url, querystring.stringify(verifyData));

    if (Number(result.status) === 0 || result.message !== "OK") {
        if (result.result.includes('Contract source code already verified')) {
            console.log(`Contract already verified`);
        } else {
            throw new Error(`Bscscan Error: ${result.message}: ${result.result}`)
        }
    } else {
        return await checkStatus(url, apiKey, result.result);
    }
}

module.exports = {
    bscscanVerify,
}
