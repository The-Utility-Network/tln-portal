'use client';

import React, { useState, useEffect, useRef } from "react";
import Diamond3D from "./Diamond3D";
import { ethers } from "ethers";
import { getFacets } from "../primitives/Diamond";
import { useActiveAccount } from 'thirdweb/react';
import Directory from "./Directory"; // Import the Directory component
import Mythology from "./Mythology"; // Import the Mythology component
import Principles from "./Principles"; // Import the Principles component
import Reserve from "./Reserve"; // Import the Reserve component
import SignatureBuilder from "./SignatureBuilder"; // Import the SignatureBuilder component
import { styled } from "@mui/material";
import { hasAnyRole as checkHasAnyRole } from '../primitives/TSPABI';

// Define the structure of a Facet
interface Facet {
  facetAddress: string;
  selectors: string[];
}

// Throttle helper: creates a delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper to manage localStorage cache
const cacheKey = "facetCache";

export function readCache() {
  const cache = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
  return cache ? JSON.parse(cache) : { contractNames: {}, methodNames: {}, abis: {} };
}

export function writeCache(cache: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(cacheKey, JSON.stringify(cache));
  }
}

// Classify methods into read or write
function classifyMethods(abi: any[], selectors: string[]) {
  const readMethods: string[] = [];
  const writeMethods: string[] = [];

  const iface = new ethers.Interface(abi);
  for (const selector of selectors) {
    try {
      const method = iface.getFunction(selector);
      if (method) {
        if (method.stateMutability === "view" || method.stateMutability === "pure") {
          readMethods.push(method.name);
        } else {
          writeMethods.push(method.name);
        }
      }
    } catch (error) {
      console.error(`Error classifying selector ${selector}:`, error);
    }
  }

  return { readMethods, writeMethods };
}

// Fetch ABI and Contract Name Functions (With LocalStorage Cache)
async function fetchABIFromBaseScan(address: string, apiKey: string, cache: any) {
  if (cache.abis[address]) return cache.abis[address];

  await delay(600); // Increased delay to 600ms to further prevent rate limits
  try {
    const response = await fetch(
      `https://api.etherscan.io/v2/api?chainid=8453&module=contract&action=getabi&address=${address}&apikey=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "1") {
      try {
        const abi = JSON.parse(data.result);
        cache.abis[address] = abi;
        writeCache(cache);
        return abi;
      } catch (parseError) {
        console.error(`Error parsing ABI for ${address}:`, parseError);
        return null;
      }
    } else if (data.status === "0") {
      console.error(`Error fetching ABI for ${address}: ${data.result}`);
    }
  } catch (error) {
    console.error(`Network error fetching ABI for ${address}:`, error);
  }
  return null;
}

async function fetchContractNameFromBaseScan(
  address: string,
  apiKey: string,
  cache: any
) {
  console.log(`Fetching contract name for address: ${address}`); // Log address

  if (cache.contractNames[address]) {
    console.log(`Contract name found in cache for address: ${address}`);
    return cache.contractNames[address];
  }

  try {
    await delay(600); // Increased delay to 600ms
    const response = await fetch(
      `https://api.etherscan.io/v2/api?chainid=8453&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`
    );
    const data = await response.json();

    console.log(
      `Response from BaseScan for address ${address}:`,
      data
    ); // Log the full API response

    if (
      data.status === "1" &&
      data.result &&
      Array.isArray(data.result) &&
      data.result[0]?.ContractName
    ) {
      const contractName = data.result[0].ContractName;
      cache.contractNames[address] = contractName; // Cache the contract name
      writeCache(cache); // Persist cache
      return contractName;
    } else {
      console.error(
        `Error: Unexpected response or missing contract name for ${address}. Result: ${JSON.stringify(data.result)}`
      );
    }
  } catch (error) {
    console.error(
      `Error fetching contract name from BaseScan for ${address}:`,
      error
    );
  }

  return "Unknown Contract"; // Return default if no contract name is found
}

// Generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function processFacets(
  formattedFacets: Facet[],
  apiKey: string,
  cache: any
) {
  const methodNamesLookup: {
    [key: string]: { readMethods: string[]; writeMethods: string[] };
  } = {};
  const facetNamesLookup: { [key: string]: string } = {};

  for (let i = 0; i < formattedFacets.length; i++) {
    const facet = formattedFacets[i];
    const facetAddress = facet.facetAddress;

    try {
      console.log(`Processing facet address: ${facet.facetAddress}`);

      const contractName = await fetchContractNameFromBaseScan(
        facet.facetAddress,
        apiKey,
        cache
      );
      if (!contractName || contractName === "Unknown Contract") {
        console.warn(
          `Skipping facet address ${facetAddress} due to missing or unknown contract name`
        );
        continue; // Skip to the next facet if contract name is missing
      }

      facetNamesLookup[facet.facetAddress] = contractName;

      const abi = await fetchABIFromBaseScan(
        facet.facetAddress,
        apiKey,
        cache
      );
      if (!abi) {
        console.warn(
          `Skipping facet address ${facetAddress} due to missing ABI`
        );
        methodNamesLookup[facet.facetAddress] = { readMethods: [], writeMethods: [] };
        continue; // Skip to the next facet if ABI is missing
      }

      const { readMethods, writeMethods } = classifyMethods(abi, facet.selectors);
      methodNamesLookup[facet.facetAddress] = { readMethods, writeMethods };
    } catch (error) {
      console.error(`Error processing facet at ${facetAddress}:`, error);
      continue; // Continue with the next facet on error
    }

    await delay(600); // Increased delay to further prevent rate limits
  }

  return { methodNamesLookup, facetNamesLookup };
}

interface AnalyzePanelProps {
  directoryFacetAddress: string;
  p0: string;
  cache: any;
}

const AnalyzePanel: React.FC<AnalyzePanelProps> = ({ directoryFacetAddress, p0, cache }) => {
  const [facets, setFacets] = useState<Facet[]>([]);
  const [methodNames, setMethodNames] = useState<any>({});
  const [facetNames, setFacetNames] = useState<any>({});
  const [facetAbis, setFacetAbis] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const currentCache = readCache();
      const apiKey = process.env.NEXT_PUBLIC_EXPLORER_API_KEY || "";

      try {
        const data = await getFacets();
        const formattedFacets = data.map((f: any) => ({
          facetAddress: f.target as string,
          selectors: Array.from(f.selectors) as string[],
        }));
        setFacets(formattedFacets);

        const { methodNamesLookup, facetNamesLookup } = await processFacets(formattedFacets, apiKey, currentCache);

        const abis: any = {};
        formattedFacets.forEach((f: Facet) => {
          if (currentCache.abis[f.facetAddress]) {
            abis[f.facetAddress] = currentCache.abis[f.facetAddress];
          }
        });
        setFacetAbis(abis);

        setMethodNames(methodNamesLookup);
        setFacetNames(facetNamesLookup);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading diamond data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      <div className="w-full h-full pointer-events-auto">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(0,191,138,0.4)]" />
              <div className="text-brand-300 font-mono animate-pulse tracking-[0.3em] text-sm uppercase">
                Synchronizing.Diamond.Net...
              </div>
            </div>
          </div>
        ) : (
          <Diamond3D
            facets={facets}
            methodNames={methodNames}
            facetNames={facetNames}
            facetAbis={facetAbis}
          />
        )}
      </div>
    </div>
  );
};

export { processFacets };
export default AnalyzePanel;
