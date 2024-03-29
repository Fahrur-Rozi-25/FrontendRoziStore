'use client'

import { Modal, Button } from 'flowbite-react';
import {HiShoppingCart } from 'react-icons/hi';
import { EncryptAutomated } from '@/encrypt/encrypt';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { generateTransactionID } from '@/app/services/data/createTransactionID';
import axios from 'axios';


interface ModalProps {
  open: boolean;
  onClose: () => void;
  productInfo: {
    seller_name: any
    seller_price: string
    verify: any
    product_name: string;
    Price: any;
    buyer_sku_code: any;
  };
}

const OrdersModal: React.FC<ModalProps> = ({ open, onClose , productInfo }) => {


    const [isProcessing, setIsProcessing] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(0);

    const [PlayerID, setPlayerID] = useState('');
    const [Payments, setPayments] = useState('');
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (typeof window !== 'undefined') {
          // Mengambil nilai dari sessionStorage dan menyimpannya dalam state saat komponen dimuat
          const userID = sessionStorage.getItem('PlayerID');
          const Payment = sessionStorage.getItem('Payment')
  
          // Memperbarui state dengan nilai-nilai dari sessionStorage
          if (userID) {
            setPlayerID(userID || ''); // Gunakan default string kosong jika tidak ada nilai
          }
          if (Payment) {
            setPayments(Payment || ''); // Gunakan default string kosong jika tidak ada nilai
          }
        }
      }, 1500); // Setiap 1000 milidetik (1 detik)
  
      // Membersihkan interval saat komponen unmount
      return () => clearInterval(interval);
    }, []);

    const {
      product_name,
        Price,
      } = productInfo;
      
    const data: any = productInfo

  const encrypt = EncryptAutomated(data)

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const formattedPrice = formatter.format(Price).replace(/,00$/, "");


    const accept  = async () => {
      
      try {
      localStorage.removeItem('countdownSeconds');
      setIsProcessing(true);

      const transactionID = generateTransactionID();
      sessionStorage.setItem('transactionID' , transactionID)
      const datas = {
        transaction_id: transactionID,
        id: PlayerID,
        seller_name: productInfo.seller_name,
        seller_price: productInfo.seller_price,
        product_name: productInfo.product_name,
        price: productInfo.Price,
        buyer_sku_code: productInfo.buyer_sku_code,
        statusMetodePembayaran: "Dalam Antrian.",
        metodePembayaran: Payments
      }
  
      const res = await axios.post('/api/Transaction',datas)
      console.log(datas);
  
      if (res.status === 201) {
        let countdown = 5;
  
        const countdownInterval = setInterval(() => {
          if (countdown === 0) {
            clearInterval(countdownInterval);
            // Jika countdown selesai, maka arahkan pengguna ke `/checkout`
            window.location.href = `/checkout/${encrypt}`;
          } else {
            setRedirectCountdown(countdown);
            countdown--;
          }
        }, 1000); // 1000 milidetik = 1 detik
      } else {
        console.log("Error: Redirecting failed.");
      }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan. Silakan coba lagi nanti.");
        setIsProcessing(false)
      }

  };
    
  return (
    <Modal className="items-center justify-center" popup dismissible show={open} onClose={onClose}>
      <Modal.Header className="font-bold mt-5">ORDER DETAIL!</Modal.Header>
      <Modal.Body>
        <div className="space-y-3 font-bold">
        <p>ID: {PlayerID}</p>
        <p>Product Name: {product_name}</p>
        <p>Price: {formattedPrice}</p>
        <span className="text-sm italic">*belum termasuk ppn</span>
        <p>Metode Pembayaran :{Payments}</p>
        <p className='mt-3'>Note!</p>
        <p className='font-thin italic'>*pastikan harga dan item anda sesuai dengan apa yang anda pesan!</p>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <Button color="failure" onClick={onClose}>Decline</Button>
        <Button className="bg-color-accent" onClick={accept}
        disabled={isProcessing}
        isProcessing={isProcessing}
        processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
        >
            <HiShoppingCart className="mr-2 h-5 w-5" />
        <p>
      {isProcessing
              ? 'Memproses...'
              : 'I accept'}
      </p></Button>
      </Modal.Footer>
      {redirectCountdown >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-white text-2xl font-bold">
            Redirecting in {redirectCountdown}...
          </p>
        </div>
      )}
    </Modal>
  );
};

export default OrdersModal;
