import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      { kode: 'BBCA', name: 'Bank Central Asia', close: 10250, changePercent: 1.25 },
      { kode: 'BBRI', name: 'Bank Rakyat Indonesia', close: 4850, changePercent: 0.75 },
      { kode: 'TLKM', name: 'Telkom Indonesia', close: 3850, changePercent: -0.50 },
    ]
  });
}
