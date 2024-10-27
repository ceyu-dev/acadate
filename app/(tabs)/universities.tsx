import { Colors } from "@/constants/Colors";
import { getAllUniversities, getUniversitySearchResults } from "@/lib/calendar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import Animated, {
  FadeOut,
  FadingTransition,
  Layout,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
  SlideOutUp,
  useSharedValue,
} from "react-native-reanimated";
import {
  Button,
  FlatList,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import UniversityItem from "@/components/UniversityItem";

export default function UniversitiesScreen() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: any; logo: any; color: any; id: any }[] | null
  >(null);

  const viewableItems = useSharedValue<ViewToken[]>([]);

  useEffect(() => {
    loadAllUniversities();
  }, []);

  function loadAllUniversities() {
    getAllUniversities().then((universities) => {
      setSearchResults(universities);
    });
  }
  function submitSearch() {
    if (!searchString) {
      return;
    }

    getUniversitySearchResults(searchString).then((result) => {
      setSearchResults([]);
      setSearchResults(result);
    });
  }

  return (
    <View className="bg-appBackground flex-1">
      <View className="bg-accent rounded-b-3xl pt-20 px-8 pb-2">
        <Text
          className="text-text text-3xl"
          style={{ fontFamily: "PoppinsBold" }}
        >
          Universities
        </Text>
        <Text className="text-text" style={{ fontFamily: "Poppins" }}>
          Add your university calendar
        </Text>
        <View className="flex-row mt-8">
          <TextInput
            returnKeyType="search"
            onSubmitEditing={submitSearch}
            value={searchString}
            onChangeText={setSearchString}
            placeholderTextColor={Colors.text + 70}
            placeholder="Durmstrang Institute"
            selectionColor={Colors.text}
            className="flex-1 border border-text  rounded-lg text-lg p-2 text-text"
            style={{ fontFamily: "Poppins" }}
          ></TextInput>
          <TouchableOpacity
            onPress={submitSearch}
            className="text-text ml-2 px-2 justify-center items-center rounded-lg bg-text"
          >
            <Ionicons name="search" size={24}></Ionicons>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-4">
          <TouchableOpacity
            onPress={loadAllUniversities}
            className="bg-text p-2 rounded-lg"
          >
            <Text style={{ fontFamily: "PoppinsBold" }}>Show all</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className=" flex-1">
        <Animated.FlatList
          data={searchResults}
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item) => item.id}
          ListFooterComponent={() => <View className="h-24"></View>}
          ListEmptyComponent={() => (
            <View className="flex-1 p-8 justify-center items-center">
              <Text className="text-text" style={{ fontFamily: "PoppinsBold" }}>
                Nothing to see here...
              </Text>
            </View>
          )}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems;
          }}
          renderItem={({ item }) => (
            <Animated.View>
              <UniversityItem
                item={item}
                viewableItems={viewableItems}
              ></UniversityItem>
            </Animated.View>
          )}
        ></Animated.FlatList>
      </View>
    </View>
  );
}
