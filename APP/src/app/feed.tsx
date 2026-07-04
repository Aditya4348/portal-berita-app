import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, ScrollView, Text, useWindowDimensions, View } from "react-native";
import BottomNav from "../components/BottomNav";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const news = [
  {
    id: "1",
    category: "KECERDASAN BUATAN",
    accent: "bg-blue-950",
    artwork: "AI",
    title: "Robot humanoid mulai keluar dari laboratorium",
    summary: "Generasi baru mesin adaptif mulai memasuki pabrik dan belajar lebih cepat dari perkiraan.",
    time: "12 menit lalu",
    read: "4 menit baca",
  },
  {
    id: "2",
    category: "IKLIM & ENERGI",
    accent: "bg-emerald-800",
    artwork: "ENERGI",
    title: "Terobosan baterai yang diam-diam mengubah jaringan listrik",
    summary: "Penyimpanan energi jangka panjang makin murah, aman, dan siap mengubah energi terbarukan.",
    time: "38 menit lalu",
    read: "6 menit baca",
  },
  {
    id: "3",
    category: "EKONOMI GLOBAL",
    accent: "bg-amber-700",
    artwork: "PASAR",
    title: "Mengapa pasar memperkirakan perlambatan ekonomi yang terkendali",
    summary: "Data inflasi dan ketahanan lapangan kerja memberi investor optimisme yang tetap berhati-hati.",
    time: "1 jam lalu",
    read: "5 menit baca",
  },
];

export default function FeedScreen() {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;


  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-12 pt-5">
        <View className="mx-auto w-full max-w-xl px-4">
        <View className="mb-4 border-b-2 border-slate-950 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-black tracking-tight text-slate-950">NUSA WARTA</Text>
              <Text className="mt-0.5 text-[9px] font-bold uppercase tracking-[3px] text-red-600">Portal berita berbasis AI</Text>
            </View>
          <Pressable
            onPress={() => router.push("/ask")}
            className="h-12 w-12 items-center justify-center border border-slate-300 bg-white shadow-md shadow-slate-200"
          >
            <Text className="text-xl text-slate-800">＋</Text>
          </Pressable>
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sabtu, 4 Juli 2026</Text>
            <Text className="text-[10px] font-black uppercase tracking-widest text-red-600">Edisi Terkini</Text>
          </View>
        </View>

        <View className="mb-6 flex-row items-center border-l-4 border-red-600 bg-white p-4 shadow-sm shadow-slate-200">
          <View className="mr-3 h-10 w-10 items-center justify-center bg-slate-950">
            <Text className="text-xs font-black text-white">AI</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-extrabold text-slate-950">Pilihan redaksi untuk Anda</Text>
            <Text className="mt-0.5 text-xs leading-5 text-slate-500">3 laporan utama · Diperbarui beberapa saat lalu</Text>
          </View>
        </View>

        {news.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => router.push({ pathname: "/article/[id]", params: { id: item.id } })}
            className="mb-6 overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-300 active:opacity-90"
          >
            <View className={`${isNarrow ? "h-40" : "h-48"} items-center justify-center ${item.accent}`}>
              <View className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15" />
              <View className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-slate-950/10" />
              <Text className={`${isNarrow ? "text-5xl" : "text-6xl"} font-black tracking-tighter text-white/90`}>{item.artwork}</Text>
              <View className="absolute bottom-4 left-4 h-1 w-16 bg-red-500" />
              <View className="absolute left-4 top-4 bg-white px-3 py-2">
                <Text className="text-[10px] font-black tracking-widest text-slate-950">LAPORAN 0{index + 1}</Text>
              </View>
            </View>
            <View className="p-5">
              <Text className="text-[10px] font-black tracking-[2px] text-red-600">{item.category}</Text>
              <Text className={`${isNarrow ? "text-xl leading-7" : "text-2xl leading-8"} mt-3 font-black tracking-tight text-slate-950`}>{item.title}</Text>
              <Text className="mt-3 text-sm leading-6 text-slate-500">{item.summary}</Text>
              <View className={`${isNarrow ? "items-start" : "items-center"} mt-5 flex-row justify-between border-t border-slate-100 pt-4`}>
                <View className="flex-row items-center">
                  <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-slate-950">
                    <Text className="text-[10px] text-white">AI</Text>
                  </View>
                  <Text className={`${isNarrow ? "max-w-40 text-[10px]" : "text-xs"} font-bold text-slate-500`}>{item.time} · {item.read}</Text>
                </View>
                <Text className="text-xl font-bold text-red-600">→</Text>
              </View>
            </View>
          </Pressable>
        ))}
        </View>
      </ScrollView>
      <BottomNav active="feed" />
    </SafeAreaView>
  );
}
