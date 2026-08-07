import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kode = searchParams.get('kode');

    // Ambil semua saham IDX dari Yahoo Finance
    const searchRes = await fetch('https://query1.finance.yahoo.com/v1/finance/search?q=IDX&quotesCount=1000');
    const searchData = await searchRes.json();
    const allSymbols = searchData.quotes
      .filter((q: any) => q.symbol?.endsWith('.JK'))
      .map((q: any) => q.symbol);

    if (!kode) {
      const stocks = await Promise.all(allSymbols.slice(0, 50).map(async (symbol: string) => {
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
        data: stocks.filter(s => s !== null),
      });
    }

    const symbol = `${kode.toUpperCase()}.JK`;
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    const data = await res.json();

    if (data?.chart?.result?.[0]) {
      const quote = data.chart.result[0].indicators.quote[0];
      const meta = data.chart.result[0].meta;
      const lastIndex = quote.close.length - 1;
      return NextResponse.json({
        success: true,
        data: {
          kode: symbol.replace('.JK', ''),
          name: meta.symbol || symbol,
          close: quote.close[lastIndex] || 0,
          changePercent: quote.close[lastIndex] && quote.open[0]
            ? ((quote.close[lastIndex] - quote.open[0]) / quote.open[0]) * 100
            : 0,
          volume: quote.volume[lastIndex] || 0,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Saham tidak ditemukan' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal ambil data' },
      { status: 500 }
    );
  }
}
