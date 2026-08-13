import { createServerSupabase } from "@/lib/supabase/supabase";

export default async function TestDBPage() {
  // 1. Panggil helper server supabase (cookies ditangani otomatis di dalam helper)
  const supabase = await createServerSupabase();

  // 2. Tes ping ke tabel user_profiles
  const { data, error } = await supabase.from("user_profiles").select("*");

  return (
    <div className="p-10 font-mono">
      <h1 className="text-2xl font-bold mb-4">🩺 Status Koneksi Supabase</h1>

      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p className="font-bold">Koneksi Gagal / Error!</p>
          <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <div className="bg-green-100 text-green-700 p-4 rounded-md">
          <p className="font-bold">✅ Koneksi Berhasil!</p>
          <p className="mt-2">Response dari database:</p>
          <pre className="mt-2 bg-black text-green-400 p-4 rounded text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
