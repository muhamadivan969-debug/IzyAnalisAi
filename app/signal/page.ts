import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ['ERAA.JK', 'ESSA.JK', 'ESTI.JK', 'FUTR.JK', 'BUMI.JK', 'BRMS.JK'];
    
    const signals = await Promise.all(symbols.map(async (symbol) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data?.chart?.result?.[0]) {
        const meta = data.chart.result[0].meta;
        const quote = data.chart.result[0].indicators.quote[0];
        const last = quote.close.length - 1;
        const volume = quote.volume[last] || 0;
        const avgVolume = meta.averageDailyVolume || 1000000;
        const volumeRatio = volume / avgVolume;
        
        return {
          kode: symbol.replace('.JK', ''),
          harga: quote.close[last] || 0,
          change: quote.close[last] && quote.open[0] 
            ? ((quote.close[last] - quote.open[0]) / quote.open[0]) * 100 
            : 0,
          volume,
          avgVolume,
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
