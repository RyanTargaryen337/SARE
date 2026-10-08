import { createContext, useContext } from 'react';

export type OrderState =
  | 'incoming' | 'accepted' | 'preparing' | 'ready'
  | 'claimed' | 'picked' | 'delivered' | 'rejected';

export interface OrderItem { name: string; qty: number; price: number; }

export interface Order {
  id: string;
  code: string;
  vendorId: string;
  areaId: string; // customer area
  items: OrderItem[];
  subtotal: number;
  fees: { delivery: number; service: number; small: number; total: number };
  km: number;
  surge: boolean;
  state: OrderState;
  placedAt: number; // tick
  prepTicksLeft: number;
  riderId: string | null;
  isUser: boolean; // placed via customer app in this session
  incomingSince: number;
  readySince: number | null;
  deliveredAt: number | null;
}

export interface Rider {
  id: string;
  name: string;
  x: number; y: number;
  fx: number; fy: number; tx: number; ty: number; legTicks: number; legTotal: number;
  status: 'idle' | 'pickup' | 'dropoff';
  orderId: string | null;
  deliveries: number;
  monthDeliveries: number;
  earnings: number; // today, ₦
  online: boolean;
}

export interface SimState {
  tick: number;
  riders: Rider[];
  orders: Order[];
  surge: boolean;
  events: string[];
}

export interface SimApi extends SimState {
  placeOrder: (vendorId: string, items: OrderItem[], areaId: string) => string;
  acceptOrder: (id: string) => void;
  rejectOrder: (id: string) => void;
  markReady: (id: string) => void;
  claimOrder: (orderId: string, riderId: string) => void;
  pickupOrder: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  toggleRider: (riderId: string) => void;
}

export const SimCtx = createContext<SimApi | null>(null);

export function useSim(): SimApi {
  const ctx = useContext(SimCtx);
  if (!ctx) throw new Error('useSim outside provider');
  return ctx;
}
