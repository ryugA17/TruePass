import { db } from "../components/layout/firebase";
import { doc, setDoc } from "firebase/firestore";

export const saveTicketToFirestore = async (
  userId: string,
  walletAddress: string,
  ticketId: string,
  eventName: string,
  seatNumber: string,
  eventDate: number
) => {
  const ticketRef = doc(db, "tickets", ticketId);
  await setDoc(ticketRef, {
    userId,
    walletAddress,
    eventName,
    seatNumber,
    eventDate,
    used: false,
    timestamp: Date.now()
  });
};
