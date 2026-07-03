import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const articles = {
  "1": {
    category: "KECERDASAN BUATAN",
    title: "Robot humanoid mulai keluar dari laboratorium",
    source: "Ulasan Kecerdasan",
    time: "12 menit lalu · 4 menit baca",
    hero: "AI",
    heroColor: "bg-blue-950",
    summary: [
      "Robot humanoid memasuki fase baru yang menentukan. Setelah bertahun-tahun tampil dalam demonstrasi terkontrol, sejumlah produsen mulai menempatkan mesin adaptif di pabrik sungguhan untuk memilah komponen, memindahkan material, dan belajar bersama pekerja manusia.",
      "Perubahan ini didukung model penglihatan yang lebih baik, aktuator yang lebih murah, dan sistem AI yang mampu menerjemahkan instruksi sehari-hari menjadi tindakan fisik. Uji coba awal menunjukkan mesin belajar paling cepat saat menangani beragam tugas.",
      "Para ahli tetap mengingatkan bahwa keandalan, keselamatan, dan biaya masih menjadi tantangan besar. Dalam waktu dekat, robot bukan menggantikan seluruh pekerja, melainkan mengambil alih tugas berbahaya atau melelahkan sementara manusia mengawasi pekerjaan yang lebih rumit.",
    ],
  },
  "2": {
    category: "IKLIM & ENERGI",
    title: "Terobosan baterai yang diam-diam mengubah jaringan listrik",
    source: "Jurnal Jaringan Masa Depan",
    time: "38 menit lalu · 6 menit baca",
    hero: "ENERGI",
    heroColor: "bg-emerald-800",
    summary: [
      "Baterai jangka panjang mulai beralih dari tahap eksperimen menuju proyek berskala jaringan, memberi perusahaan listrik cara praktis untuk menyimpan energi terbarukan saat malam tanpa angin dan hari berawan.",
      "Komposisi kimia baru mengutamakan bahan yang melimpah dan usia pakai panjang dibandingkan ukuran ringkas. Teknologi ini kurang cocok untuk mobil, tetapi berpotensi mengubah penyimpanan tetap yang sangat mengutamakan biaya dan keselamatan.",
      "Ujian terbesarnya kini adalah pelaksanaan: produsen perlu meningkatkan kapasitas produksi sementara perusahaan listrik memperbarui model perencanaan yang sebelumnya mengandalkan pembangkit bahan bakar fosil.",
    ],
  },
  "3": {
    category: "EKONOMI GLOBAL",
    title: "Mengapa pasar memperkirakan perlambatan ekonomi yang terkendali",
    source: "Catatan Pasar",
    time: "1 jam lalu · 5 menit baca",
    hero: "PASAR",
    heroColor: "bg-amber-700",
    summary: [
      "Investor semakin memperhitungkan penurunan inflasi secara bertahap tanpa lonjakan pengangguran, sebuah kombinasi yang sebelumnya dianggap sulit terjadi.",
      "Data terbaru menunjukkan permintaan konsumen yang tangguh dan rantai pasok yang lebih stabil. Keduanya membantu meredakan tekanan harga sekaligus menjaga pertumbuhan tetap positif.",
      "Optimisme ini masih rapuh. Guncangan energi, inflasi jasa yang sulit turun, atau perlambatan perekrutan secara mendadak dapat dengan cepat menggoyahkan keyakinan pasar saat ini.",
    ],
  },
};

type ArticleId = keyof typeof articles;
type Message = { id: number; role: "agent" | "user"; text: string };

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articles[(id as ArticleId) || "1"] ?? articles["1"];
  const { height, width } = useWindowDimensions();
  const isCompact = height < 720 || width < 360;
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "agent", text: "Saya sudah menganalisis berita ini. Tanyakan fakta utama, konteks, atau hal yang mungkin terjadi selanjutnya." },
    { id: 2, role: "user", text: "Apa kesimpulan terpentingnya?" },
    { id: 3, role: "agent", text: "Perubahan utamanya adalah peralihan dari demonstrasi terkontrol menuju penggunaan nyata. Kemajuan kini lebih bergantung pada keandalan dalam skala besar." },
  ]);

  const sendMessage = () => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: cleanQuestion },
      { id: Date.now() + 1, role: "agent", text: "Berdasarkan artikel ini, hasil awalnya menjanjikan tetapi masih terlalu dini. Hal berikutnya yang perlu diperhatikan adalah kestabilan kinerja dalam kondisi sehari-hari." },
    ]);
    setQuestion("");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
          <View className="mx-auto w-full max-w-2xl">
          <View className={`${isCompact ? "h-56" : "h-72"} overflow-hidden px-5 pt-5 ${article.heroColor}`}>
            <View className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15" />
            <View className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-slate-950/10" />
            <View className="z-10 flex-row items-center justify-between">
              <Pressable onPress={() => router.back()} className="h-11 w-11 items-center justify-center border border-white/20 bg-slate-950/75">
                <Text className="text-2xl text-white">‹</Text>
              </Pressable>
              <View className="flex-row items-center">
                <View className="mr-3 bg-white px-3 py-2"><Text className="text-[10px] font-black text-slate-950">NUSA WARTA</Text></View>
              <Pressable className="h-11 w-11 items-center justify-center border border-white/30 bg-white/10">
                <Text className="text-lg text-white">↗</Text>
              </Pressable>
              </View>
            </View>
            <Text className="mt-5 text-[10px] font-black tracking-[2px] text-red-300">{article.category}</Text>
            <Text className={`${isCompact ? "text-2xl leading-8" : "text-3xl leading-9"} mt-3 max-w-sm font-black tracking-tight text-white`}>{article.title}</Text>
            <View className="absolute bottom-5 right-5 items-end">
              <Text className="text-4xl font-black tracking-tighter text-white/20">{article.hero}</Text>
              <View className="mt-2 h-1 w-14 bg-red-500" />
            </View>
          </View>

          <View className="px-5 pt-6">
            <View className={`${isCompact ? "items-start" : "items-center"} mb-7 flex-row justify-between border-b border-slate-300 pb-5`}>
              <View>
                <Text className="text-sm font-extrabold text-slate-900">{article.source}</Text>
                <Text className="mt-1 text-xs font-medium text-slate-400">{article.time}</Text>
              </View>
              <Pressable className={`${isCompact ? "ml-3 px-3" : "px-4"} flex-row items-center bg-slate-950 py-3 active:bg-red-700`}>
                <Text className="mr-2 text-base text-red-400">▶</Text>
                <Text className={`${isCompact ? "text-[10px]" : "text-xs"} font-extrabold text-white`}>Dengarkan · 3:42</Text>
              </Pressable>
            </View>

            <View className="border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200">
              <View className="mb-4 flex-row items-center">
                <View className="mr-3 h-9 w-9 items-center justify-center bg-red-600">
                  <Text className="text-xs font-black text-white">AI</Text>
                </View>
                <View>
                  <Text className="text-base font-black text-slate-950">Rangkuman AI</Text>
                  <Text className="text-xs font-semibold text-red-600">Inti berita secara lengkap</Text>
                </View>
              </View>
              {article.summary.map((paragraph) => (
                <Text key={paragraph} className="mb-4 text-[15px] leading-7 text-slate-600">{paragraph}</Text>
              ))}
              <Pressable className="flex-row items-center border-t border-slate-100 pt-4">
                <Text className="text-sm font-extrabold text-red-600">Baca sumber asli</Text>
                <Text className="ml-2 text-red-600">↗</Text>
              </Pressable>
            </View>

            <View className="mb-4 mt-9 flex-row items-end justify-between">
              <View>
                <Text className="text-xs font-black uppercase tracking-[2px] text-red-600">Agen artikel</Text>
                <Text className="mt-1 text-2xl font-black text-slate-950">Pelajari lebih dalam</Text>
              </View>
              <View className="flex-row items-center rounded-full bg-emerald-100 px-3 py-2">
                <View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                <Text className="text-[10px] font-black text-emerald-700">AKTIF</Text>
              </View>
            </View>

            <View className="border-t-4 border-red-600 bg-slate-950 p-4 shadow-xl shadow-slate-400">
              <ScrollView nestedScrollEnabled className="max-h-80" showsVerticalScrollIndicator={false}>
                {messages.map((message) => (
                  <View key={message.id} className={`mb-3 max-w-[88%] px-4 py-3 ${message.role === "user" ? "ml-auto bg-red-600" : "bg-slate-800"}`}>
                    {message.role === "agent" && (
                      <Text className="mb-1 text-[10px] font-black uppercase tracking-widest text-red-300">Agen Nusa Warta</Text>
                    )}
                    <Text className={`text-sm leading-5 ${message.role === "user" ? "text-white" : "text-slate-200"}`}>{message.text}</Text>
                  </View>
                ))}
              </ScrollView>
              <View className="mt-2 flex-row items-end border border-slate-700 bg-slate-900 p-2">
                <TextInput
                  multiline
                  onChangeText={setQuestion}
                  onSubmitEditing={sendMessage}
                  placeholder="Tanyakan sesuatu tentang berita ini..."
                  placeholderTextColor="#64748b"
                  value={question}
                  className="max-h-24 min-h-11 flex-1 px-2 py-3 text-sm text-white"
                />
                <Pressable onPress={sendMessage} className="h-11 w-11 items-center justify-center bg-red-600 active:bg-red-700">
                  <Text className="text-xl font-bold text-white">↑</Text>
                </Pressable>
              </View>
            </View>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
