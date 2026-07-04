import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "feed" | "listen" | "bookmarks" | "profile";

const tabs = [
  { name: "feed" as const, label: "Beranda", icon: "⌂", route: "/feed" as const },
  { name: "listen" as const, label: "Dengarkan", icon: "◉", route: "/listen" as const },
  { name: "bookmarks" as const, label: "Tersimpan", icon: "▮", route: "/bookmarks" as const },
  { name: "profile" as const, label: "Profil", icon: "⚙", route: "/profile" as const },
];

export default function BottomNav({ active }: { active: TabName }) {
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  // 1. Ambil nilai area aman layar
  const insets = useSafeAreaInsets();

  const renderTab = (tab: (typeof tabs)[number]) => {
    const isActive = active === tab.name;
    return (
      <Pressable
        key={tab.name}
        onPress={() => router.replace(tab.route)}
        className="flex-1 items-center justify-center py-2"
      >
        <Text className={`${isActive ? "text-red-600" : "text-slate-400"} text-xl font-black`}>{tab.icon}</Text>
        <Text className={`${isActive ? "text-slate-950" : "text-slate-400"} mt-1 text-[9px] font-extrabold`}>{tab.label}</Text>
        {isActive && <View className="absolute bottom-0 h-0.5 w-7 bg-red-600" />}
      </Pressable>
    );
  };

  return (
    <View 
      // 2. Hapus pb-1 dari sini agar tidak bentrok dengan padding dinamis
      className="border-t border-slate-200 bg-white px-2 shadow-2xl shadow-slate-500"
      // 3. Terapkan padding dinamis di sini (insets.bottom)
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      <View className="mx-auto w-full max-w-xl flex-row items-end">
        {leftTabs.map(renderTab)}
        <View className="flex-1 items-center">
          <Pressable
            onPress={() => router.push("/ask")}
            className="-mt-7 h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-600 shadow-xl shadow-red-300 active:bg-red-700"
          >
            <Text className="text-2xl font-black text-white">✦</Text>
          </Pressable>
          {/* Tambahkan sedikit margin bawah (mb-1) agar teks sejajar dengan menu lain */}
          <Text className="mb-1 mt-1 text-[9px] font-black text-slate-950">Tanya AI</Text>
        </View>
        {rightTabs.map(renderTab)}
      </View>
    </View>
  );
}