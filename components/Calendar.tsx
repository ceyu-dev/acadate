import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadingTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Day from "./Day";
import {
  getDaysPerMonth,
  UniversityCalendar,
  ZellerCongruence,
} from "@/lib/calendar";

type CalendarProps = {
  month: number;
  calendars: UniversityCalendar[] | null;
};

const Calendar: React.FC<CalendarProps> = ({ month, calendars }) => {
  function nextMonth() {
    setMonth((prevMonth) => ++prevMonth);
  }
  function previousMonth() {
    setMonth((prevMonth) => --prevMonth);
  }

  const renderDay = ({ item }: { item: number }) => (
    <Day
      year={baseDate.getFullYear()}
      month={baseDate.getMonth()}
      calendars={calendars}
      item={item}
      daysInMonth={daysInMonth}
      daysInPrevMonth={daysInPrevMonth}
    ></Day>
  );

  const [currentMonth, setMonth] = useState(month);

  const daysOfTheWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const currentDate = useMemo(() => {
    return new Date();
  }, []);
  let baseDate = new Date(currentDate.getFullYear(), currentMonth + 1, 0);
  let monthName = baseDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
  let daysInMonth = baseDate.getDate();
  let daysInPrevMonth = new Date(
    baseDate.getFullYear(),
    currentMonth,
    0
  ).getDate();

  const startingDay = useMemo(() => {
    return new Date(baseDate.getFullYear(), currentMonth, 1).getDay();
  }, [currentMonth]);
  const trailingDays = useMemo(() => {
    return (7 - ((daysInMonth + startingDay) % 7)) % 7;
  }, [currentMonth]);
  const days = useMemo(() => {
    return getDaysPerMonth(daysInMonth, startingDay, trailingDays);
  }, [currentMonth]);

  const calendarOffset = useSharedValue<number>(0);
  const panGesture = Gesture.Pan()

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
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: calendarOffset.value }],
  }));

  return (
    <View className=" overflow-hidden ">
      <View className=" px-4 py-2 items-center flex-row justify-between">
        <TouchableOpacity className="p-2" onPress={previousMonth}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={Colors.text}
          ></Ionicons>
        </TouchableOpacity>
        <Text
          className="text-text text-xl"
          style={{ fontFamily: "PoppinsBold" }}
        >
          {monthName}
        </Text>
        <TouchableOpacity className="p-2" onPress={nextMonth}>
          <Ionicons
            name="chevron-forward"
            size={32}
            color={Colors.text}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <View className="px-6 py-6">
        <View className="flex-row">
          {daysOfTheWeek.map((value) => {
            return (
              <Text
                className={`${
                  value == "Sun" || value == "Sat"
                    ? "text-rose-400"
                    : "text-text"
                }`}
                style={{
                  fontFamily: "Poppins",
                  flex: 7,
                  textAlign: "center",
                }}
                key={value}
              >
                {value}
              </Text>
            );
          })}
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.FlatList
            style={animatedStyle}
            scrollEnabled={false}
            data={days}
            renderItem={renderDay}
            numColumns={7}
            keyExtractor={(item, index) => `${index}`}
          />
        </GestureDetector>
      </View>
    </View>
  );
};

export default Calendar;
