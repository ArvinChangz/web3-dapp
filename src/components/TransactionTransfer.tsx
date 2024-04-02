import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components";
import { BigNumber, ethers } from 'ethers';
import { Metamask, Exchange } from '@web3uikit/icons'
import { Modal, Input, Switch, Button } from "antd";
import TransactionHistory from './TransactionHistory';

const Container = styled.div`
flex: 1;
width: 100%;
display: flex;
flex-direction: column;
justify-contents: center;
align-items: center;
`;

const TitleContainer = styled.div`
width: 95%;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 16px 24px;
`;

const TitleText = styled.h1`
font-size: 32px;
`;

const ConnectButton = styled.button`
display: flex;
flex-direction: row;
align-items: center;
padding: 8px;
background-color: transparent;
border: 1px solid #9c9c9c;
border-radius: 8px;
font-size: 16px;
margin-left: 16px;
color: black;
cursor: pointer;

&:hover {
    border: 1px solid #0394fc;
    color: #0394fc;
}
`;

const BodyContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
margin-top: 48px;

@media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const WalletDetailContainer = styled.div`
width: 412px;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
box-shadow: 6px 6px 6px 6px #c9c9c9;
border-radius: 12px;
padding: 16px;
`;

const WalletDetailButtton = styled.button`
display: flex;
flex-direction: row;
align-items: center;
padding: 8px;
background-color: transparent;
border: 1px solid #9c9c9c;
border-radius: 8px;
font-size: 16px;
color: black;
cursor: pointer;
margin-bottom: 24px;

&:hover {
    border: 1px solid #0394fc;
    color: #0394fc;
}
`;

const BodyTitleText = styled.h2`
font-size: 24px;
font-weight: 700;
`;

const SmallTitleText = styled.h3`
font-size: 20px;
font-weight: 600;
`;

const MiniTitleText = styled.h3`
font-size: 16px;
font-weight: 600;
margin: 0;
`;

const DetailText = styled.p`
font-size: 16px;
`;

const WalletTransactionContainer = styled.div`
width: 500px;
display: flex;
flex-direction: column;
box-shadow: 6px 6px 6px 6px #c9c9c9;
border-radius: 12px;
padding: 24px;
margin-left: 32px;

@media (max-width: 1000px) {
    margin-left: 0px;
    margin-top: 48px;
  }
`;

const WalletTransactionInput = styled(Input)`
width: 100%;
background-color: transparent;
height: 48px;
border: 1px solid #9c9c9c;
font-size: 18px;
border-radius: 8px;
padding-left: 8px;
`;

const RowContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const ErrorText = styled.p`
font-size: 12px;
color: red;
`;

const TransactionTransfer = () => {

    const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

    // Wallet State
    const [balance, setBalance] = useState<string | undefined>();
    const [currentAccount, setCurrentAccount] = useState<string | undefined>();
    const [currentChainId, setCurrentChainId] = useState<number | undefined>();
    const [currentChainName, setCurrentChainName] = useState<string | undefined>();
    const [currentChainAddress, setCurrentChainAddress] = useState<string | undefined>();
    const [currentGasPrice, setCurrentGasPrice] = useState("");
    const [currentMaxPriorityFeePerGas, setCurrentMaxPriorityFeePerGas] = useState("");
    const [currentMaxFeePerGas, setCurrentMaxFeePerGas] = useState("");

    // Transaction State
    const [targetAddress, setTargetAddress] = useState("");
    const [targetNonce, setTargetNonce] = useState("");
    const [targetAmount, setTargeAmount] = useState("");
    const [targetGasLimit, setTargetGasLimit] = useState("");
    const [targetMaxPriorityFeePerGas, setTargetMaxPriorityFeePerGas] = useState("");
    const [targetMaxFeePerGas, setTargetMaxFeePerGas] = useState("");
    const [isAdvance, setIsAdvance] = useState(false); // Advance Option
    const [transactionIsError, setTransactionIsError] = useState(false);
    const [isLoading, setIsloading] = useState(false);

    // Transaction History State
    const [transactionArray, setTransactionArray] = useState<{
        from: string,
        to: string,
        transactionHash: string,
        blockNumber: number,
    }[]>([]);

    // Switch Network State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [switchChainName, setSwitchChainName] = useState("");
    const [switchChainRpcUrl, setSwitchChainRpcUrl] = useState("");
    const [switchChainId, setSwitchChainId] = useState("");
    const [switchChainCurrencySymbol, setSwitchChainCurrencySymbol] = useState("");
    const [switchChainCurrencyDecimal, setSwitchChainCurrencyDecimal] = useState("");
    const [switchIsError, setSwitchIsError] = useState(false);

    // Get Account Info
    const getCurrentWallet = useCallback(async () => {
        try {
            if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return

            if (!window.ethereum) return

            const currentProvider = await new ethers.providers.Web3Provider(window.ethereum); // Get Provider
            const currentSigner = await currentProvider.getSigner(); // Get Signer

            const currentBalanceResult = await currentProvider.getBalance(currentAccount); // Get Account Balance
            const currentNonce = targetNonce ? parseInt(targetNonce) : await currentSigner.getTransactionCount(); // Get Nonce
            const currentChain = await currentProvider.getNetwork(); // Get Chain Data
            const currentFeeData = await currentProvider.getFeeData(); // Get Fee Data

            setProvider(currentProvider);
            setSigner(currentSigner);
            setTargetNonce(currentNonce.toString());
            setBalance(ethers.utils.formatEther(currentBalanceResult));
            setCurrentChainId(currentChain.chainId)
            setCurrentChainName(currentChain.name);
            setCurrentChainAddress(currentChain.ensAddress);

            if (currentFeeData.gasPrice) {
                setCurrentGasPrice((ethers.utils.formatUnits(currentFeeData.gasPrice, "gwei"))); // Get Latest Gas Price
            };
            if (currentFeeData.maxFeePerGas) {
                setCurrentMaxFeePerGas((ethers.utils.formatUnits(currentFeeData.maxFeePerGas, "gwei"))); // Get Latest Max Fee
            };
            if (currentFeeData.maxPriorityFeePerGas) {
                setCurrentMaxPriorityFeePerGas((ethers.utils.formatUnits(currentFeeData.maxPriorityFeePerGas, "gwei"))); // Get Latest Max Priority Fee
            };

        } catch (e) {
            console.log(e);
        };
    }, [currentAccount, targetNonce]);

    useEffect(() => {
        getCurrentWallet();
    }, [getCurrentWallet]);

    // Switch Network
    const handleAddNetwork = async (switchChainId: string, switchChainName: string, rpcUrls: string, currencyDecimal: string, currencySymbol: string) => {
        try {
            if (window.ethereum) {
                await setSwitchIsError(false); // Clear Error
                // If Chain Added before than switch, else add New Chain
                await window.ethereum
                    .request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: ethers.utils.isHexString(switchChainId) ? switchChainId : ethers.utils.hexValue(parseInt(switchChainId)) }],
                    })
                await setIsModalVisible(false); // Close Modal
                await getCurrentWallet(); // Refetch Account Data
            };
        } catch (switchError) {
            if (window.ethereum) {
                if (switchError.code === 4902) { // 4902 indicates that the chain has not been added to MetaMask.
                    try {
                        // Add New Chain
                        await window.ethereum
                            .request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: ethers.utils.isHexString(switchChainId) ? switchChainId : ethers.utils.hexValue(parseInt(switchChainId)),
                                        chainName: switchChainName,
                                        rpcUrls: [rpcUrls],
                                        nativeCurrency: {
                                            symbol: currencySymbol,
                                            decimals: parseInt(currencyDecimal)
                                        }
                                    },
                                ],
                            })
                        await setIsModalVisible(false); // Close Modal
                        await getCurrentWallet(); // Refetch Account Data
                    } catch (addError) {
                        if (addError.code === -32602) { // -32602 indicates that information of the input may be wrong
                            setSwitchIsError(true);
                        };
                    };
                } else if (switchError.code === -32602) { // -32602 indicates that information of the input may be wrong
                    setSwitchIsError(true);
                } else {
                    console.log(switchError);
                };
            };
        };
    };

    // Check Valid Url
    const isValidUrl = (url: string) => {
        const regex = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\w -]*)*\/?$/;
        return regex.test(url);
    };

    // Click Connect Wallet
    const onClickConnect = () => {
        if (!window.ethereum) {
            alert("please install MetaMask");
            return
        };

        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // MetaMask requires requesting permission to connect users accounts
        provider.send("eth_requestAccounts", [])
            .then((accounts) => {
                if (accounts.length > 0) setCurrentAccount(accounts[0])
            })
            .catch((e) => console.log(e))
    };

    // Disconnect Wallet
    const onClickDisconnect = () => {
        setBalance("");
        setCurrentAccount("");
        setCurrentChainAddress("");
        setCurrentChainId(undefined);
        setCurrentChainName("");
        setProvider(undefined);
        setSigner(undefined);
        setTargetNonce("");
        setIsloading(false);
        setTransactionIsError(false);
    };

    // Send Transaction
    const handleSendTransaction = async () => {
        if (!targetAddress || !provider || !signer) {
            alert('Please connect a wallet');
            return;
        };

        try {
            await setIsloading(true); // Clear Loading
            await setTransactionIsError(false); // Clear Error
            // 發送交易
            let transaction: { to: string, value: BigNumber, nonce: string, gasLimit?: string, maxPriorityFeePerGas?: BigNumber, maxFeePerGas?: BigNumber } = {
                to: targetAddress,
                value: ethers.utils.parseEther(targetAmount),
                nonce: targetNonce,
            };

            if (targetGasLimit) {
                transaction.gasLimit = targetGasLimit // EIP-1559
            };

            if (targetMaxPriorityFeePerGas) {
                transaction.maxPriorityFeePerGas = ethers.utils.parseUnits(targetMaxPriorityFeePerGas, 'gwei') // EIP-1559
            };

            if (targetMaxFeePerGas) {
                transaction.maxFeePerGas = ethers.utils.parseUnits(targetMaxFeePerGas, 'gwei') // EIP-1559
            };

            const tx = await signer.sendTransaction(transaction); // Send Transaction

            const receipt = await tx.wait(); // Wait for Confirm

            // Set History
            await setTransactionArray(prev => [
                ...prev,
                {
                    from: receipt.from,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    blockNumber: receipt.blockNumber
                }
            ]);

            await setIsloading(false); // Clear Loading
        } catch (error) {
            console.error('Error sending transaction:', error);
            alert(error);
            setTransactionIsError(true);
            setIsloading(false);
        };
    };

    return (
        <Container>
            <TitleContainer>
                <TitleText>Arvin's Dapp</TitleText>
                {currentAccount
                    ? (<ConnectButton onClick={() => { onClickDisconnect() }}>
                        <Metamask fontSize='32px' style={{ marginRight: 12 }} />
                        {`Account: ${currentAccount}`}
                    </ConnectButton>)
                    : (<ConnectButton onClick={() => { onClickConnect() }}>
                        <Metamask fontSize='32px' style={{ marginRight: 12 }} />
                        Connect Wallet
                    </ConnectButton>)}
            </TitleContainer>

            <BodyContainer>
                {currentAccount
                    ? <WalletDetailContainer>
                        <BodyTitleText style={{ fontSize: 24 }}>Account info</BodyTitleText>
                        <SmallTitleText>ETH Balance</SmallTitleText>
                        <DetailText>{balance}</DetailText>
                        <SmallTitleText>Chain Info</SmallTitleText>
                        <WalletDetailButtton onClick={() => setIsModalVisible(true)}>
                            <Exchange fontSize='16px' style={{ marginRight: 12 }} />
                            Change Chain
                        </WalletDetailButtton>
                        <MiniTitleText>Name</MiniTitleText>
                        <DetailText>{currentChainName}</DetailText>
                        <MiniTitleText>ID</MiniTitleText>
                        <DetailText>{currentChainId}</DetailText>
                        <MiniTitleText>ENS Address</MiniTitleText>
                        <DetailText>{currentChainAddress}</DetailText>
                    </WalletDetailContainer>
                    : null
                }
                <WalletTransactionContainer>
                    <BodyTitleText>Transaction</BodyTitleText>
                    <SmallTitleText>Target Address</SmallTitleText>
                    <WalletTransactionInput
                        title='Target Address'
                        type='text'
                        placeholder='Target Address'
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                    />
                    <SmallTitleText>Nonce</SmallTitleText>
                    <WalletTransactionInput
                        title='Nonce'
                        type='number'
                        placeholder='Nonce'
                        value={targetNonce}
                        onChange={(e) => setTargetNonce(e.target.value)}
                    />
                    <SmallTitleText>Amount</SmallTitleText>
                    <WalletTransactionInput
                        title='Amount'
                        type='number'
                        placeholder='Enter ETH'
                        value={targetAmount}
                        onChange={(e) => setTargeAmount(e.target.value)}
                    />
                    {isAdvance
                        ? <div>
                            <SmallTitleText>{`Gas Limit (Optional)`}</SmallTitleText>
                            <WalletTransactionInput
                                title='Gas Limit'
                                type='number'
                                placeholder='Enter Gas Limit (gwei)'
                                value={targetGasLimit}
                                onChange={(e) => setTargetGasLimit(e.target.value)}
                            />
                            <DetailText style={{ marginTop: 4, marginBottom: 12 }}>{`Current Gas Price: ${currentGasPrice} gwei`}</DetailText>
                            <SmallTitleText>{`Max Priority Fee (Optional)`}</SmallTitleText>
                            <WalletTransactionInput
                                title='Max Priority Fee'
                                type='number'
                                placeholder='Enter Max Priority Fee (gwei)'
                                value={targetMaxPriorityFeePerGas}
                                onChange={(e) => setTargetMaxPriorityFeePerGas(e.target.value)}
                            />
                            <DetailText style={{ marginTop: 4, marginBottom: 12 }}>{`Current Max Priority Fee: ${currentMaxPriorityFeePerGas} gwei`}</DetailText>
                            <SmallTitleText>{`Max Fee (Optional)`}</SmallTitleText>
                            <WalletTransactionInput
                                title='Max Fee'
                                type='number'
                                placeholder='Enter Max Fee (gwei)'
                                value={targetMaxFeePerGas}
                                onChange={(e) => setTargetMaxFeePerGas(e.target.value)}
                            />
                            <DetailText style={{ marginTop: 4, marginBottom: 12 }}>{`Current Max Fee: ${currentMaxFeePerGas} gwei`}</DetailText>
                        </div>
                        : null}
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 20, justifyContent: "flex-end" }}>
                        <Switch
                            value={isAdvance}
                            onChange={() => { setIsAdvance(!isAdvance); setTargetGasLimit(""); setTargetMaxPriorityFeePerGas(""); setTargetMaxFeePerGas(""); }}
                            style={{ width: 48, marginRight: 20 }}
                            title='Advance Option'
                        />
                        <DetailText>Advance Option</DetailText>
                    </div>
                    {transactionIsError
                        ? <ErrorText style={{ marginBottom: 24, fontSize: 20, fontWeight: 600 }}>Something Went Wrong! Please check your input!</ErrorText>
                        : null}
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Button
                            onClick={() => { setTargetAddress(""); setTargeAmount(""); }}
                            danger
                            style={{ width: 240, height: 48, borderRadius: 8, fontSize: 20 }}
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={() => { handleSendTransaction(); }}
                            disabled={provider && signer && targetAddress && ethers.utils.isAddress(targetAddress) && targetAmount && targetNonce ? false : true}
                            type="primary"
                            style={{ width: 240, height: 48, borderRadius: 8, fontSize: 20 }}
                            loading={isLoading}
                        >
                            Send
                        </Button>
                    </div>
                </WalletTransactionContainer>
            </BodyContainer>

            {/* Transaction History */}
            <TransactionHistory
                transactionArray={transactionArray}
            />

            <Modal
                centered
                destroyOnClose
                width={400}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                okText={"Switch"}
                cancelText={"Cancel"}
                okButtonProps={{
                    disabled: switchChainName && switchChainRpcUrl && isValidUrl(switchChainRpcUrl) && switchChainId && switchChainCurrencyDecimal.length <= 6 && switchChainCurrencyDecimal.length >= 2 && switchChainCurrencySymbol ? false : true,
                    style: { width: 120, height: 48, marginLeft: 16, fontSize: 18 }
                }}
                cancelButtonProps={{
                    style: { width: 120, height: 48, marginLeft: 16, fontSize: 18 }
                }}
                onOk={() => handleAddNetwork(switchChainId, switchChainName, switchChainRpcUrl, switchChainCurrencyDecimal, switchChainCurrencySymbol)}
            >
                <BodyTitleText>Add Network</BodyTitleText>
                <SmallTitleText>Network Name</SmallTitleText>
                <WalletTransactionInput
                    title='Network Name'
                    type='text'
                    placeholder='Network Name'
                    value={switchChainName}
                    onChange={(e) => setSwitchChainName(e.target.value)}
                />
                <SmallTitleText>RPC URL</SmallTitleText>
                <WalletTransactionInput
                    title='RPC URL'
                    type='text'
                    placeholder='RPC URL'
                    value={switchChainRpcUrl}
                    onChange={(e) => setSwitchChainRpcUrl(e.target.value)}
                    status={switchChainRpcUrl ? isValidUrl(switchChainRpcUrl) ? "" : "error" : ""}
                />
                {switchChainRpcUrl
                    ? isValidUrl(switchChainRpcUrl)
                        ? null
                        : <ErrorText>
                            Please Enter Valid URL
                        </ErrorText>
                    : null}
                <SmallTitleText>{`Chain ID (Decimal or Hex)`}</SmallTitleText>
                <WalletTransactionInput
                    title='Chain ID'
                    type='text'
                    placeholder='Chain ID'
                    value={switchChainId}
                    onChange={(e) => setSwitchChainId(e.target.value)}
                />
                <SmallTitleText>Currency</SmallTitleText>
                <RowContainer>
                    <WalletTransactionInput
                        style={{ width: "45%" }}
                        title='Decimals'
                        type='number'
                        maxLength={6}
                        placeholder='Decimals'
                        value={switchChainCurrencyDecimal}
                        onChange={(e) => setSwitchChainCurrencyDecimal(e.target.value)}
                    />
                    <WalletTransactionInput
                        style={{ width: "45%" }}
                        title='Symbol'
                        type='text'
                        placeholder='Symbol'
                        value={switchChainCurrencySymbol}
                        onChange={(e) => setSwitchChainCurrencySymbol(e.target.value)}
                    />
                </RowContainer>
                {switchChainCurrencyDecimal
                    ? switchChainCurrencyDecimal.length < 2 || switchChainCurrencyDecimal.length > 6
                        ? <ErrorText style={{ marginBottom: 72 }}>Decimal Length Should Between 2 to 6</ErrorText>
                        : <div style={{ marginBottom: 72 }} />
                    : <div style={{ marginBottom: 72 }} />}
                {switchIsError
                    ? <ErrorText style={{ fontSize: 20, fontWeight: "600" }}>Chain Not Found! Please Check!</ErrorText>
                    : null}
            </Modal>
        </Container>
    );
};

export default TransactionTransfer;
