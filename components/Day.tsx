import { Colors } from "@/constants/Colors";
import { YearCalendar, UniversityCalendar } from "@/lib/calendar";
import React, { memo, useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  BounceInDown,
  BounceInUp,
  FadeIn,
  ReduceMotion,
  SlideInDown,
  SlideOutDown,
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
    function isSchoolDay(date: Date, calendars: YearCalendar[]) {
      date.setHours(8);
      for (let i = 0; i < calendars.length; i++) {
        const calendar = calendars[i];

        if (calendar.year_start > year || calendar.year_end < year) {
          continue;
        }

        for (let j = 0; j < calendar.terms.length; j++) {
          const termStart = new Date(calendar.terms[j].start);
          const termEnd = new Date(calendar.terms[j].end);

          if (date >= termStart && date <= termEnd) {
            let isBreak = false;

            for (let k = 0; k < calendar.breaks.length; k++) {
              const breakStart = new Date(calendar.breaks[k].start);
              const breakEnd = new Date(calendar.breaks[k].end);

              if (breakStart <= termEnd && breakEnd >= termStart) {
                if (date >= breakStart && date <= breakEnd) {
                  isBreak = true;
                  break;
                }
              }
            }

            if (!isBreak) return true;
          }
        }
      }
      return false;
    }

    const pressed = useSharedValue<boolean>(false);
    const tapGesture = Gesture.Tap().onFinalize(() => {
      //pressed.value = true;
    });
    const animatedStyle = useAnimatedStyle(() => ({
      backgroundColor: pressed.value
        ? withTiming(Colors.accent)
        : "transparent",
    }));

    const markTransition = SlideInDown.duration(300)
      .dampingRatio(0.1)
      .randomDelay()
      .build();

    return (
      <GestureDetector gesture={tapGesture}>
        <Animated.View
          className="py-1 rounded-lg mx-1 my-1"
          style={[
            item <= 0 || item > daysInMonth ? { opacity: 0.2 } : {},
            { flex: 7 },
            animatedStyle,
          ]}
        >
          <Text
            style={{ fontFamily: "Poppins" }}
            className="text-center mx-1 py-1 text-text text-lg"
          >
            {item <= 0
              ? item + daysInPrevMonth
              : item > daysInMonth
              ? item - daysInMonth
              : item}
          </Text>
          <Animated.View
            entering={markTransition}
            className="absolute items-center bottom-1 w-full justify-center flex-row"
          >
            {calendars?.map((calendar) => {
              if (
                isSchoolDay(
                  new Date(year, month % 12, item),
                  calendar.calendars
                )
              ) {
                return (
                  <View
                    key={`${item}-${calendar.university_name}`}
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: calendar.university_color }}
                  ></View>
                );
              }
            })}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default Day;
