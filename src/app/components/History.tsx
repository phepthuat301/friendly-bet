'use client';

import { Anchor, Table } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { getAllBetHistory } from '../services/HttpService';

const History = ({ setCurrentPage }: any) => {
  const [betHistories, setBetHistories] = useState<any>([]);

  const rows = betHistories.map((matchItem: any, matchIndex: number) => (
    <React.Fragment key={matchIndex}>
      <Table.Tr>
        <Table.Td colSpan={3}>
          <strong>{matchItem.match}</strong>
        </Table.Td>
      </Table.Tr>
      {matchItem.data.map((scoreItem: any, scoreIndex: number) => (
        <Table.Tr key={scoreIndex}>
          <Table.Td>{scoreItem.score}</Table.Td>
          <Table.Td>{scoreItem.totalAmount}</Table.Td>
        </Table.Tr>
      ))}
    </React.Fragment>
  ));

  useEffect(() => {
    const fetchData = async () => {
      const res2 = await getAllBetHistory();
      setBetHistories(res2.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Anchor className='!p-3' onClick={() => setCurrentPage('')}>
        Back
      </Anchor>
      <div className="flex justify-center flex-col">
        {betHistories.length > 0 && (
          <div className="p-5">
            <Table highlightOnHover withTableBorder withColumnBorders striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tỉ số</Table.Th>
                  <Table.Th>Tổng tiền</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
