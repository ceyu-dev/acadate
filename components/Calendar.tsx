import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type CalendarProps = {
  month: number;
};

export default function Calendar(props: CalendarProps) {
  const currentDate = new Date();
  let monthName = new Date(
    currentDate.getFullYear(),
    props.month,
    currentDate.getDate()
  ).toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
  let daysInMonth = new Date(
    currentDate.getFullYear(),
    props.month,
    0
  ).getDate();

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
        data={Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={7}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
}
