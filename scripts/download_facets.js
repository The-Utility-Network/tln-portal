const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'T7AGNJ4E7D9MEUS1CFJ8V5Y1UIGEFH7FJ7';
const CHAIN_ID = 8453;
const TARGET_DIR = path.resolve(__dirname, '../../Diamonds/TLN/contracts');

// Create target dir
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const facets = require('../facets.json');

async function downloadFacet(address) {
    console.log(`Downloading ${address}...`);
    try {
        const url = `https://api.etherscan.io/v2/api?chainid=${CHAIN_ID}&module=contract&action=getsourcecode&address=${address}&apikey=${API_KEY}`;
        const resp = await axios.get(url);

        if (resp.data.status !== '1') {
            console.error(`Failed to fetch ${address}: ${resp.data.message}`);
            return;
        }

        const result = resp.data.result[0];
        const contractName = result.ContractName;
        let sourceCode = result.SourceCode;

        if (sourceCode.startsWith('{{')) {
            if (sourceCode.startsWith('{{') && sourceCode.endsWith('}}')) {
                sourceCode = sourceCode.slice(1, -1);
            }

            const sourceObj = JSON.parse(sourceCode);
            const sources = sourceObj.sources || sourceObj;

            const facetFolder = path.join(TARGET_DIR, contractName);
            if (!fs.existsSync(facetFolder)) fs.mkdirSync(facetFolder, { recursive: true });

            for (const [filePath, contentObj] of Object.entries(sources)) {
                const content = contentObj.content;
                const fileName = path.basename(filePath);
                fs.writeFileSync(path.join(facetFolder, fileName), content);
            }
            console.log(`Saved multi-file contract ${contractName}`);

        } else {
            const filePath = path.join(TARGET_DIR, `${contractName}.sol`);
            fs.writeFileSync(filePath, sourceCode);
            console.log(`Saved single file ${contractName}`);
        }

    } catch (e) {
        console.error(`Error downloading ${address}:`, e.message);
    }
}

async function main() {
    for (const addr of facets) {
        await downloadFacet(addr);
        await new Promise(r => setTimeout(r, 250));
    }
}

main();
