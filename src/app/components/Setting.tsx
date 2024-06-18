'use client';

import { Anchor, Button, Modal, NumberInput, Select, Table, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { editMatch, editPlayer, getMatchHistory, getPlayers, submitMatch } from '../services/HttpService';

const Setting = ({ setCurrentPage }: any) => {
    const [inputValue, setInputValue] = useState('');
    const [coordinates, setCoordinates] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [editResult, setEditResult] = useState('');
    const [editMultiplier, setEditMultiplier] = useState<any>(0);
    const [players, setPlayers] = useState<any>([]);
    const [player, setPlayer] = useState<any>('');
    const [amount, setAmount] = useState<any>(0);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const correctPassword = 'tudimatim'; // Set your password here

    const handleAdd = async () => {
        if (!inputValue) return alert('Vui lòng nhập cặp trận')
        await submitMatch({ name: inputValue })
        setCoordinates([...coordinates, { match: inputValue, result: '', multiplier: 0 }]);
        setInputValue('');
    };


    const handleEdit = (index: number) => {
        const item = coordinates[index];
        setEditResult(item.result);
        setEditMultiplier(item.multiplier);
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (selectedIndex !== null) {
            const newCoordinates = [...coordinates];
            newCoordinates[selectedIndex] = {
                ...newCoordinates[selectedIndex],
                result: editResult,
                multiplier: editMultiplier,
            };
            setCoordinates(newCoordinates);
            setIsModalOpen(false);
            setSelectedIndex(null);
            await editMatch({
                name: newCoordinates[selectedIndex].match,
                result: editResult,
                multiplier: editMultiplier
            })
        }
    };

    const handleAddMoney = async () => {
        if (!player) return alert('Vui lòng chọn người chơi')
        if (!amount) return alert('Vui lòng nhập số tiền')
        await editPlayer({ name: player, amount: amount * 1000 })
        alert('Nạp tiền thành công')
    }

    const rows = coordinates.map((item: any, index: number) => (
        <Table.Tr key={index}>
            <Table.Td>{item.match}</Table.Td>
            <Table.Td>{item.result}</Table.Td>
            <Table.Td>{item.multiplier}</Table.Td>
            <Table.Td>
                <Button onClick={() => handleEdit(index)}>Edit</Button>
            </Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        const fetchData = async () => {
            const rawResponse = await getMatchHistory()
            setCoordinates(rawResponse.data.map((item: any) => ({
                match: item.name,
                result: item.result,
                multiplier: item.multiplier
            })))
            const res = await getPlayers();
            setPlayers(res.data.map((item: any) => item.name))
        }
        fetchData();
    }, []);

    const handlePasswordSubmit = () => {
        if (password === correctPassword) {
            setIsAuthenticated(true);
        } else {
            setCurrentPage('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center">
                <div className="p-4">
                    <TextInput
                        className="my-3 text-center"
                        size="xl"
                        radius="md"
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                    />
                    <div className="my-3 flex justify-center">
                        <Button className="!w-1/2" onClick={handlePasswordSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                    label="Người nạp"
                    placeholder="Chọn một cái tên"
                    data={players}
                    onChange={setPlayer}
                />
                <NumberInput
                    className="my-3 flex justify-center flex-col items-center gap-3"
                    size="xl"
                    radius="md"
                    label="Số tiền"
                    placeholder="Nhập số tiền"
                    value={amount}
                    onChange={setAmount}
                />
                <div className="my-3 flex justify-center">
                    <Button
                        className="!w-1/2"
                        onClick={handleAddMoney}
                    >
                        Nạp tiền
                    </Button>
                </div>
                <TextInput
                    className="my-3 flex justify-center flex-col items-center gap-3"
                    size="xl"
                    radius="md"
                    label="Thêm cặp trận"
                    placeholder="BĐN - Anh"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.currentTarget.value)}
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
                        <Table highlightOnHover withTableBorder withColumnBorders striped >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Trận</Table.Th>
                                    <Table.Th>Kết quả</Table.Th>
                                    <Table.Th>Tỉ lệ ăn</Table.Th>
                                    <Table.Th>Hành động</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows}
                            </Table.Tbody>
                        </Table>
                    </div>
                )}
                <Modal
                    opened={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Edit Match"
                >
                    <TextInput
                        label="Result"
                        placeholder="Enter result"
                        value={editResult}
                        onChange={(event) => setEditResult(event.currentTarget.value)}
                    />
                    <NumberInput
                        label="Multiplier"
                        placeholder="Enter multiplier"
                        value={editMultiplier}
                        onChange={setEditMultiplier}
                    />
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Setting;