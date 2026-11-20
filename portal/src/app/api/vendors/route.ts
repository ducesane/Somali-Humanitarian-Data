import { NextResponse } from 'next/server';
import vendorsData from '@/data/undp_somalia_vendors.json';

export async function GET() {
  const totalAmount = vendorsData.reduce((acc, v) => acc + v.total_amount, 0);
  const totalOrders = vendorsData.reduce((acc, v) => acc + v.orders_count, 0);

  return NextResponse.json({
    total_vendors: vendorsData.length,
    total_procurement_value: totalAmount,
    total_purchase_orders: totalOrders,
    data: vendorsData
  });
}
