import { useState, useEffect } from "react";

const loadingMessages = [
  "Menghubungi server AI...",
  "AI sedang menyiapkan kanvas...",
  "Tolong bersabar ...",
  "Menggambar jutaan piksel...",
  "Memberikan sentuhan akhir...",
  "Hampir selesai, mohon tunggu...",
  "Proses ini butuh waktu...",
];

export const useLoadingMessage = (isLoading: boolean) => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isLoading) {
      let index = 0;
      const intervalId = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setMessage(loadingMessages[index]);
      }, 5000);

      return () => {
        clearInterval(intervalId);
        setMessage(loadingMessages[0]);
      };
    }
  }, [isLoading]);

  return message;
};
