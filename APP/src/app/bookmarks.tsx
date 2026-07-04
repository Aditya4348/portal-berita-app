import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";

const saved = [
  { id: "1", category: "KECERDASAN BUATAN", title: "Robot humanoid mulai keluar dari laboratorium", note: "Disimpan bersama 2 jawaban Agen AI", mark: "AI", color: "bg-blue-950" },
  { id: "2", category: "IKLIM & ENERGI", title: "Terobosan baterai yang mengubah jaringan listrik", note: "Disimpan kemarin · 6 menit baca", mark: "EN", color: "bg-emerald-800" },
];

export default function BookmarksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        <View className="mx-auto w-full max-w-xl px-5 pt-6">
          <View className="border-b-2 border-slate-950 pb-4">
            <Text className="text-[10px] font-black uppercase tracking-[3px] text-red-600">Koleksi personal</Text>
            <Text className="mt-2 text-3xl font-black text-slate-950">Berita Tersimpan</Text>
            <Text className="mt-2 text-sm text-slate-500">Artikel dan percakapan penting untuk dibaca kembali.</Text>
          </View>
          <View className="mt-6 flex-row items-center border-l-4 border-red-600 bg-white p-4">
            <Text className="text-2xl font-black text-slate-950">02</Text>
            <Text className="ml-3 flex-1 text-xs leading-5 text-slate-500">artikel tersimpan dalam koleksi Anda</Text>
            <Text className="text-xs font-bold text-red-600">Kelola</Text>
          </View>
          {saved.map((item) => (
            <Pressable key={item.id} onPress={() => router.push({ pathname: "/article/[id]", params: { id: item.id } })} className="mt-4 flex-row overflow-hidden border border-slate-200 bg-white shadow-md shadow-slate-200">
              <View className={`w-24 items-center justify-center ${item.color}`}><Text className="text-2xl font-black text-white">{item.mark}</Text></View>
              <View className="flex-1 p-4">
                <Text className="text-[9px] font-black tracking-widest text-red-600">{item.category}</Text>
                <Text className="mt-2 text-base font-black leading-6 text-slate-950">{item.title}</Text>
                <Text className="mt-3 text-[10px] font-semibold text-slate-400">{item.note}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <BottomNav active="bookmarks" />
    </SafeAreaView>
  );
}
