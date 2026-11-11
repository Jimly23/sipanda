export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Divisi {
  id: number;
  nama: string;
  kuota: number;
  kandidat_pilihan1_count?: number;
  kandidat_pilihan2_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Parameter {
  id: number;
  kode: string;
  nama: string;
  tipe: 'kompetensi' | 'preferensi';
  faktor: 'CF' | 'SF';
  bobot_persen: number;
}

export interface TargetValue {
  id: number;
  divisi_id: number;
  parameter_id: number;
  target_value: number;
  divisi?: Divisi;
  parameter?: Parameter;
}

export interface NilaiKandidat {
  id: number;
  kandidat_id: number;
  parameter_id: number;
  nilai: number;
  parameter?: Parameter;
}

export interface Kandidat {
  id: number;
  nim: string;
  nama: string;
  pilihan_1_divisi_id: number;
  pilihan_2_divisi_id: number;
  minat_pilihan_1: number;
  minat_pilihan_2: number;
  pilihan_divisi1?: Divisi;
  pilihan_divisi2?: Divisi;
  nilai_kandidats?: NilaiKandidat[];
}

export interface PerhitunganSession {
  id: number;
  nama_sesi: string;
  status: 'draft' | 'calculated' | 'locked';
  calculated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HasilPM {
  id: number;
  session_id: number;
  kandidat_id: number;
  divisi_id: number;
  gap_values: Record<string, number>;
  bobot_gap_values: Record<string, number>;
  nilai_cf: number;
  nilai_sf: number;
  skor_akhir: number;
  ranking: number;
  status: 'direct' | 'duplikat' | 'cross_division' | 'unallocated' | 'not_ranked';
  alokasi_divisi_id: number | null;
  rekomendasi_sistem: string | null;
  is_approved: boolean;
  kandidat?: Kandidat;
  divisi?: Divisi;
  alokasi_divisi?: Divisi;
}

export interface MasterMatrixItem {
  kandidat_id: number;
  nim: string;
  nama: string;
  pilihan_1: string;
  pilihan_2: string;
  minat_p1: number;
  minat_p2: number;
  skor_divisi_p1: number;
  skor_divisi_p2: number;
  rekomendasi_sistem: string;
  status: string;
  rekomendasi_detail: string;
  is_approved: boolean;
  alokasi_divisi_id: number;
  hasil_pm_id: number;
}

export interface SummaryCard {
  divisi_id: number;
  divisi_nama: string;
  kuota: number;
  terisi: number;
  terfulfill: boolean;
  via_redistribusi: boolean;
}

export interface DivisiRanking {
  rank: number;
  nama: string;
  nim: string;
  pilihan_awal: string;
  skor_pm: number;
  status: string;
  rekomendasi: string;
  is_approved: boolean;
  hasil_pm_id: number;
  in_quota: boolean;
}

export interface SessionDetailResponse {
  session: PerhitunganSession;
  master_matrix: MasterMatrixItem[];
  summary_cards: SummaryCard[];
}

export interface DivisiDetailResponse {
  divisi: Divisi;
  kuota: number;
  rankings: DivisiRanking[];
  direct_count: number;
  cross_division_count: number;
}

export interface ExportExcelResponse {
  sheets: Record<string, any[]>;
  session: PerhitunganSession;
}
