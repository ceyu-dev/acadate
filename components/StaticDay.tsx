import { YearCalendar, UniversityCalendar } from "@/lib/calendar";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface DayProps {
  item: number;
  daysInMonth: number;
  daysInPrevMonth: number;
}

const StaticDay: React.FC<DayProps> = React.memo(
  ({ item, daysInMonth, daysInPrevMonth }) => {
    // Memoize the display number calculation
    const displayNumber = useMemo(() => {
      if (item <= 0) return item + daysInPrevMonth;
      if (item > daysInMonth) return item - daysInMonth;
      return item;
    }, [item, daysInMonth, daysInPrevMonth]);

    // Memoize styles
    const baseStyle = useMemo(
      () => ({
        flex: 7,
      }),
      [item, daysInMonth]
    );

    return (
      <View className="py-1 rounded-lg mx-1 my-1" style={[baseStyle]}>
        <Text
          style={{ fontFamily: "Poppins" }}
          className="text-center mx-1 py-1 text-text text-lg"
        >
          {displayNumber}
        </Text>
      </View>
    );
  }
);

export default StaticDay;
