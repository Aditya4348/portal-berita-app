import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";

export default function ProfileScreen() {
  const [voice, setVoice] = useState<"pria" | "wanita">("wanita");

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        <View className="mx-auto w-full max-w-xl px-5 pt-6">
          <View className="border-b-2 border-slate-950 pb-4">
            <Text className="text-[10px] font-black uppercase tracking-[3px] text-red-600">Akun & preferensi</Text>
            <Text className="mt-2 text-3xl font-black text-slate-950">Profil Anda</Text>
          </View>
          <View className="mt-6 flex-row items-center bg-slate-950 p-5">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-red-600"><Text className="text-xl font-black text-white">AW</Text></View>
            <View className="ml-4 flex-1"><Text className="text-lg font-black text-white">Aditya W.</Text><Text className="mt-1 text-xs text-slate-400">Pembaca Premium · Sejak 2026</Text></View>
            <Text className="text-slate-400">›</Text>
          </View>
          <Text className="mb-3 mt-8 text-xs font-black uppercase tracking-[2px] text-slate-500">Suara pembaca berita</Text>
          <View className="flex-row bg-white p-1">
            {(["pria", "wanita"] as const).map((option) => (
              <Pressable key={option} onPress={() => setVoice(option)} className={`${voice === option ? "bg-slate-950" : "bg-white"} flex-1 items-center py-4`}>
                <Text className={`${voice === option ? "text-white" : "text-slate-500"} text-sm font-extrabold capitalize`}>Suara {option}</Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-3 mt-8 text-xs font-black uppercase tracking-[2px] text-slate-500">Topik yang sering dibaca</Text>
          <View className="border border-slate-200 bg-white">
            {["Kecerdasan Buatan", "Teknologi Infrastruktur", "Ekonomi Global"].map((topic, index) => (
              <View key={topic} className={`${index < 2 ? "border-b border-slate-100" : ""} flex-row items-center px-4 py-4`}>
                <Text className="mr-4 text-xs font-black text-red-600">0{index + 1}</Text><Text className="flex-1 text-sm font-bold text-slate-800">{topic}</Text><Text className="text-xs text-slate-400">›</Text>
              </View>
            ))}
          </View>
          <Text className="mb-3 mt-8 text-xs font-black uppercase tracking-[2px] text-slate-500">Pengaturan</Text>
          <View className="border border-slate-200 bg-white">
            {["Notifikasi berita penting", "Unduhan audio", "Privasi dan keamanan"].map((setting) => (
              <Pressable key={setting} className="flex-row items-center border-b border-slate-100 px-4 py-4"><Text className="flex-1 text-sm font-bold text-slate-800">{setting}</Text><Text className="text-slate-400">›</Text></Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav active="profile" />
    </SafeAreaView>
  );
}
