import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ambil IHSG dari Yahoo Finance
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EJKSE');
    const data = await res.json();

    if (data?.chart?.result?.[0]) {
      const meta = data.chart.result[0].meta;
      const quote = data.chart.result[0].indicators.quote[0];
      const lastIndex = quote.close.length - 1;

      const ihsg = {
        close: quote.close[lastIndex] || 0,
        changePercent: quote.close[lastIndex] && quote.open[0]
          ? ((quote.close[lastIndex] - quote.open[0]) / quote.open[0]) * 100
          : 0,
      };

      // Data top picks (contoh 3 saham)
      const topPicks = [
        { kode: 'BBCA', name: 'Bank Central Asia', close: 10250, changePercent: 1.25 },
        { kode: 'BBRI', name: 'Bank Rakyat Indonesia', close: 4850, changePercent: 0.75 },
        { kode: 'TLKM', name: 'Telkom Indonesia', close: 3850, changePercent: -0.5 },
      ];

      return NextResponse.json({
        success: true,
        data: {
          ihsg,
          topPicks,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Gagal ambil data IHSG',
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal ambil data' },
      { status: 500 }
    );
  }
}
