import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const symbols = [
      'BBCA.JK', 'BBRI.JK', 'TLKM.JK', 'BMRI.JK', 'ASII.JK',
      'ADRO.JK', 'TPIA.JK', 'UNVR.JK', 'GOTO.JK', 'BRIS.JK',
      'ANTM.JK', 'ICBP.JK', 'INDF.JK', 'CPIN.JK', 'PGAS.JK'
    ];

    const predictions = await Promise.all(symbols.map(async (symbol) => {
      try {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`);
        const data = await res.json();

        if (!data?.chart?.result?.[0]) return null;

        const quote = data.chart.result[0].indicators.quote[0];
        const prices = quote.close || [];
        if (prices.length < 20) return null;

        const last = prices.length - 1;
        const currentPrice = prices[last];

        // 1. RSI (Relative Strength Index)
        let gains = 0, losses = 0;
        for (let i = 1; i < prices.length; i++) {
          const diff = prices[i] - prices[i - 1];
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / prices.length;
        const avgLoss = losses / prices.length;
        const rsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));

        // 2. Moving Average (MA20 vs MA50)
        const ma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
        const ma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50;

        // 3. Volume
        const volume = quote.volume || [];
        const avgVolume = volume.slice(-10).reduce((a, b) => a + b, 0) / 10;
        const currentVolume = volume[last] || 0;

        // 4. Price Change
        const prevPrice = prices[last - 1] || currentPrice;
        const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;

        // SCORING: BULLISH = 50 (netral) + bonus
        let bullishScore = 50;

        // RSI: oversold (<30) = bullish, overbought (>70) = bearish
        if (rsi < 30) bullishScore += 20;
        else if (rsi < 40) bullishScore += 10;
        else if (rsi > 70) bullishScore -= 20;
        else if (rsi > 60) bullishScore -= 10;

        // MA: golden cross = bullish, death cross = bearish
        if (ma20 > ma50) bullishScore += 15;
        else if (ma20 < ma50) bullishScore -= 15;

        // Volume: tinggi = bullish, rendah = bearish
        if (currentVolume > avgVolume * 1.5) bullishScore += 10;
        else if (currentVolume < avgVolume * 0.5) bullishScore -= 5;

        // Price change: positif = bullish, negatif = bearish
        if (priceChange > 1) bullishScore += 5;
        else if (priceChange < -1) bullishScore -= 5;

        // Batasi score 0-100
        bullishScore = Math.max(0, Math.min(100, bullishScore));
        const bearishScore = 100 - bullishScore;

        let direction = 'NEUTRAL';
        let recommendation = 'HOLD';
        let confidence = 50;

        if (bullishScore >= 70) {
          direction = 'BULLISH';
          recommendation = 'BUY';
          confidence = Math.round(70 + (bullishScore - 70) * 0.5);
        } else if (bearishScore >= 70) {
          direction = 'BEARISH';
          recommendation = 'SELL';
          confidence = Math.round(70 + (bearishScore - 70) * 0.5);
        } else if (bullishScore >= 60) {
          direction = 'BULLISH';
          recommendation = 'BUY';
          confidence = 65;
        } else if (bearishScore >= 60) {
          direction = 'BEARISH';
          recommendation = 'SELL';
          confidence = 65;
        }

        // Target harga (simulasi)
        const targetPrice = direction === 'BULLISH' 
          ? currentPrice * (1 + confidence / 100 * 0.5)
          : direction === 'BEARISH'
          ? currentPrice * (1 - confidence / 100 * 0.5)
          : currentPrice;

        return {
          kode: symbol.replace('.JK', ''),
          name: data.chart.result[0].meta.symbol || symbol,
          harga: Math.round(currentPrice),
          target: Math.round(targetPrice),
          rsi: Math.round(rsi),
          ma20: Math.round(ma20),
          ma50: Math.round(ma50),
          volume: currentVolume,
          avgVolume: Math.round(avgVolume),
          bullish: Math.round(bullishScore),
          bearish: Math.round(bearishScore),
          direction,
          recommendation,
          confidence,
          priceChange: Number(priceChange.toFixed(2)),
        };
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
        return null;
      }
    }));

    const validPredictions = predictions.filter(p => p !== null);
    validPredictions.sort((a, b) => b.confidence - a.confidence);

    return NextResponse.json({
      success: true,
      data: validPredictions,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memprediksi' },
      { status: 500 }
    );
  }
}
