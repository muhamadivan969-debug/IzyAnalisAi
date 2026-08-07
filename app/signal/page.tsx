import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ['BBCA.JK', 'BBRI.JK', 'TLKM.JK', 'BMRI.JK', 'ASII.JK', 'ADRO.JK'];

    const signals = await Promise.all(symbols.map(async (symbol) => {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
      const data = await res.json();
      
      if (data?.chart?.result?.[0]) {
        const quote = data.chart.result[0].indicators.quote[0];
        const meta = data.chart.result[0].meta;
        const lastIndex = quote.close.length - 1;
        const volume = quote.volume[lastIndex] || 0;
        const avgVolume = meta.averageDailyVolume || 1000000;
        const volumeRatio = volume / avgVolume;

        return {
          kode: symbol.replace('.JK', ''),
          harga: quote.close[lastIndex] || 0,
          change: quote.close[lastIndex] && quote.open[0]
            ? ((quote.close[lastIndex] - quote.open[0]) / quote.open[0]) * 100
            : 0,
          volumeRatio,
          isSignal: volumeRatio > 20,
          timestamp: new Date().toISOString(),
        };
      }
      return null;
    }));

    const validSignals = signals.filter(s => s !== null);
    const newSignals = validSignals.filter(s => s.isSignal);

    return NextResponse.json({
      success: true,
      data: {
        signals: newSignals,
        all: validSignals,
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
