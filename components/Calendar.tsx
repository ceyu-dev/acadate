import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type CalendarProps = {
  month: number;
};

export default function Calendar(props: CalendarProps) {
  const currentDate = new Date();
  let baseDate = new Date(currentDate.getFullYear(), props.month + 1, 0);
  let monthName = baseDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
  let daysInMonth = baseDate.getDate();
  let startingDay = new Date(
    currentDate.getFullYear(),
    props.month,
    1
  ).getDay();
  console.log(startingDay);

  return (
    <View className="border overflow-hidden rounded-lg border-gray-600 border-solid">
      <View className="bg-accent p-4 items-center flex-row justify-evenly">
        <TouchableOpacity>
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
        <TouchableOpacity>
          <Ionicons
            name="chevron-forward"
            size={32}
            color={Colors.text}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <FlatList
        data={Array.from(
          { length: daysInMonth + startingDay },
          (_, i) => `${i + 1 - startingDay}`
        )}
        renderItem={({ item }) => (
          <View className="w-12" style={+item <= 0 ? { opacity: 0 } : {}}>
            <Text className="text-center p-3 text-lg">{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={7}
      />
    </View>
  );
}
