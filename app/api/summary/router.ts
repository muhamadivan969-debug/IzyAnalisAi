import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fetchStock = async (symbol: string) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.chart?.result?.[0]) {
        const meta = data.chart.result[0].meta;
        const quote = data.chart.result[0].indicators.quote[0];
        const last = quote.close.length - 1;
        return {
          kode: symbol.replace('.JK', ''),
          name: meta.symbol,
          close: quote.close[last] || 0,
          changePercent: quote.close[last] && quote.open[0] 
            ? ((quote.close[last] - quote.open[0]) / quote.open[0]) * 100 
            : 0,
          spark: quote.close.slice(-20).map((v: number) => (v - quote.close[0]) / quote.close[0] * 10 + 5),
        };
      }
      return null;
    };

    const [ihsg, ...stocks] = await Promise.all([
      fetchStock('^JKSE'),
      fetchStock('BBCA.JK'),
      fetchStock('BBRI.JK'),
      fetchStock('TLKM.JK'),
      fetchStock('ASII.JK'),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ihsg: ihsg || { close: 0, changePercent: 0 },
        topPicks: stocks.filter(s => s !== null),
      },
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal ambil data' }, { status: 500 });
  }
}
