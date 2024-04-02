import React from 'react';
import styled from "styled-components";

const TransactionHistoryContainer = styled.div`
width: 996px;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
box-shadow: 6px 6px 6px 6px #c9c9c9;
border-radius: 12px;
padding: 16px 24px;
margin-top: 48px;
margin-bottom: 108px;
`;

const RowContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

const BodyTitleText = styled.h2`
font-size: 24px;
font-weight: 700;
`;

const MiniTitleText = styled.h3`
font-size: 16px;
font-weight: 600;
margin: 0;
`;

const DetailText = styled.p`
font-size: 16px;
`;


const TransactionHistory: React.FC<{
    transactionArray: {
        from: string,
        to: string,
        transactionHash: string,
        blockNumber: number,
    }[]
}> = ({ transactionArray }) => {
    return (
        <TransactionHistoryContainer>
            <BodyTitleText>Transaction History</BodyTitleText>
            <RowContainer style={{ width: "100%", marginBottom: 16 }}>
                <MiniTitleText style={{ width: "30%" }}>Transaction Hash</MiniTitleText>
                <MiniTitleText style={{ width: "30%" }}>Transaction Wallet</MiniTitleText>
                <MiniTitleText style={{ width: "30%" }}>Target Wallet</MiniTitleText>
                <MiniTitleText style={{ width: "10%" }}>Block</MiniTitleText>
            </RowContainer>
            {transactionArray.map((x) => {
                return (
                    <RowContainer style={{ width: "100%", marginBottom: 16 }}>
                        <DetailText style={{ width: "28%", wordBreak: "break-all" }}>{x.transactionHash}</DetailText>
                        <DetailText style={{ width: "28%", wordBreak: "break-all" }}>{x.from}</DetailText>
                        <DetailText style={{ width: "28%", wordBreak: "break-all" }}>{x.to}</DetailText>
                        <DetailText style={{ width: "10%" }}>{x.blockNumber}</DetailText>
                    </RowContainer>
                )
            })}
        </TransactionHistoryContainer>
    )
}

export default TransactionHistory