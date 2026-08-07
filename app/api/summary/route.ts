import { NextResponse } from 'next/server';
import { getMarketOverview, getTopGainers } from '@baguskto/saham';

export async function GET() {
  try {
    // Ambil IHSG
    const market = await getMarketOverview();
    const ihsg = {
      close: market.index || 0,
      changePercent: market.change || 0,
    };

    // Ambil top gainers (5 saham dengan kenaikan tertinggi)
    const topPicks = await getTopGainers(5);

    return NextResponse.json({
      success: true,
      data: {
        ihsg,
        topPicks: topPicks.map((s: any) => ({
          kode: s.symbol,
          name: s.name,
          close: s.price || 0,
          changePercent: s.change || 0,
        })),
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal ambil data' },
      { status: 500 }
    );
  }
}
