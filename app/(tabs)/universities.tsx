import { Colors } from "@/constants/Colors";
import { getAllUniversities, getUniversitySearchResults } from "@/lib/calendar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  LinearTransition,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import UniversityItem from "@/components/UniversityItem";

interface University {
  name: string;
  logo: string;
  color: string;
  id: number;
}

export default function UniversitiesScreen() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<University[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const loadAllUniversities = useCallback(async () => {
    setIsLoading(true);
    try {
      const universities = await getAllUniversities();
      setSearchResults(universities);
    } catch (error) {
      console.error("Failed to load universities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllUniversities();
  }, [loadAllUniversities]);

  const submitSearch = useCallback(async () => {
    if (!searchString.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      const results = await getUniversitySearchResults(searchString);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchString]);

  const renderHeader = () => (
    <View className="bg-accent rounded-b-3xl pt-12 px-8 pb-2">
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
          placeholderTextColor={`${Colors.text}70`}
          placeholder="Durmstrang Institute"
          selectionColor={Colors.text}
          className="flex-1 border border-text rounded-lg text-lg p-2 text-text"
          style={{ fontFamily: "Poppins" }}
        />
        <TouchableOpacity
          onPress={submitSearch}
          className="text-text ml-2 px-2 justify-center items-center rounded-lg bg-text"
        >
          <Ionicons name="search" size={24} />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center mt-4">
        <TouchableOpacity
          onPress={loadAllUniversities}
          className="bg-text p-2 rounded-lg"
        >
          <Text className="text-base" style={{ fontFamily: "Poppins" }}>
            Show all
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <Animated.View
      className="flex-1 p-8 justify-center items-center"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Text className="text-text" style={{ fontFamily: "PoppinsBold" }}>
        {isLoading ? "Loading..." : "Nothing to see here..."}
      </Text>
    </Animated.View>
  );

  const renderItem = useCallback(
    ({ item }: { item: University }) => (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        layout={LinearTransition.springify(200)}
      >
        <UniversityItem item={item} viewableItems={viewableItems} />
      </Animated.View>
    ),
    [viewableItems]
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
    [viewableItems]
  );

  return (
    <View className="bg-appBackground flex-1">
      {renderHeader()}
      <View className="flex-1">
        <Animated.FlatList
          data={searchResults}
          itemLayoutAnimation={Layout.springify().damping(15)}
          keyExtractor={(item) => item.id.toLocaleString()}
          ListFooterComponent={() => <View className="h-24" />}
          ListEmptyComponent={renderEmpty}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={renderItem}
          contentContainerStyle={
            !searchResults?.length ? { flex: 1 } : undefined
          }
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>
    </View>
  );
}
