import { NextResponse } from 'next/server';
import { getAvailableStocks } from '@baguskto/saham';

export async function GET() {
  try {
    const allStocks = await getAvailableStocks();
    
    // Filter saham dengan volume tinggi
    const signals = allStocks
      .filter((s: any) => (s.volume || 0) > 1000000)
      .slice(0, 5)
      .map((s: any) => ({
        kode: s.symbol,
        harga: s.price || 0,
        change: s.change || 0,
        volumeRatio: (s.volume || 0) / 1000000,
        isSignal: true,
        timestamp: new Date().toISOString(),
      }));

    return NextResponse.json({
      success: true,
      data: {
        signals,
        all: allStocks.slice(0, 10),
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal ambil sinyal' },
      { status: 500 }
    );
  }
}
