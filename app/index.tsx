import { getName } from "@/lib/user";
import { Redirect, router, SplashScreen, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, AppState, Image, Text, View } from "react-native";
import HomeScreen from "./(tabs)";
import { supabaseClient } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Index() {
  getName();

  const randomQuotes = [
    "Seize the day, month, or year!",
    "Let's get you where you need to be",
    "Planning something?",
    "What are your plans?",
    "Carpe them diems",
    "Make today count!",
    "Every day is a new chance to succeed.",
  ];

  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * randomQuotes.length);
    return randomQuotes[randomIndex];
  }

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabaseClient.auth.startAutoRefresh();
    } else {
      supabaseClient.auth.stopAutoRefresh();
    }
  });

  const { data } = supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log(event, session);

    if (event === "INITIAL_SESSION") {
      if (session) {
        router.replace("/(tabs)/");
      } else {
        router.replace("/getStarted");
      }
    } else if (event === "SIGNED_IN") {
    } else if (event === "SIGNED_OUT") {
      console.log("Signed out");
      router.replace("/getStarted");
    } else if (event === "PASSWORD_RECOVERY") {
      // handle password recovery event
    } else if (event === "TOKEN_REFRESHED") {
      // handle token refreshed event
    } else if (event === "USER_UPDATED") {
    }
  });
  setTimeout(() => {
    SplashScreen.hideAsync();
  }, 2000);
  return (
    <GestureHandlerRootView>
      <View className="bg-accent flex-1 justify-center items-center">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-24 h-24"
        />
        <Text
          className="px-12 text-center text-text mt-8 text-lg"
          style={{ fontFamily: "PoppinsBold" }}
        >
          {getRandomQuote()}
        </Text>
        <ActivityIndicator
          color={Colors.text}
          className="mt-12"
          size={48}
        ></ActivityIndicator>
      </View>
    </GestureHandlerRootView>
  );
}
