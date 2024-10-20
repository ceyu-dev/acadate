import { Colors } from "@/constants/Colors";
import { name } from "@/lib/user";
import {
  getCalendarColor,
  getCalendars,
  getDatesInRange,
  formatDate,
  isDateInRange,
} from "@/lib/calendar";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import Calendar from "@/components/Calendar";

export default function Index() {
  return (
    <View className="flex-1 justify-start items-start  bg-accent">
      <ImageBackground
        source={require("../assets/images/home.png")}
        className="flex-1 w-full pt-20"
        resizeMode="cover"
      >
        <Text
          className="text-text ml-8 mb-4 text-2xl"
          style={{ fontFamily: "EBGaramondBold" }}
        >
          Acadate
        </Text>
        <Text
          className="text-text text-4xl  ml-8"
          style={{ fontFamily: "PoppinsBold" }}
        >
          Hi, {name}!
        </Text>
        <View className="bg-gray-50 flex-1 w-full rounded-t-3xl mt-8 p-6">
          <Calendar month={0}></Calendar>
        </View>
      </ImageBackground>
    </View>
  );
}
