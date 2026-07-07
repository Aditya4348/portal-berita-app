import { useEffect } from 'react';
import { Platform } from 'react-native';
import "./global.css";
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from "expo-router";

export default function RootLayout() {
  useEffect(() => {
    // PROTEKSI: Cek apakah library ini ada dan berjalan di Android
    if (Platform.OS === 'android' && NavigationBar && typeof NavigationBar.setBackgroundColorAsync === 'function') {
      NavigationBar.setBackgroundColorAsync("#ffffff");
      NavigationBar.setButtonStyleAsync("dark");
    } else {
      console.warn("Navigation Bar module is not available.");
    }
  }, []);

  return <Slot />;
}