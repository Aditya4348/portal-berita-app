import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const suggestions = [
  "Terobosan AI yang mengubah layanan kesehatan",
  "Masa depan energi bersih",
  "Hal yang menggerakkan pasar global",
];

export default function AskScreen() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { height, width } = useWindowDimensions();
  const isCompact = height < 740 || width < 360;

  const generateFeed = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => router.replace("/feed"), 1100);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          bounces={false}
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View className={`mx-auto w-full max-w-xl flex-1 px-5 ${isCompact ? "pb-5 pt-4" : "pb-8 pt-6"}`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center bg-red-600"><Text className="text-sm font-black text-white">NW</Text></View>
              <View className="ml-3">
                <Text className="text-base font-black text-slate-950">NUSA WARTA</Text>
                <Text className="text-[8px] font-bold tracking-[2px] text-slate-500">PORTAL BERITA AI</Text>
              </View>
            </View>
            <Pressable onPress={() => router.back()} className="border border-slate-300 bg-white px-4 py-2 shadow-sm shadow-slate-200">
              <Text className="text-xs font-bold text-slate-700">Tutup</Text>
            </Pressable>
          </View>

          <View className={isCompact ? "mt-7" : "mt-14"}>
            <Text className="text-xs font-extrabold uppercase tracking-[3px] text-red-600">
              Desk personalisasi
            </Text>
            <Text className={`${isCompact ? "mt-3 text-3xl leading-9" : "mt-4 text-4xl leading-[46px]"} font-black tracking-tight text-slate-950`}>
              Topik apa yang ingin Anda ikuti hari ini?
            </Text>
            <Text className="mt-3 text-base leading-6 text-slate-500">
              Tim redaksi AI kami akan menyusun laporan ringkas dari berbagai sudut pandang tepercaya.
            </Text>
          </View>

          <View className={`${isCompact ? "mt-5 p-4" : "mt-8 p-5"} border-l-4 border-l-red-600 border-y border-r border-slate-200 bg-white shadow-xl shadow-slate-300`}>
            <TextInput
              editable={!isLoading}
              multiline
              onChangeText={setTopic}
              placeholder="Contoh: Terobosan terbaru robot humanoid dan dampaknya bagi kehidupan sehari-hari..."
              placeholderTextColor="#94a3b8"
              textAlignVertical="top"
              value={topic}
              className={`${isCompact ? "h-24 text-base leading-6" : "h-36 text-lg leading-7"} font-medium text-slate-900`}
            />
            <View className="flex-row items-center justify-between border-t border-slate-100 pt-4">
              <Text className="text-xs font-semibold text-slate-400">Kurasi berbasis AI</Text>
              <Text className="text-xs font-bold text-red-600">● Siap dikurasi</Text>
            </View>
          </View>

          <View className={isCompact ? "mt-4" : "mt-6"}>
            <Text className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Coba pilihan editor
            </Text>
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion}
                onPress={() => setTopic(suggestion)}
                className="mb-2 flex-row items-center border border-slate-200 bg-white px-4 py-3 active:bg-slate-50"
              >
                <View className="mr-3 h-8 w-8 items-center justify-center bg-slate-950">
                  <Text className="text-xs font-black text-white">0{index + 1}</Text>
                </View>
                <Text className="flex-1 text-sm font-bold text-slate-700">{suggestion}</Text>
                <Text className="text-slate-400">↗</Text>
              </Pressable>
            ))}
          </View>

          <View className={isCompact ? "h-4" : "flex-1 min-h-6"} />
          <Pressable
            disabled={isLoading}
            onPress={generateFeed}
            className="h-16 flex-row items-center justify-center bg-red-600 shadow-xl shadow-slate-400 active:bg-red-700"
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#ffffff" />
                <Text className="ml-3 text-base font-extrabold text-white">Menyiapkan beritamu...</Text>
              </>
            ) : (
              <>
                <Text className="text-base font-extrabold text-white">Buat berita pilihan saya</Text>
                <Text className="ml-3 text-xl text-white">→</Text>
              </>
            )}
          </Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
