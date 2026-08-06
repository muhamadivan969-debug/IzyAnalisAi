import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ['ALKA.JK', 'DWGL.JK', 'MSKY.JK', 'VIVA.JK', 'BNR.JK', 'BAJA.JK'];
    
    const movers = await Promise.all(symbols.map(async (symbol) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data?.chart?.result?.[0]) {
        const meta = data.chart.result[0].meta;
        const quote = data.chart.result[0].indicators.quote[0];
        const last = quote.close.length - 1;
        
        return {
          kode: symbol.replace('.JK', ''),
          harga: quote.close[last] || 0,
          change: quote.close[last] && quote.open[0] 
            ? ((quote.close[last] - quote.open[0]) / quote.open[0]) * 100 
            : 0,
          volume: quote.volume[last] || 0,
        };
      }
      return null;
    }));

    const validMovers = movers.filter((s): s is NonNullable<typeof s> => s !== null);
    validMovers.sort((a, b) => (b?.change ?? 0) - (a?.change ?? 0));

    return NextResponse.json({
      success: true,
      data: validMovers,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal ambil data' },
      { status: 500 }
    );
  }
}
