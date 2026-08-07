import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ambil IHSG dari Yahoo Finance
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EJKSE');
    const data = await res.json();

    let ihsg = { close: 0, changePercent: 0 };
    if (data?.chart?.result?.[0]) {
      const quote = data.chart.result[0].indicators.quote[0];
      const lastIndex = quote.close.length - 1;
      ihsg = {
        close: quote.close[lastIndex] || 0,
        changePercent: quote.close[lastIndex] && quote.open[0]
          ? ((quote.close[lastIndex] - quote.open[0]) / quote.open[0]) * 100
          : 0,
      };
    }

    // Ambil 3 saham top dari Yahoo
    const symbols = ['BBCA.JK', 'BBRI.JK', 'TLKM.JK'];
    const topPicks = await Promise.all(symbols.map(async (symbol) => {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
      const data = await res.json();
      if (data?.chart?.result?.[0]) {
        const quote = data.chart.result[0].indicators.quote[0];
        const meta = data.chart.result[0].meta;
        const lastIndex = quote.close.length - 1;
        return {
          kode: symbol.replace('.JK', ''),
          name: meta.symbol || symbol,
          close: quote.close[lastIndex] || 0,
          changePercent: quote.close[lastIndex] && quote.open[0]
            ? ((quote.close[lastIndex] - quote.open[0]) / quote.open[0]) * 100
            : 0,
        };
      }
      return null;
    }));

    return NextResponse.json({
      success: true,
      data: {
        ihsg,
        topPicks: topPicks.filter(s => s !== null),
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
