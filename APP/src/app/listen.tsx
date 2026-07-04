import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";

const queue = [
  { id: "1", number: "01", title: "Robot humanoid mulai keluar dari laboratorium", source: "Ulasan Kecerdasan", duration: "03:42" },
  { id: "2", number: "02", title: "Terobosan baterai yang mengubah jaringan listrik", source: "Jurnal Jaringan Masa Depan", duration: "05:18" },
  { id: "3", number: "03", title: "Pasar memperkirakan perlambatan terkendali", source: "Catatan Pasar", duration: "04:06" },
];

export default function ListenScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        <View className="mx-auto w-full max-w-xl px-5 pt-6">
          <View className="border-b-2 border-slate-950 pb-4">
            <Text className="text-[10px] font-black uppercase tracking-[3px] text-red-600">Audio Nusa Warta</Text>
            <Text className="mt-2 text-3xl font-black text-slate-950">Antrean Audio</Text>
            <Text className="mt-2 text-sm leading-6 text-slate-500">Dengarkan rangkuman berita pilihan seperti sebuah podcast.</Text>
          </View>

          <View className="mt-6 overflow-hidden bg-slate-950 p-5 shadow-xl shadow-slate-400">
            <View className="flex-row items-center justify-between">
              <View className="bg-red-600 px-3 py-2"><Text className="text-[9px] font-black text-white">SEDANG DIPUTAR</Text></View>
              <Text className="text-xs font-bold text-slate-400">01 / 03</Text>
            </View>
            <Text className="mt-6 text-xl font-black leading-7 text-white">{queue[0].title}</Text>
            <Text className="mt-2 text-xs font-semibold text-slate-400">{queue[0].source} · {queue[0].duration}</Text>
            <View className="mt-6 h-1 overflow-hidden bg-slate-700"><View className="h-full w-1/3 bg-red-600" /></View>
            <View className="mt-5 flex-row items-center justify-center">
              <Pressable className="h-10 w-10 items-center justify-center"><Text className="text-xl text-white">↶</Text></Pressable>
              <Pressable onPress={() => setIsPlaying((value) => !value)} className="mx-6 h-16 w-16 items-center justify-center rounded-full bg-white">
                <Text className="text-2xl font-black text-slate-950">{isPlaying ? "Ⅱ" : "▶"}</Text>
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center"><Text className="text-xl text-white">↷</Text></Pressable>
            </View>
          </View>

          <View className="mb-3 mt-8 flex-row items-center justify-between">
            <Text className="text-lg font-black text-slate-950">Berikutnya</Text>
            <Text className="text-xs font-bold text-slate-500">3 berita · 13 menit</Text>
          </View>
          {queue.map((item) => (
            <View key={item.id} className="mb-3 flex-row items-center border border-slate-200 bg-white p-4">
              <Text className="mr-4 text-lg font-black text-red-600">{item.number}</Text>
              <View className="flex-1">
                <Text className="text-sm font-extrabold leading-5 text-slate-900">{item.title}</Text>
                <Text className="mt-1 text-[10px] font-semibold text-slate-400">{item.source} · {item.duration}</Text>
              </View>
              <Pressable className="ml-3 h-9 w-9 items-center justify-center border border-slate-200"><Text className="text-slate-700">▶</Text></Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav active="listen" />
    </SafeAreaView>
  );
}
