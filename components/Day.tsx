import { Colors } from "@/constants/Colors";
import { YearCalendar, UniversityCalendar, isSchoolDay } from "@/lib/calendar";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DayProps {
  item: number;
  month: number;
  year: number;
  daysInMonth: number;
  daysInPrevMonth: number;
  calendars: UniversityCalendar[] | null;
}

const Day: React.FC<DayProps> = React.memo(
  ({ item, daysInMonth, daysInPrevMonth, calendars, year, month }) => {
    const pressed = useSharedValue<boolean>(false);

    // Memoize the display number calculation
    const displayNumber = useMemo(() => {
      if (item <= 0) return item + daysInPrevMonth;
      if (item > daysInMonth) return item - daysInMonth;
      return item;
    }, [item, daysInMonth, daysInPrevMonth]);

    // Memoize date object and school day calculations
    const schoolDayMarkers = useMemo(() => {
      if (!calendars || item <= 0 || item > daysInMonth) return [];

      const date = new Date(year, month % 12, item);
      date.setHours(8);

      return calendars.reduce<Array<{ color: string; key: string }>>(
        (markers, calendar) => {
          if (isSchoolDay(date, calendar.calendars)) {
            markers.push({
              color: calendar.university_color,
              key: `${item}-${calendar.university_name}`,
            });
          }
          return markers;
        },
        []
      );
    }, [calendars, item, year, month, daysInMonth]);

    // Memoize styles
    const baseStyle = useMemo(
      () => ({
        opacity: item <= 0 || item > daysInMonth ? 0.2 : 1,
        flex: 7,
      }),
      [item, daysInMonth]
    );

    const animatedStyle = useAnimatedStyle(() => ({
      backgroundColor: pressed.value
        ? withTiming(Colors.accent)
        : "transparent",
    }));

    const markTransition = useMemo(
      () => SlideInDown.duration(300).dampingRatio(0.1).randomDelay().build(),
      []
    );

    return (
      <Animated.View
        className="py-1 rounded-lg mx-1 my-1"
        style={[baseStyle, animatedStyle]}
      >
        <Text
          style={{ fontFamily: "Poppins" }}
          className="text-center mx-1 py-1 text-text text-lg"
        >
          {displayNumber}
        </Text>
        {schoolDayMarkers.length > 0 && (
          <Animated.View
            entering={markTransition}
            className="absolute items-center bottom-1 w-full justify-center flex-row"
          >
            {schoolDayMarkers.map(({ color, key }) => (
              <View
                key={key}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </Animated.View>
        )}
      </Animated.View>
    );
  }
);

export default Day;
