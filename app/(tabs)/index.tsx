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
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabaseClient } from "@/lib/supabase";
import {
  ActivePeriods,
  getActiveBreaksThisMonth,
  getActiveTermsThisMonth,
  getCalendars,
  getSchoolDays,
  getWeek,
  UniversityCalendar,
} from "@/lib/calendar";
import { useIsFocused } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutRight,
  LinearTransition,
  SlideInLeft,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { transform } from "@babel/core";

export default function HomeScreen() {
  const today = new Date();
  const isFocused = useIsFocused();
  const [calendars, setCalendars] = useState<UniversityCalendar[] | null>([]);
  const [universitySchoolDays, setUniversitySchoolDays] = useState<
    UniversityCalendar[]
  >([]);
  const [activeTerms, setActiveTerms] = useState<ActivePeriods[]>([]);
  const [activeBreaks, setActiveBreaks] = useState<ActivePeriods[]>([]);
  const [name, setName] = useState<String>("");
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  useEffect(() => {
    getCalendars().then((calendars) => {
      setCalendars(calendars);
      resetPending();
    });
  }, []);
  useEffect(() => {
    getName().then((username) => setName(username));
    if (checkPending()) {
      getCalendars().then((calendars) => {
        setCalendars(calendars);
        resetPending();
      });
    }
  }, [isFocused]);
  useEffect(() => {
    console.log("Calendars changed");
    if (calendars) {
      setUniversitySchoolDays(getSchoolDays(today, calendars));
    }
  }, [calendars]);

  useEffect(() => {
    if (calendars) {
      setActiveTerms(getActiveTermsThisMonth(currentMonth, calendars));
      setActiveBreaks(getActiveBreaksThisMonth(currentMonth, calendars));
    }
  }, [currentMonth, calendars]);
  const week = useMemo(() => {
    return getWeek(today);
  }, [today]);

  return (
    <GestureHandlerRootView>
      <View className="flex-1  bg-appBackground">
        <Animated.View className=" bg-accent rounded-b-3xl w-full  pt-12 px-8 pb-4">
          <Animated.View className="flex-row items-center justify-between">
            <Image
              className="w-12 h-12"
              source={require("../../assets/images/logo.png")}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              className="text-text  text-3xl text-right w-1/2"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Hi, {name}!
            </Text>
          </Animated.View>
        </Animated.View>
        <ScrollView className="flex-1 w-full ">
          <View className="bg-appBackground   flex-1 w-full  mt-4 overflow-hidden">
            <Calendar
              onMonthChanged={(month: number) => {
                setCurrentMonth(month);
              }}
              month={currentMonth}
              calendars={calendars}
            ></Calendar>
          </View>
          <Animated.View layout={LinearTransition} className="px-12 pb-12">
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
            {universitySchoolDays.length != 0 ? (
              <Animated.View
                layout={LinearTransition}
                exiting={FadeOut}
                entering={FadeIn}
                className="ml-4 mt-4 border-text border p-2 rounded-lg"
              >
                <Text
                  className="text-text text-base border-b border-dashed border-text"
                  style={{ fontFamily: "Poppins" }}
                >
                  School day
                </Text>
                <View>
                  {universitySchoolDays.map((schoolDay) => (
                    <Animated.View
                      layout={LinearTransition}
                      exiting={FadeOutRight}
                      entering={FadeInRight}
                      key={schoolDay.university_id}
                      className="py-1 px-2 mt-2 rounded-md"
                      style={{
                        backgroundColor: schoolDay.university_color + "70",
                      }}
                    >
                      <Text
                        className="text-text"
                        style={{ fontFamily: "Poppins" }}
                      >
                        {schoolDay.university_name}
                      </Text>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            ) : (
              <></>
            )}
          </Animated.View>

          <Animated.View layout={LinearTransition} className="px-12 pb-12">
            <Text
              className="text-text text-lg"
              style={{ fontFamily: "PoppinsBold" }}
            >
              {new Date(
                today.getFullYear(),
                currentMonth,
                1
              ).toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
            </Text>

            {activeTerms.length != 0 ? (
              <Animated.View
                layout={LinearTransition}
                exiting={FadeOut}
                entering={FadeIn}
                className="ml-4 mt-4 border-text border p-2 rounded-lg"
              >
                <Text
                  className="text-text text-base border-b border-dashed border-text"
                  style={{ fontFamily: "Poppins" }}
                >
                  Terms
                </Text>
                <View>
                  {activeTerms.map((term) => {
                    if (term.periods.length != 0) {
                      return (
                        <Animated.View
                          layout={LinearTransition}
                          exiting={FadeOutRight}
                          entering={FadeInRight}
                          key={term.university_id}
                          className="py-1 px-2 mt-2 rounded-md"
                          style={{
                            backgroundColor: term.university_color + "70",
                          }}
                        >
                          {term.periods.map((term) => (
                            <View
                              key={term.id}
                              className="flex-row justify-between"
                            >
                              <Text
                                className="text-text"
                                style={{ fontFamily: "Poppins" }}
                              >
                                {term.name}
                              </Text>
                              <Text
                                className="text-text opacity-50"
                                style={{ fontFamily: "Poppins" }}
                              >
                                {new Date(term.start).toLocaleDateString(
                                  "default",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}{" "}
                                to{" "}
                                {new Date(term.end).toLocaleDateString(
                                  "default",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Text>
                            </View>
                          ))}
                        </Animated.View>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </View>
              </Animated.View>
            ) : (
              <></>
            )}
            {activeBreaks.length != 0 ? (
              <Animated.View
                layout={LinearTransition}
                exiting={FadeOut}
                entering={FadeIn}
                className="ml-4 mt-4 border-text border p-2 rounded-lg"
              >
                <Text
                  className="text-text text-base border-b border-dashed border-text"
                  style={{ fontFamily: "Poppins" }}
                >
                  Breaks
                </Text>
                <View>
                  {activeBreaks.map((period) => {
                    if (period.periods.length != 0) {
                      return (
                        <Animated.View
                          layout={LinearTransition}
                          exiting={FadeOutRight}
                          entering={FadeInRight}
                          key={period.university_id}
                          className="py-1 px-2 mt-2 rounded-md"
                          style={{
                            backgroundColor: period.university_color + "70",
                          }}
                        >
                          {period.periods.map((period) => (
                            <View
                              key={period.id}
                              className="flex-row justify-between"
                            >
                              <Text
                                className="text-text"
                                style={{ fontFamily: "Poppins" }}
                              >
                                {period.name}
                              </Text>
                              <Text
                                className="text-text opacity-50"
                                style={{ fontFamily: "Poppins" }}
                              >
                                {new Date(period.start).toLocaleDateString(
                                  "default",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}{" "}
                                to{" "}
                                {new Date(period.end).toLocaleDateString(
                                  "default",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Text>
                            </View>
                          ))}
                        </Animated.View>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </View>
              </Animated.View>
            ) : (
              <></>
            )}
          </Animated.View>
          <View className="h-32"></View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
