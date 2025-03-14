import { useState, useEffect } from "react";
import { parseEther } from "viem";
import {
    useAccount,
    useChainId,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract
} from "wagmi";
import { seiTestnet } from "wagmi/chains";

const TOKEN_CONTRACT_ADDRESS = "0x3C56d833e9EC105F1738986b00239186caAe0872";
const STAKING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000001005";
const VALIDATOR_ADDRESS = "seivaloper1sq7x0r2mf3gvwr2l9amtlye0yd3c6dqa4th95v";

const tokenContractAbi = [
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const stakingContractAbi = [
    {
        inputs: [{ internalType: "string", name: "valAddress", type: "string" }],
        name: "delegate",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "payable",
        type: "function",
    },
];

const ContractInteraction = () => {
    const { address } = useAccount();
    const chainId = useChainId();

    const [mintStatus, setMintStatus] = useState({ loading: false, error: null, success: false });
    const [stakeStatus, setStakeStatus] = useState({ loading: false, error: null, success: false });
    const [stakeAmount, setStakeAmount] = useState("0.1");

    const {
        data: balance,
        refetch: refetchBalance,
        isLoading: isReading,
        error: readError,
    } = useReadContract({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: tokenContractAbi,
        functionName: "balanceOf",
        args: [address],
    });

    const {
        data: mintHash,
        isPending: isMintPending,
        error: mintError,
        writeContract: mintWrite,
    } = useWriteContract({});

    const {
        isLoading: isWaitingForMintTransaction,
        isSuccess: isMintTransactionSuccess,
    } = useWaitForTransactionReceipt({
        hash: mintHash,
        chainId: seiTestnet.id,
    });

    const {
        data: stakeHash,
        isPending: isStakePending,
        error: stakeError,
        writeContract: stakeWrite,
    } = useWriteContract({});

    const {
        isLoading: isWaitingForStakeTransaction,
        isSuccess: isStakeTransactionSuccess,
    } = useWaitForTransactionReceipt({
        hash: stakeHash,
        chainId: seiTestnet.id,
    });


    useEffect(() => {
        if (isMintPending || isWaitingForMintTransaction) {
            setMintStatus({ loading: true, error: null, success: false });
        } else if (isMintTransactionSuccess) {
            setMintStatus({ loading: false, error: null, success: true });
            refetchBalance();
        } else if (mintError) {
            setMintStatus({
                loading: false,
                error: mintError?.message || "Transaction failed",
                success: false,
            });
        }
    }, [
        isMintPending,
        isWaitingForMintTransaction,
        isMintTransactionSuccess,
        mintError,
        refetchBalance,
    ]);

    useEffect(() => {
        if (isStakePending || isWaitingForStakeTransaction) {
            setStakeStatus({ loading: true, error: null, success: false });
        } else if (isStakeTransactionSuccess) {
            setStakeStatus({ loading: false, error: null, success: true });
        } else if (stakeError) {
            setStakeStatus({
                loading: false,
                error: stakeError?.message || "Transaction failed",
                success: false,
            });
        }
    }, [isStakePending, isWaitingForStakeTransaction, isStakeTransactionSuccess, stakeError]);

    const handleMint = async () => {
        if (!mintWrite || !address) {
            return;
        }
        try {
            setMintStatus({ loading: true, error: null, success: false });

            const tokenAmount = parseEther("0.01");
            console.log("Minting 0.01 tokens to:", address);

            mintWrite({
                address: TOKEN_CONTRACT_ADDRESS,
                abi: tokenContractAbi,
                functionName: "mint",
                args: [address, tokenAmount],
            });
        } catch (err: any) {
            console.error("Mint error:", err);
            setMintStatus({
                loading: false,
                error: err?.message || "Mint transaction failed",
                success: false,
            });
        }
    };

    const handleStake = async () => {
        if (!stakeWrite || !address) {
            console.log("Stake function not available or address not connected");
            return;
        }
        try {
            setStakeStatus({ loading: true, error: null, success: false });

            console.log("Staking with validator:", VALIDATOR_ADDRESS);
            console.log("Staking amount:", stakeAmount, "ETH (converted to Wei with parseEther)");

            stakeWrite({
                address: STAKING_CONTRACT_ADDRESS,
                abi: stakingContractAbi,
                functionName: "delegate",
                args: [VALIDATOR_ADDRESS],
                value: parseEther(stakeAmount || "0.1"),
            });
        } catch (err: any) {
            console.error("Stake error:", err);
            setStakeStatus({
                loading: false,
                error: err?.message || "Staking transaction failed",
                success: false,
            });
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Contract Interaction</h2>
            <div style={{ marginBottom: "20px" }}>
                <p>Connected wallet: {address || "Not connected"}</p>
                <p>Chain ID: {chainId || "Unknown"} (SEI Testnet ID: {seiTestnet.id})</p>
                {chainId !== seiTestnet.id && (
                    <p style={{ color: "red" }}>
                        Warning: You are not connected to SEI Testnet! Please switch to SEI Testnet in your wallet.
                    </p>
                )}
            </div>

            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            >
                <h3>Token Interaction</h3>
                <button onClick={() => refetchBalance()}>
                    {isReading ? "Checking Balance..." : "Get Balance"}
                </button>
                {readError && <p style={{ color: "red" }}>Error reading balance: {readError.message}</p>}
                {balance !== undefined && <p>Your Balance: {balance.toString()}</p>}

                <div style={{ marginTop: "15px" }}>
                    <button onClick={handleMint}>
                        {mintStatus.loading || isMintPending || isWaitingForMintTransaction
                            ? "Minting..."
                            : "Mint 100 Tokens"}
                    </button>
                    {mintStatus.error && <p style={{ color: "red" }}>Error: {mintStatus.error}</p>}
                    {mintStatus.success && <p style={{ color: "green" }}>Mint transaction successful!</p>}
                </div>
            </div>

            <div
                style={{
                    marginBottom: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            >
                <h3>Staking on SEI</h3>
                <p>Validator Address: {VALIDATOR_ADDRESS}</p>
                <p>Staking Contract: {STAKING_CONTRACT_ADDRESS}</p>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="stakeAmount">Stake Amount (ETH): </label>
                    <input
                        id="stakeAmount"
                        type="text"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    />
                </div>

                <button onClick={handleStake}>
                    {stakeStatus.loading || isStakePending || isWaitingForStakeTransaction
                        ? "Staking..."
                        : `Stake ${stakeAmount} ETH`}
                </button>
                {stakeStatus.error && <p style={{ color: "red" }}>Error: {stakeStatus.error}</p>}
                {stakeStatus.success && <p style={{ color: "green" }}>Stake transaction successful!</p>}
                {stakeHash && (
                    <p>
                        Transaction Hash:{" "}
                        <a
                            href={`https://sei.explorers.guru/transaction/${stakeHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {stakeHash.substring(0, 10)}...
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContractInteraction;
