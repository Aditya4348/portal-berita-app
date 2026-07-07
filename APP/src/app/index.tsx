import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { height, width } = useWindowDimensions();
  const isCompact = height < 720 || width < 360;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="absolute right-0 top-0 h-1 w-full bg-red-600" />
        <View className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-900/30" />

        <ScrollView
          bounces={false}
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View className={`mx-auto w-full max-w-lg flex-1 px-5 ${isCompact ? "pb-5 pt-6" : "pb-8 pt-12"}`}>
          <View>
            <View className={`${isCompact ? "mb-5" : "mb-10"} flex-row items-center`}>
              <View className="h-12 w-12 items-center justify-center bg-red-600">
                <Text className="text-xl font-black text-white">NW</Text>
              </View>
              <View className="ml-3">
                <Text className="text-xl font-black tracking-tight text-white">NUSA WARTA</Text>
                <Text className="text-[9px] font-bold uppercase tracking-[3px] text-slate-400">Portal Berita AI</Text>
              </View>
            </View>
            <Text className="text-xs font-bold uppercase tracking-[3px] text-red-400">
              Informasi tepercaya, setiap saat
            </Text>
            <Text className={`${isCompact ? "mt-2 text-4xl leading-[42px]" : "mt-3 text-5xl leading-[54px]"} font-black tracking-tight text-white`}>
              Berita penting.
              {"\n"}Perspektif jernih.
            </Text>
            <Text className={`${isCompact ? "mt-2 text-sm leading-5" : "mt-4 text-base leading-6"} max-w-sm text-slate-400`}>
              Dapatkan rangkuman berita terverifikasi yang dikurasi khusus berdasarkan minatmu.
            </Text>
          </View>

          <View className={`${isCompact ? "mt-6 p-4" : "mt-10 p-6"} border border-slate-700 bg-slate-900 shadow-2xl shadow-black`}>
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Masuk ke akun Anda</Text>
              <View className="bg-emerald-500/15 px-3 py-1.5"><Text className="text-[10px] font-bold text-emerald-400">AMAN</Text></View>
            </View>
            <View className="mb-3 border border-slate-700 bg-slate-950/80 px-4 py-2">
              <Text className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Alamat email
              </Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="nama@contoh.com"
                placeholderTextColor="#64748b"
                value={email}
                className="mt-1 h-auto text-base text-white"
              />
            </View>
            <View className="mb-5 border border-slate-700 bg-slate-950/80 px-4 py-2">
              <Text className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Kata sandi
              </Text>
              <TextInput
                onChangeText={setPassword}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={password}
                className="mt-1 h-auto text-base text-white"
              />
            </View>
            <Pressable
              onPress={() => router.replace("/feed")}
              className="h-14 flex-row items-center justify-center bg-red-600 active:bg-red-700"
            >
              <Text className="text-base font-extrabold text-white">Masuk ke ruang berita</Text>
              <Text className="ml-3 text-xl text-white">→</Text>
            </Pressable>
            <Text className="mt-4 text-center text-[10px] leading-4 text-slate-500">Dengan masuk, Anda menyetujui ketentuan layanan dan kebijakan privasi Nusa Warta.</Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
