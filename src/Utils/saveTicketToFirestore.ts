import { db } from "../components/layout/firebase";
import { doc, setDoc } from "firebase/firestore";

interface TicketData {
  eventName: string;
  seatNumber: string;
  price: string; // Price in INR format
  image: string;
  creatorEmail: string;
  walletAddress: string;
  timestamp: string;
  paymentId?: string; // Payment ID from INR transaction
  transferable?: boolean; // Whether the ticket can be transferred (always false for tickets)
}

export const saveTicketToFirestore = async (ticketData: TicketData) => {
  const ticketRef = doc(db, "tickets", `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  await setDoc(ticketRef, {
    ...ticketData,
    used: false,
    createdAt: Date.now(),
    transferable: false, // Tickets are not transferable
    currency: 'INR' // Always use INR as currency
  });
};
