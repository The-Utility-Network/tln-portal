const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const address = '0xE7665365C95D1C66b67A53D6A92813741ed7B2Dd';

    // Minimal ABI for DiamondLoupe
    const abi = [
        "function facets() external view returns (tuple(address target, bytes4[] selectors)[])"
    ];

    const contract = new ethers.Contract(address, abi, provider);

    console.log(`Fetching facets for diamond at ${address}...`);
    try {
        const facets = await contract.facets();
        console.log("Facets found:", facets.length);

        const uniqueAddresses = new Set();
        facets.forEach(f => {
            uniqueAddresses.add(f.target);
            console.log(`Facet Address: ${f.target}, Selectors: ${f.selectors.length}`);
        });

        const fs = require('fs');
        const jsonContent = JSON.stringify(Array.from(uniqueAddresses), null, 2);
        console.log("\nUnique Facet Addresses (JSON):");
        console.log(jsonContent);
        fs.writeFileSync('facets.json', jsonContent);

    } catch (error) {
        console.error("Error fetching facets:", error);
    }
}

main();
