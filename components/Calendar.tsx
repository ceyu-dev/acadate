import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Day from "./Day";
import { getDaysPerMonth, UniversityCalendar } from "@/lib/calendar";
import StaticDay from "./StaticDay";
import { router } from "expo-router";

const DAYS_OF_THE_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

type CalendarProps = {
  month: number;
  onMonthChanged: Function;
  calendars: UniversityCalendar[] | null;
};

// Memoized header component
const CalendarHeader = React.memo(
  ({
    monthName,
    onPrevMonth,
    onNextMonth,
  }: {
    monthName: string;
    onPrevMonth: () => void;
    onNextMonth: () => void;
  }) => (
    <View className="px-4 py-2 items-center flex-row justify-between">
      <TouchableOpacity className="p-2" onPress={onPrevMonth}>
        <Ionicons name="chevron-back" size={32} color={Colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/monthPicker");
        }}
      >
        <Text
          className="text-text text-xl"
          style={{ fontFamily: "PoppinsBold" }}
        >
          {monthName}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="p-2" onPress={onNextMonth}>
        <Ionicons name="chevron-forward" size={32} color={Colors.text} />
      </TouchableOpacity>
    </View>
  )
);

// Memoized weekday header component
const WeekdayHeader = React.memo(() => (
  <View className="flex-row">
    {DAYS_OF_THE_WEEK.map((value) => (
      <Text
        key={value}
        className={`${
          value === "Sun" || value === "Sat" ? "text-rose-400" : "text-text"
        }`}
        style={{
          fontFamily: "Poppins",
          flex: 7,
          textAlign: "center",
        }}
      >
        {value}
      </Text>
    ))}
  </View>
));

// Memoized day component
const MemoizedDay = React.memo(Day);

const Calendar: React.FC<CalendarProps> = ({
  month,
  calendars,
  onMonthChanged,
}) => {
  const nextMonth = useCallback(() => {
    onMonthChanged((prev: number) => prev + 1);
  }, []);

  const previousMonth = useCallback(() => {
    onMonthChanged((prev: number) => prev - 1);
  }, []);

  // Memoize date calculations
  const { baseDate, monthName, daysInMonth, daysInPrevMonth, days } =
    useMemo(() => {
      const currentDate = new Date();
      const baseDate = new Date(currentDate.getFullYear(), month + 1, 0);
      const monthName = baseDate.toLocaleDateString("default", {
        month: "long",
        year: "numeric",
      });
      const daysInMonth = baseDate.getDate();
      const daysInPrevMonth = new Date(
        baseDate.getFullYear(),
        month,
        0
      ).getDate();

      const startingDay = new Date(baseDate.getFullYear(), month, 1).getDay();
      const trailingDays = (7 - ((daysInMonth + startingDay) % 7)) % 7;
      const days = getDaysPerMonth(daysInMonth, startingDay, trailingDays);

      return {
        baseDate,
        monthName,
        daysInMonth,
        daysInPrevMonth,
        days,
      };
    }, [month]);

  // Memoize renderItem function
  const renderDay = useCallback(
    ({ item }: { item: number }) => (
      <MemoizedDay
        year={baseDate.getFullYear()}
        month={baseDate.getMonth()}
        calendars={calendars}
        item={item}
        daysInMonth={daysInMonth}
        daysInPrevMonth={daysInPrevMonth}
      />
    ),
    [baseDate, calendars, daysInMonth, daysInPrevMonth]
  );

  // Pan gesture handling
  const calendarOffset = useSharedValue<number>(0);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((event) => {
          calendarOffset.value = event.translationX;
        })
        .onFinalize((event) => {
          if (event.velocityX < -500) {
            runOnJS(nextMonth)();
          } else if (event.velocityX > 500) {
            runOnJS(previousMonth)();
          }
          calendarOffset.value = withSpring(0);
        })
        .activeOffsetX([-10, 10]),
    [nextMonth, previousMonth]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: calendarOffset.value }],
  }));

  return (
    <View className="overflow-hidden">
      <CalendarHeader
        monthName={monthName}
        onPrevMonth={previousMonth}
        onNextMonth={nextMonth}
      />
      <View className="px-6 py-6">
        <WeekdayHeader />
        <GestureDetector gesture={panGesture}>
          <Animated.View className="flex-row" style={animatedStyle}>
            <FlatList
              scrollEnabled={false}
              data={days}
              renderItem={renderDay}
              numColumns={7}
              keyExtractor={(_, index) => index.toString()}
              removeClippedSubviews={true}
              initialNumToRender={35}
              maxToRenderPerBatch={35}
              windowSize={2}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

export default React.memo(Calendar);
