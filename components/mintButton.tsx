// 'use client'
// import { useState, useEffect, use } from 'react';
// import { ethers } from 'ethers';
// import { TransactionButton, ThirdwebProvider, useActiveAccount, useActiveWallet, useConnectedWallets } from 'thirdweb/react';
// import { contract } from '../primitives/TSPABI';
// import { prepareContractCall, sendAndConfirmTransaction } from 'thirdweb';
// import Image from 'next/image';
// import { readContract } from 'thirdweb';
// import EsperanzaC from './Esperanza';

// function Minting({ Batch, tokens, whitelist, referral, batchPrice }: { Batch: number, tokens: number, whitelist: boolean, referral: string, batchPrice: number }) {
//   const [amount, setAmount] = useState(1);
//   const [isWLActive, setIsWLActive] = useState(false);
//   const [isActive, setIsActive] = useState(false);
//   const wallet = useActiveWallet()?.getAccount();
//   const address = useActiveAccount()?.address;
//   const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [buttonState, setButtonState] = useState('default');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [transactionHash, setTransactionHash] = useState<string | null>(null);
//   const [tokenContractAddress, setTokenContractAddress] = useState<string | null>(null);

//   const batchInfo = readContract({
//     contract: contract,
//     method: "Batchs",
//     params: [BigInt(Batch)],
//   });

//   // Print the Batch number
//   // console.log('Batch:', Batch);
  
//   const isActiveStatus = readContract({
//     contract: contract,
//     method: "isActive",
//   });
  
//   const isWLActiveStatus = readContract({
//     contract: contract,
//     method: "isWLActive",
//   });
  
//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         const info = await batchInfo;
//         const activeStatus = await isActiveStatus;
//         const wlActiveStatus = await isWLActiveStatus;

//         if (isMounted) {
//           if (info) {
//             console.log('Batched  Price:', info[2]);
//           }
//           setIsActive(activeStatus);
//           setIsWLActive(wlActiveStatus);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [batchInfo, isActiveStatus, isWLActiveStatus]);

//   const makeAPICall = async (url: string | URL | Request, requestBody: {
//       referralCode: any;
//       customerWallet: string; tokenAmount: string; status: string;
//     }) => {
//     try {
//       // console.log(JSON.stringify(requestBody));
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody),
//       });
//       const result = await response.json();
//       // console.log('API call result:', result);
//     } catch (error) {
//       console.error('Error making API call:', error);
//     }
//   };

//   const handleTransaction = async () => {
//     if (!address) {
//       console.error("Address is undefined");
//       return;
//     }

//     if (!wallet) {
//       console.error("Wallet or wallet address is undefined");
//       return;
//     }

//     const valueInWei = batchPrice * Number(tokens);
//     console.log('Value in Wei:', Number(valueInWei));
//     const params: [bigint, bigint, boolean] = [BigInt(Batch), BigInt(tokens), whitelist];
//     const confirmedURL = 'https://mint.thelochnessbotanicalsociety.com/referralPostback.php';

//     if (referral) {
//       makeAPICall(confirmedURL, {
//         referralCode: referral, // Replace with actual referral code
//         customerWallet: address,
//         tokenAmount: tokens.toString(),
//         status: "0"
//       });
//     }

//     try {
//       const transaction = prepareContractCall({
//         contract,
//         method: "mint",
//         params: params,
//         value: BigInt(valueInWei.toString()),
//       });

//       setButtonState('submitting');

//       const receipt = await sendAndConfirmTransaction({
//         transaction,
//         account: wallet,
//       });
    
//       if (receipt && receipt.transactionHash) {
//         // Save transaction hash to state
//         setTransactionHash(receipt.transactionHash);
//         setTokenContractAddress(receipt.to);
//       }

//       // console.log('Transaction receipt:', receipt);
//       if (referral) {
//         makeAPICall(confirmedURL, {
//           referralCode: referral, // Replace with actual referral code
//           customerWallet: address,
//           tokenAmount: tokens.toString(),
//           status: "1"
//         });
//       }
//       setModalIsOpen(true);
//       setButtonState('confirmed');
//       } catch (error: any) {
//       // console.error('Transaction preparation failed:', error);
//       setButtonState('default');
//       if (error && error.message && typeof error.message === 'string') {
//         let mainErrorMessage = 'An unknown error occurred';
//         const lines = error.message.split('\n');
//         if (lines.length > 0) {
//           const firstLineParts = lines[0].split('Error - ');
//           if (firstLineParts.length > 1) {
//             mainErrorMessage = firstLineParts[1];
//           }
//         }
//         if (error.code === 3) {
//           mainErrorMessage = 'Insufficient funds';
//         }
//         setErrorMessage(mainErrorMessage);
//       } else {
//         setErrorMessage('Transaction Reverted');
//       }
//       setErrorModalIsOpen(true);
//     }
//   };

//   return (
//     <ThirdwebProvider>
//       <div className="flex flex-col items-center justify-center p-0 sm:p-1">
//         <button
//           className={`transaction-button ${buttonState}`}
//           onClick={handleTransaction}
//           disabled={buttonState !== 'default'}
//           style={{
//             // border: '2px solid',
//             // borderImageSource: 'linear-gradient(45deg, #10B981, #6EE7B7, #10B981)',
//             // borderImageSlice: 1,
//             animation: 'gleam 5s infinite',
//             boxShadow: '0 0 10px #00bf8a', // Add this line
//             minWidth: 'auto',
//             padding: '0rem 1rem',
//             height: '30px',
//             // backgroundColor: 'rgba(64, 224, 208, 0.2)', // Dark emerald color
//             color: 'white',
//             marginTop: '0px',
//             opacity: '1', // Make it transparent
//             backdropFilter: 'blur(10px)', // Add this line
//             WebkitBackdropFilter: 'blur(10px)', // Add this line for Safari
//           }}
//         >
//           {buttonState === 'submitting' ? 'Submitting...' : 'Pay (Crypto)'}
//         </button>
//         {modalIsOpen && (
//           <div 
//             className="fixed z-10 inset-0 rounded-lg overflow-hidden flex items-center justify-center"
//             style={{
//               backdropFilter: 'blur(30px)',
//               WebkitBackdropFilter: 'blur(30px)',
//               backgroundColor: 'rgba(0, 0, 0, 0.3)',
//             }}
//           >            
//             <div 
//               className="relative rounded-lg shadow-xl w-full h-full md:max-w-md mx-auto flex flex-col items-center justify-center bg-emerald-500 bg-opacity-30"
//             >
//               <div className="absolute top-0 w-full">
//                 <video autoPlay muted loop className="w-full h-auto rounded-t-lg">
//                   <source src="/minted.mp4" type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//                 <button
//                   onClick={() => setModalIsOpen(false)}
//                   className="absolute top-0 right-0 m-4 bg-emerald-500 text-white rounded-full p-2"
//                   style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="relative pb-2 translate-y-10 flex flex-col items-center justify-center space-y-6 p-6">
//                 <h2 className="text-center text-gray-100 text-2xl font-bold">Transaction Complete</h2>
//                 <div className="flex flex-col space-y-4 items-center">
//                   <p className="text-center text-gray-100 text-lg">
//                     Congratulations on minting an NFT by
//                   </p>
//                   <img src="/tln.png" alt="Requiem Electric LLC Logo" className="w-64 h-auto mx-auto block" />
//                 </div>
//                 {transactionHash && (
//                   <div className="flex space-x-4 overflow-hidden p-2">
//                     <a 
//                       href={`https://sepolia.etherscan.io/tx/${transactionHash}`} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center justify-center w-32 h-12 text-xs font-medium leading-6 text-center text-white uppercase transition bg-emerald-500 rounded shadow ripple hover:shadow-lg hover:bg-emerald-600 focus:outline-none"
//                       style={{
//                         backdropFilter: 'blur(10px)',
//                         WebkitBackdropFilter: 'blur(10px)',
//                         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                       }}
//                     >
//                       <img src="/etherscan.svg" alt="Etherscan" className="w-auto h-7 p-1" />
//                     </a>
//                     <a 
//                       href={`https://digibazaar.io/ethereum/collection/${tokenContractAddress}`} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center justify-center w-32 h-12 text-xs font-medium leading-6 text-center text-white uppercase transition bg-emerald-500 rounded shadow ripple hover:shadow-lg hover:bg-emerald-600 focus:outline-none"
//                       style={{
//                         backdropFilter: 'blur(10px)',
//                         WebkitBackdropFilter: 'blur(10px)',
//                         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                       }}
//                     >
//                       <img src="/dbw.png" alt="DigiBazaar" className="w-auto h-9 p-1" />
//                     </a>
//                   </div>
//                 )}
//                 <EsperanzaC />
//               </div>
//               <div className="absolute w-full overflow-hidden">
//                 <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-l-md flex items-center w-full sm:px-6 sm:py-2" style={{ backgroundColor: 'rgba(0, 255, 0, 0.5)' }}>
//                   <div className="flex justify-between items-center w-full">
//                     <div className="whitespace-nowrap overflow-hidden w-3/4" style={{ animation: 'marquee 10s linear infinite' }}>
//                       <span className="block inline-block pb-2">Speak to Esperanza to begin your journey!</span>
//                     </div>
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//               <style jsx>{`
//                 @keyframes marquee {
//                   0% { transform: translateX(0); }
//                   100% { transform: translateX(-100%); }
//                 }
//               `}</style>
//             </div>
//           </div>
//         )}
//         {errorModalIsOpen && (
//           <div 
//             className="fixed z-10 inset-0 rounded-lg overflow-y-auto flex items-center justify-center"
//             style={{
//               backdropFilter: 'blur(10px)',
//               WebkitBackdropFilter: 'blur(10px)',
//               backgroundColor: 'rgba(255, 255, 255, 0.1)',
//             }}
//           >            
//             <div 
//               className="relative rounded-lg shadow-xl w-4/5 md:max-w-md mx-auto p-6 flex flex-col items-center justify-center bg-orange-500 bg-opacity-30 backdrop-filter backdrop-blur-lg"
//             >
//               <div className="h-12 w-12 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
//                 </svg>
//               </div>
//               <h2 className="text-center text-gray-100 text-2xl font-bold">Please Try Again</h2>
//               <p className="text-center text-gray-100 text-lg">
//                 {errorMessage}
//               </p>
//               <button
//                 onClick={() => setErrorModalIsOpen(false)}
//                 className="block w-full py-2 rounded-md bg-orange-700 text-white cursor-pointer mt-4"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </ThirdwebProvider>
//   );
// }

// export default Minting;