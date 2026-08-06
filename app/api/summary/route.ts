import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Data sementara (nanti diganti pake Yahoo Finance)
    const ihsg = {
      close: 7250,
      changePercent: 1.25,
    };

    const topPicks = [
      { kode: 'BBCA', name: 'Bank Central Asia', close: 10250, changePercent: 1.25 },
      { kode: 'BBRI', name: 'Bank Rakyat Indonesia', close: 4850, changePercent: 0.75 },
      { kode: 'TLKM', name: 'Telkom Indonesia', close: 3850, changePercent: -0.5 },
    ];

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
