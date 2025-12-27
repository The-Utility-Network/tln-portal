import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  getContract,
  readContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from 'thirdweb';
import { getThirdwebClient } from '../src/utils/createThirdwebClient';
import { useActiveWallet } from 'thirdweb/react';
import { base } from 'thirdweb/chains';
import { getDiamondAddress } from '../primitives/Diamond';

// Browser-safe Thirdweb client getter
async function getThirdwebBrowserClient() {
  return getThirdwebClient();
}

// Replace with your actual contract address
let contractAddressPromise: Promise<string> | null = null;
const getContractAddress = async () => {
  if (!contractAddressPromise) contractAddressPromise = getDiamondAddress();
  return contractAddressPromise;
};

// Contract ABI (Matches the iehome/tspom structure for consistency)
const abi: any = [
  { "inputs": [], "name": "EnumerableSet__IndexOutOfBounds", "type": "error" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "PrinciplesAccepted", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "oldName", "type": "string" }, { "indexed": false, "internalType": "string", "name": "newName", "type": "string" }], "name": "SignerNameUpdated", "type": "event" },
  { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "acceptPrinciples", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getAcceptanceSignature", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" },
  { "inputs": [], "name": "getAllPrinciples", "outputs": [{ "components": [{ "internalType": "string", "name": "japaneseName", "type": "string" }, { "internalType": "string", "name": "englishName", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }], "internalType": "struct TUCOperatingPrinciples.Principle[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getAllSigners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getPrinciple", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getPrincipleCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getSignerCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "signer", "type": "address" }], "name": "getSignerDetails", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "hasPrinciplesAccepted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "initializePrinciples", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "isPrinciplesInitialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "string", "name": "newName", "type": "string" }], "name": "updateSignerName", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

// Define a set of unique colors for expanded accordions (adapted for Emerald theme)
const principleColors = [
  'rgba(0, 191, 138, 0.2)',   // Brand Emerald
  'rgba(0, 255, 127, 0.2)',   // Spring Green
  'rgba(127, 255, 0, 0.15)',  // Chartreuse
  'rgba(152, 251, 152, 0.2)',  // Pale Green
  'rgba(0, 128, 128, 0.2)',    // Teal
  'rgba(32, 178, 170, 0.2)',   // Light Sea Green
  'rgba(0, 250, 154, 0.2)',    // Medium Spring Green
  'rgba(144, 238, 144, 0.2)',  // Light Green
];

// Styled components with elevated glassmorphism
const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 13, 9, 0.85)', // Very dark emerald bg
  backdropFilter: 'blur(20px)',
  maxHeight: '100vh',
  minHeight: '80vh',
  marginTop: '40px',
  borderRadius: '40px',
  padding: theme.spacing(4),
  color: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
  border: '1px solid rgba(0, 191, 138, 0.3)',
  boxShadow: '0 0 50px rgba(0, 191, 138, 0.1)',
  '&::-webkit-scrollbar': { width: '4px' },
  '&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.1)' },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(0,191,138,0.2)', borderRadius: '2px' },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  color: '#FFFFFF',
  marginBottom: theme.spacing(2),
  borderRadius: '16px !important',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&::before': { display: 'none' },
  '&:hover': {
    border: '1px solid rgba(0, 191, 138, 0.4)',
    backgroundColor: 'rgba(0, 191, 138, 0.05)',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  '& .MuiAccordionSummary-content': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme, expanded }: { theme: any, expanded: boolean }) => ({
  backgroundColor: expanded ? 'rgba(0, 191, 138, 0.1)' : 'transparent',
  backdropFilter: 'blur(8px)',
  borderRadius: '0 0 16px 16px',
  padding: theme.spacing(3),
  transition: 'background-color 0.3s ease',
  borderTop: '1px solid rgba(0, 191, 138, 0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00bf8a', // Standard Emerald
  color: '#000000',
  fontWeight: 'bold',
  fontFamily: 'var(--font-rajdhani)',
  letterSpacing: '0.1em',
  '&:hover': {
    backgroundColor: '#00d69b',
    transform: 'translateY(-2px)',
    boxShadow: '0 0 20px rgba(0, 191, 138, 0.4)',
  },
  marginTop: theme.spacing(3),
  borderRadius: '12px',
  padding: '12px 32px',
  fontSize: '16px',
  transition: 'all 0.3s ease',
}));

const CustomInput = styled('input')(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(8px)',
  color: '#FFFFFF',
  border: '1px solid rgba(0, 191, 138, 0.3)',
  borderRadius: '12px',
  padding: '14px 20px',
  width: '100%',
  maxWidth: '400px',
  marginTop: '10px',
  fontSize: '16px',
  outline: 'none',
  fontFamily: 'var(--font-inter)',
  transition: 'all 0.3s ease',
  '&:focus': {
    border: '1px solid #00bf8a',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 15px rgba(0, 191, 138, 0.2)',
  },
}));

const OperatingPrinciples = () => {
  const [principles, setPrinciples] = useState<any[]>([]);
  const [signerCount, setSignerCount] = useState<number>(0);
  const [hasAccepted, setHasAccepted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);

  const wallet = useActiveWallet()?.getAccount() as any;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchPrinciples();
    fetchSignerCount();
    if (wallet) {
      checkIfUserHasAccepted();
    }
  }, [wallet]);

  const fetchPrinciples = async () => {
    try {
      const client = await getThirdwebBrowserClient();
      const address = await getContractAddress();
      const contract = getContract({ client, chain: base, address, abi });
      const result = await readContract({ contract, method: 'getAllPrinciples', params: [] });
      setPrinciples(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching principles:', error);
    }
  };

  const fetchSignerCount = async () => {
    try {
      const client = await getThirdwebBrowserClient();
      const address = await getContractAddress();
      const contract = getContract({ client, chain: base, address, abi });
      const count = await readContract({ contract, method: 'getSignerCount', params: [] });
      setSignerCount(Number(count));
    } catch (error) {
      console.error('Error fetching signer count:', error);
    }
  };

  const checkIfUserHasAccepted = async () => {
    try {
      const client = await getThirdwebBrowserClient();
      const address = await getContractAddress();
      const contract = getContract({ client, chain: base, address, abi });
      const accepted = await readContract({ contract, method: 'hasPrinciplesAccepted', params: [wallet.address] });
      setHasAccepted(accepted);
    } catch (error) {
      console.error('Error checking acceptance:', error);
    }
  };

  const handleAcceptPrinciples = async () => {
    if (!userName.trim()) {
      alert('Please enter your name before signing.');
      return;
    }

    try {
      const client = await getThirdwebBrowserClient();
      const address = await getContractAddress();
      const contract = getContract({ client, chain: base, address, abi });
      const transaction = prepareContractCall({ contract, method: 'acceptPrinciples', params: [userName], value: BigInt(0) });
      await sendAndConfirmTransaction({ transaction, account: wallet! });
      setHasAccepted(true);
      fetchSignerCount();
    } catch (error) {
      console.error('Error accepting principles:', error);
    }
  };

  const handleAccordionChange = (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-rajdhani)', color: '#00bf8a' }}>
          🌿 SYNTHESIZING OPERATING PRINCIPLES...
        </Typography>
      </Box>
    );
  }

  return (
    <MainContainer>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        gutterBottom
        align="center"
        sx={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', letterSpacing: '0.1em', color: '#FFFFFF', textShadow: '0 0 20px rgba(0, 191, 138, 0.3)' }}
      >
        TLN OPERATING PRINCIPLES
      </Typography>

      <Box sx={{ mb: 4, px: 2, border: '1px solid rgba(0, 191, 138, 0.2)', borderRadius: '20px', backgroundColor: 'rgba(0, 191, 138, 0.05)' }}>
        <Typography variant="subtitle1" align="center" sx={{ fontFamily: 'var(--font-rajdhani)', color: '#00bf8a', py: 1 }}>
          <span style={{ opacity: 0.6 }}>TOTAL COMMITTED OPERATORS:</span> {signerCount}
        </Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        {principles.map((principle: any, index: number) => (
          <StyledAccordion
            key={index}
            expanded={expandedIndex === index}
            onChange={handleAccordionChange(index)}
            sx={{
              backgroundColor: expandedIndex === index ? principleColors[index % principleColors.length] : 'rgba(255, 255, 255, 0.05)',
              border: expandedIndex === index ? '1px solid rgba(0, 191, 138, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: expandedIndex === index ? '#FFFFFF' : '#00bf8a' }} />}
            >
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                <span style={{ color: '#00bf8a', marginRight: '12px' }}>0{index + 1}</span>
                {principle.japaneseName} <span style={{ opacity: 0.5, margin: '0 8px' }}>/</span> {principle.englishName}
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails expanded={expandedIndex === index} theme={theme}>
              <Typography variant="body1" sx={{ fontFamily: 'var(--font-inter)', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8 }}>
                {principle.description}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Box>

      {!hasAccepted ? (
        <Box
          mt={4}
          sx={{
            backgroundColor: 'rgba(0, 191, 138, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: theme.spacing(4),
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(0, 191, 138, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', color: '#00bf8a' }}>
            UPHOLD THE VISION
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            By signing, you commit to embodying and upholding our botanical operating principles. Your dedication ensures that we maintain excellence, integrity, and a harmonious network environment.
          </Typography>
          <CustomInput
            type="text"
            placeholder="ENTER OPERATOR IDENTITY"
            value={userName}
            onChange={(e: any) => setUserName(e.target.value)}
          />
          <StyledButton onClick={handleAcceptPrinciples}>
            SIGN PRINCIPLES
          </StyledButton>
        </Box>
      ) : (
        <Box
          mt={4}
          sx={{
            backgroundColor: 'rgba(0, 191, 138, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: theme.spacing(4),
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            border: '2px solid #00bf8a',
            boxShadow: '0 0 30px rgba(0, 191, 138, 0.2)',
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', color: '#00bf8a' }} gutterBottom>
            VERIFICATION COMPLETE
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
            Your commitment to the network strengthens our collective foundation. Welcome to the living society.
          </Typography>
        </Box>
      )}
    </MainContainer>
  );
};

export default OperatingPrinciples;
