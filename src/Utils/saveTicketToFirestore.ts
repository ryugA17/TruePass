import { db } from "../components/layout/firebase";
import { doc, setDoc } from "firebase/firestore";

interface TicketData {
  eventName: string;
  seatNumber: string;
  price: string;
  image: string;
  creatorEmail: string;
  walletAddress: string;
  timestamp: string;
}

export const saveTicketToFirestore = async (ticketData: TicketData) => {
  const ticketRef = doc(db, "tickets", `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  await setDoc(ticketRef, {
    ...ticketData,
    used: false,
    createdAt: Date.now()
  });
};
