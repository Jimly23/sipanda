<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Berita Acara Hasil Seleksi Kepanitiaan</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #222;
            line-height: 1.4;
            margin: 20px 25px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 12px;
            margin-bottom: 18px;
        }
        .title {
            font-size: 15px;
            font-weight: bold;
            color: #1e3a8a;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .subtitle {
            font-size: 11px;
            color: #4b5563;
            margin-top: 4px;
        }
        .meta-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 16px;
            font-size: 10px;
        }
        .meta-box table {
            width: 100%;
        }
        .meta-box td {
            padding: 2px 0;
            border: none;
        }
        h3.divisi-title {
            font-size: 11px;
            color: #1e40af;
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 5px 8px;
            margin: 16px 0 6px 0;
            text-transform: uppercase;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        table.data-table th, table.data-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
            text-align: left;
        }
        table.data-table th {
            background-color: #f1f5f9;
            color: #1e293b;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .center { text-align: center; }
        .badge {
            display: inline-block;
            padding: 1px 5px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        .direct { background: #dcfce7; color: #166534; }
        .duplikat { background: #fef9c3; color: #854d0e; }
        .cross_division { background: #dbeafe; color: #1e40af; }
        .unallocated { background: #fee2e2; color: #991b1b; }
        .signatures {
            margin-top: 35px;
            width: 100%;
        }
        .signatures td {
            border: none;
            text-align: center;
            width: 50%;
            vertical-align: top;
            font-size: 10px;
        }
        .space { height: 60px; }
        .footer-note {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            font-size: 8px;
            color: #94a3b8;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Berita Acara Hasil Seleksi Kepanitiaan</h1>
        <div class="subtitle">Sistem Pendukung Keputusan Berbasis Profile Matching (SIPANDA)</div>
    </div>

    <div class="meta-box">
        <table>
            <tr>
                <td style="width: 20%; font-weight: bold;">Nama Sesi Seleksi</td>
                <td style="width: 45%;">: {{ $session->nama_sesi }}</td>
                <td style="width: 15%; font-weight: bold;">Status Pleno</td>
                <td style="width: 20%;">: {{ strtoupper($session->status) }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Waktu Perhitungan</td>
                <td>: {{ $session->calculated_at ? $session->calculated_at->format('d F Y H:i:s') : '-' }}</td>
                <td style="font-weight: bold;">Dicetak Pada</td>
                <td>: {{ now()->format('d F Y H:i') }}</td>
            </tr>
        </table>
    </div>

    <p style="margin-bottom: 10px; font-size: 9.5px;">
        Pada hari ini telah diselesaikan penetapan seleksi alokasi divisi kepanitiaan menggunakan algoritma Profile Matching multi-stage (7 kriteria penilaian, deteksi duplikasi kuota, dan redistribusi lintas divisi). Berikut adalah rekapitulasi anggota per divisi:
    </p>

    @foreach($divisis as $divisi)
        @php
            $results = $allocatedByDivisi->get($divisi->id, collect());
        @endphp
        <h3 class="divisi-title">
            {{ $divisi->nama }} (Kapasitas Kuota: {{ $divisi->kuota }} Orang — Teralokasi: {{ $results->count() }})
        </h3>

        <table class="data-table">
            <thead>
                <tr>
                    <th class="center" style="width: 25px;">No</th>
                    <th style="width: 80px;">NIM</th>
                    <th>Nama Anggota</th>
                    <th class="center" style="width: 60px;">Skor Akhir</th>
                    <th style="width: 100px;">Status Alokasi</th>
                    <th style="width: 130px;">Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @forelse($results as $idx => $item)
                    <tr>
                        <td class="center">{{ $idx + 1 }}</td>
                        <td style="font-family: monospace;">{{ $item->kandidat?->nim ?? '-' }}</td>
                        <td style="font-weight: bold;">{{ $item->kandidat?->nama ?? '-' }}</td>
                        <td class="center" style="font-weight: bold; font-family: monospace;">
                            {{ number_format($item->skor_akhir, 2) }}
                        </td>
                        <td>
                            <span class="badge {{ $item->status }}">
                                {{ strtoupper(str_replace('_', ' ', $item->status)) }}
                            </span>
                        </td>
                        <td style="font-size: 8.5px; color: #475569;">
                            {{ $item->rekomendasi_sistem ?: '-' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="center" style="color: #94a3b8; padding: 10px;">
                            Tidak ada anggota yang teralokasi pada divisi ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @endforeach

    <table class="signatures">
        <tr>
            <td>
                Mengetahui,<br>
                <strong>Ketua Panitia Pelaksana</strong>
                <div class="space"></div>
                ( ________________________________ )<br>
                NIM: ................................................
            </td>
            <td>
                Menyetujui,<br>
                <strong>Steering Committee / Pleno</strong>
                <div class="space"></div>
                ( ________________________________ )<br>
                NIM: ................................................
            </td>
        </tr>
    </table>

    <div class="footer-note">
        Dokumen ini dikeluarkan secara resmi oleh Aplikasi SIPANDA (Sistem Pendukung Keputusan Seleksi Kepanitiaan).
    </div>
</body>
</html>
