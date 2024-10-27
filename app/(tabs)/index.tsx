import { Colors } from "@/constants/Colors";
import { checkPending, getName, resetPending } from "@/lib/user";

import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Calendar from "@/components/Calendar";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabaseClient } from "@/lib/supabase";
import { getCalendars, UniversityCalendar } from "@/lib/calendar";
import { useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const [calendars, setCalendars] = useState<UniversityCalendar[] | null>([]);

  useEffect(() => {
    getCalendars().then((calendars) => {
      setCalendars(calendars);
      resetPending();
    });
  }, []);
  useEffect(() => {
    if (checkPending()) {
      getCalendars().then((calendars) => {
        setCalendars(calendars);
        resetPending();
      });
    }
  }, [isFocused]);
  useEffect(() => {
    console.log("Calendars changed");
  }, [calendars]);

  const today = new Date();
  const [name, setName] = useState<String>("");
  getName().then((username) => setName(username));

  return (
    <GestureHandlerRootView>
      <View className="flex-1  bg-appBackground">
        <View className=" bg-accent rounded-b-3xl pt-20 px-8 pb-4">
          <View className="flex-row items-center justify-between">
            <Image
              className="w-12 h-12"
              source={require("../../assets/images/logo.png")}
            />
            <Text
              className="text-text text-3xl"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Hi, {name}!
            </Text>
          </View>
        </View>
        <ScrollView className="flex-1 w-full  ">
          <View className="bg-appBackground   flex-1 w-full  mt-8 overflow-hidden">
            <Calendar month={9} calendars={calendars}></Calendar>
          </View>
          <View className="px-12">
            <Text
              className="text-text text-lg"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Today
            </Text>
            <Text className="text-text" style={{ fontFamily: "Poppins" }}>
              {today.toLocaleDateString("default", {
                weekday: "long",

                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
