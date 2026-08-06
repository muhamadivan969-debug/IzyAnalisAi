import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Simulasi AI response
    const responses = [
      "Berdasarkan analisa teknikal, saham ini menunjukkan sinyal bullish dengan RSI di level 55 dan MACD golden cross.",
      "Saham ini berada di zona support kuat, potensi rebound dalam waktu dekat. Target harga Rp 10.500.",
      "Volume perdagangan meningkat 30% dari rata-rata, menandakan minat beli yang kuat.",
      "Secara fundamental, rasio P/E berada di bawah rata-rata industri, menandakan saham ini masih undervalued.",
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        response: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memproses permintaan' },
      { status: 500 }
    );
  }
}
