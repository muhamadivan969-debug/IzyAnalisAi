import { NextResponse } from 'next/server';

// ✅ TAMBAHKAN INI BIAR DINAMIS (GA DIPAKSA STATIS)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kode = searchParams.get('kode');

    const symbols = [
      'BBCA.JK', 'BBRI.JK', 'TLKM.JK', 'BMRI.JK', 'ASII.JK',
      'ADRO.JK', 'TPIA.JK', 'UNVR.JK', 'GOTO.JK', 'BRIS.JK',
      'ANTM.JK', 'ICBP.JK', 'INDF.JK', 'CPIN.JK', 'PGAS.JK'
    ];

    if (!kode) {
      const stocks = await Promise.all(symbols.map(async (symbol) => {
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
