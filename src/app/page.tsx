'use client';

import { Button, Image } from "@mantine/core";
import InputForm from "./components/InputForm";
import { useState } from "react";
import Setting from "./components/Setting";
import History from "./components/History";

export default function Home() {
  const [currentPage, setCurrentPage] = useState('');


  return (
    <div>
      <div className="banner">
        <Image
          src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/0b804d161597101.63c91c1d6bf47.jpg"
        />
      </div>
      {currentPage === '' &&
        <div className="flex flex-col gap-4 my-3 px-5">
          <Button onClick={() => setCurrentPage('home')}>Lịch Sử</Button>
          <Button onClick={() => setCurrentPage('bet')} >Đặt Cược</Button>
          <Button onClick={() => setCurrentPage('setting')}>Cài Đặt</Button>
        </div>
      }
      {currentPage === 'bet' && <InputForm setCurrentPage={setCurrentPage} />}
      {currentPage === 'setting' && <Setting setCurrentPage={setCurrentPage} />}
      {currentPage === 'home' && <History setCurrentPage={setCurrentPage} />}

    </div>

  );
}
