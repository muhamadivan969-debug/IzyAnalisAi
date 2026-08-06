import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  // Dummy data untuk demo
  const sectorData: Record<string, any[]> = {
    Perbankan: [
      { kode: 'BBCA', name: 'Bank Central Asia', change: 1.25 },
      { kode: 'BBRI', name: 'Bank Rakyat Indonesia', change: 0.75 },
      { kode: 'BMRI', name: 'Bank Mandiri', change: -0.32 },
      { kode: 'BNGA', name: 'Bank CIMB Niaga', change: 0.45 },
    ],
    Energi: [
      { kode: 'ADRO', name: 'Adaro Energy', change: 2.10 },
      { kode: 'MEDC', name: 'Medco Energi', change: -0.85 },
      { kode: 'ENRG', name: 'Energi Mega Persada', change: 1.20 },
    ],
    Tambang: [
      { kode: 'ANTM', name: 'Aneka Tambang', change: 1.85 },
      { kode: 'INCO', name: 'Vale Indonesia', change: -1.42 },
    ],
    Teknologi: [
      { kode: 'GOTO', name: 'GoTo Gojek Tokopedia', change: -2.35 },
      { kode: 'DMMX', name: 'Digital Mediatama', change: 3.10 },
    ],
    Healthcare: [
      { kode: 'SILO', name: 'Siloam Hospitals', change: 0.55 },
      { kode: 'KAEF', name: 'Kimia Farma', change: -0.75 },
    ],
    Property: [
      { kode: 'BSDE', name: 'Bumi Serpong Damai', change: -0.32 },
      { kode: 'PWON', name: 'Pakuwon Jati', change: 0.85 },
    ],
    Consumer: [
      { kode: 'UNVR', name: 'Unilever Indonesia', change: 1.95 },
      { kode: 'ICBP', name: 'Indofood CBP', change: 0.65 },
    ],
    Transportasi: [
      { kode: 'CPIN', name: 'Charoen Pokphand', change: -0.95 },
      { kode: 'ASSA', name: 'Adi Sarana Armada', change: 1.10 },
    ],
  };

  const data = name ? sectorData[name] || [] : [];
  
  return NextResponse.json({
    success: true,
    data,
  });
}
