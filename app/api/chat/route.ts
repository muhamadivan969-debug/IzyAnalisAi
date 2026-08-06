import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Simulasi AI response
    const responses = [
      `📊 **Proyeksi IHSG Besok - 55% BEARISH vs 45% BULLISH**

🔍 **Analisis Kunci:**
• BBCA ditutup di harga terendah harian (6.375)
• MACD histogram mulai negatif
• BBRI dan TLKM masih di atas MA pendek

🎯 **Level Kunci:**
• Support: 6.180
• Resistance: 6.425
• Breakout: 6.500

💡 **Bottom Line:**
IHSG besok condong melemah tipis, target turun 0.3-0.8%.
Tapi nggak akan kolaps selama BBCA bertahan di atas 6.375.
`,
      `📈 **Analisis ${message.toUpperCase()}**

💹 **Harga:** Rp ${(Math.random() * 10000 + 5000).toFixed(0)}
📊 **Perubahan:** ${(Math.random() * 10 - 5).toFixed(2)}%

🔍 **Teknikal:**
• RSI: ${(Math.random() * 100).toFixed(0)} - ${Math.random() > 0.7 ? 'Overbought 🔴' : Math.random() > 0.3 ? 'Netral ⚪' : 'Oversold 🟢'}
• MACD: ${Math.random() > 0.5 ? 'Positif 🟢' : 'Negatif 🔴'}
• MA20 vs MA50: ${Math.random() > 0.5 ? 'Golden Cross 🟢' : 'Death Cross 🔴'}

🎯 **Rekomendasi:** ${Math.random() > 0.5 ? 'BUY' : 'HOLD'}

⚠️ Gunakan risk management!`,
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses permintaan' },
      { status: 500 }
    );
  }
}
