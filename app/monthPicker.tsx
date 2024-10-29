import { FlatList, Text, View } from "react-native";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthPickerModal() {
  return (
    <View
      className="flex-1 justify-end items-center"
      style={{ backgroundColor: "#00000070" }}
    >
      <View className="bg-appBackground rounded-t-3xl items-center pt-8  h-1/2 w-11/12">
        <Text className="text-text text-lg" style={{ fontFamily: "Poppins" }}>
          Select month
        </Text>
        <View className="">
          <FlatList
            className="h-24"
            data={months}
            renderItem={({ item }) => (
              <Text className="text-text text-lg">{item}</Text>
            )}
          ></FlatList>
        </View>
      </View>
    </View>
  );
}
