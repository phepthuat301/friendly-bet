'use client';

import { Anchor, Button, NumberInput, Select, Table, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { getBetHistory, getMatchHistory, getPlayers, submitBet } from '../services/HttpService';

const InputForm = ({ setCurrentPage }: any) => {
    const [matches, setMatches] = useState<any>([]);
    const [selectedCoordinate, setSelectedCoordinate] = useState<any>('');
    const [inputValue, setInputValue] = useState<any>();
    const [coordinates, setCoordinates] = useState<any>([]);
    const [players, setPlayers] = useState<any>([]);
    // Form Data    
    const [name, setName] = useState<any>('');
    const [match, setMatch] = useState<any>('');

    const handleAdd = async () => {
        if (!selectedCoordinate) return alert('Chọn tỉ số bạn ơi')
        if (!inputValue) return alert('Nhập tiền bạn ơi')
        if (selectedCoordinate && inputValue) {
            const formattedValue = inputValue * 1000;
            await submitBet({
                name,
                match,
                score: selectedCoordinate,
                amount: formattedValue,
                time: new Date().toLocaleString()
            })
            setCoordinates((prevCoordinates: any) => {
                const updatedCoordinates = [...prevCoordinates];
                const existingIndex = updatedCoordinates.findIndex(
                    (item) => item.match === match && item.coordinate === selectedCoordinate
                );

                if (existingIndex !== -1) {
                    // Replace the existing entry
                    updatedCoordinates[existingIndex] = {
                        ...updatedCoordinates[existingIndex],
                        value: formattedValue,
                        winAmount: 0 // Assuming winAmount should be reset to 0
                    };
                } else {
                    // Push new entry
                    updatedCoordinates.push({
                        match,
                        coordinate: selectedCoordinate,
                        value: formattedValue,
                        winAmount: 0
                    });
                }
                return updatedCoordinates;
            });
            setSelectedCoordinate('');
            setInputValue(null);
        }
    };

    const calculateSum = (items: any[], field: string) => {
        return items.reduce((acc, item) => {
            const value = item[field];
            // Check if the value is a number, if not use 0
            return acc + (typeof value === 'number' ? value : 0);
        }, 0);
    };

    const totalValue = calculateSum(coordinates, 'value');
    const totalWinAmount = calculateSum(coordinates, 'winAmount');

    const rows = coordinates.map((item: any, index: number) => (
        <Table.Tr key={index}>
            <Table.Td>{item.match}</Table.Td>
            <Table.Td>{item.coordinate}</Table.Td>
            <Table.Td>{item.value}</Table.Td>
            <Table.Td>{item.winAmount}</Table.Td>
        </Table.Tr>
    ));

    const ratio = ['0-0', '0-1', '0-2', '0-3', '0-4', '1-0', '1-1', '1-2', '1-3', '1-4', '2-0', '2-1', '2-2', '2-3', '2-4', '3-0', '3-1', '3-2', '3-3', '3-4', '4-0', '4-1', '4-2', '4-3', '4-4', 'Tỉ khác']

    useEffect(() => {
        const fetchData = async () => {
            const rawResponse = await getBetHistory(name)
            setCoordinates(rawResponse.data.map((item: any) => ({
                coordinate: item.score,
                value: item.amount,
                match: item.match,
                winAmount: item.win_amount
            })))
            const res = await getMatchHistory()
            setMatches(res.data.map((item: any) => item.name))
            const res2 = await getPlayers();
            setPlayers(res2.data)
        }
        fetchData();
    }, [name]);

    return (
        <div>
            <Anchor className='!p-3' onClick={() => setCurrentPage('')}>
                Back
            </Anchor>
            <div className="flex justify-center flex-col">
                <Select
                    className="my-3 flex justify-center flex-col items-center gap-3"
                    size="xl"
                    radius="md"
                    label="Bạn là ai?"
                    placeholder="Chọn một cái tên"
                    data={players.map((item: any) => item.name)}
                    onChange={setName}
                />
                <Select
                    className="my-3 flex justify-center flex-col items-center gap-3"
                    size="xl"
                    radius="md"
                    label="Đánh trận nào?"
                    placeholder="Chọn một cái tên"
                    data={matches}
                    onChange={setMatch}
                />
                <Select
                    className="my-3 flex justify-center flex-col items-center gap-3"
                    size="xl"
                    radius="md"
                    label="Chọn tỉ số"
                    placeholder="Pick one"
                    data={ratio}
                    value={selectedCoordinate}
                    onChange={setSelectedCoordinate}
                    searchable
                    clearable
                />
                <NumberInput
                    className="my-3 flex justify-center flex-col items-center gap-3"
                    size="xl"
                    radius="md"
                    label="Nhập tiền"
                    placeholder="Chỉ nhập 10, 20, 30,..."
                    value={inputValue}
                    onChange={setInputValue}
                />
                <div className="my-3 flex justify-center">
                    <Button
                        className="!w-1/2"
                        onClick={handleAdd}
                    >
                        Add
                    </Button>
                </div>
                {coordinates.length > 0 && (
                    <div className="p-5">
                        <div>
                            Đã nạp: {players.find((item: any) => item.name === name)?.balance}
                        </div>
                        <div>
                            Số dư: {players.find((item: any) => item.name === name)?.balance - totalValue + totalWinAmount}
                        </div>
                        <Table highlightOnHover withTableBorder withColumnBorders striped >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Trận</Table.Th>
                                    <Table.Th>Tỉ số</Table.Th>
                                    <Table.Th>Tiền cược</Table.Th>
                                    <Table.Th>Thắng</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows}
                                <Table.Tr>
                                    <Table.Td colSpan={2} style={{ fontWeight: 'bold' }}>Tổng</Table.Td>
                                    <Table.Td style={{ fontWeight: 'bold' }}>{totalValue}</Table.Td>
                                    <Table.Td style={{ fontWeight: 'bold' }}>{totalWinAmount}</Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </div>

                )}
            </div>
        </div>
    );
};

export default InputForm;