import { NextResponse } from 'next/server';
import { getAvailableStocks, getStockInfo } from '@baguskto/saham';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kode = searchParams.get('kode');

    // Kalo ada kode, ambil detail 1 saham
    if (kode) {
      const stock = await getStockInfo(kode);
      if (stock) {
        return NextResponse.json({
          success: true,
          data: {
            kode: stock.symbol,
            name: stock.name,
            close: stock.price || 0,
            changePercent: stock.change || 0,
            volume: stock.volume || 0,
          },
        });
      }
      return NextResponse.json(
        { success: false, error: 'Saham tidak ditemukan' },
        { status: 404 }
      );
    }

    // Kalo gak ada kode, return semua 958 saham
    const allStocks = await getAvailableStocks();
    return NextResponse.json({
      success: true,
      data: allStocks.map((s: any) => ({
        kode: s.symbol,
        name: s.name,
        close: s.price || 0,
        changePercent: s.change || 0,
      })),
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal ambil data' },
      { status: 500 }
    );
  }
}
