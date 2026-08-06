import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ambil IHSG dari Yahoo Finance
    const resIHSG = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EJKSE');
    const dataIHSG = await resIHSG.json();

    let ihsg = { close: 0, changePercent: 0 };
    if (dataIHSG?.chart?.result?.[0]) {
      const meta = dataIHSG.chart.result[0].meta;
      const quote = dataIHSG.chart.result[0].indicators.quote[0];
      const lastIndex = quote.close.length - 1;
      ihsg = {
        close: quote.close[lastIndex] || 0,
        changePercent: quote.close[lastIndex] && quote.open[0]
          ? ((quote.close[lastIndex] - quote.open[0]) / quote.open[0]) * 100
          : 0,
      };
    }

    // Top picks (ambil dari API saham)
    const resSaham = await fetch('https://izy-analis-ai.vercel.app/api/saham');
    const dataSaham = await resSaham.json();
    const topPicks = dataSaham.success ? dataSaham.data : [];

    return NextResponse.json({
      success: true,
      data: {
        ihsg,
        topPicks,
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
