import DraggableUniversityItem from "@/components/DraggableUniversityItem";
import { getAddedUniversities, removeUniversity } from "@/lib/user";
import { useIsFocused } from "@react-navigation/native";
import {
  applicationId,
  applicationName,
  nativeApplicationVersion,
  nativeBuildVersion,
} from "expo-application";
import { useEffect, useState, version } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { CurvedTransition, FadeIn } from "react-native-reanimated";

export default function SettingsScreen() {
  const isFocused = useIsFocused();

  const [universities, setUniversities] = useState<
    {
      name: any;
      id: number;
      logo: string;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    updateUniversities();
  }, [isFocused]);
  function updateUniversities() {
    getAddedUniversities()
      .then(
        (
          universities: {
            name: any;
            id: number;
            logo: string;
            color: string;
          }[]
        ) => {
          setUniversities(universities);
        }
      )
      .catch((e) => console.log(e));
  }

  return (
    <GestureHandlerRootView>
      <View className="bg-appBackground flex-1">
        <View className=" bg-accent rounded-b-3xl pt-20 px-8 pb-4">
          <Text
            className="text-text text-3xl"
            style={{ fontFamily: "PoppinsBold" }}
          >
            Settings
          </Text>
        </View>
        <View className="mt-12">
          <View>
            <Text
              className="text-text mx-12 text-lg border-b border-text mb-4 pb-2"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Your calendars
            </Text>
            <Animated.FlatList
              ListEmptyComponent={() => (
                <Animated.View className="mx-12 py-8 justify-center items-center ">
                  <Text style={{ fontFamily: "Poppins" }} className="text-text">
                    Oh, nothing to see here.
                  </Text>
                </Animated.View>
              )}
              data={universities}
              itemLayoutAnimation={CurvedTransition}
              ListFooterComponent={() => <View className="py-12"></View>}
              renderItem={({ item }) => (
                <Animated.View entering={FadeIn} className="mx-12 mb-4">
                  <DraggableUniversityItem
                    onRemoved={(id: number) => {
                      removeUniversity(id).then(() => {
                        updateUniversities();
                      });
                    }}
                    key={item.id}
                    item={item}
                  ></DraggableUniversityItem>
                </Animated.View>
              )}
            ></Animated.FlatList>
          </View>
          <View>
            <Text
              className="text-text mx-12 text-lg border-b border-text mb-4 pb-2"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Updates
            </Text>
            <View>
              <Text
                className="text-text mx-14 opacity-50"
                style={{ fontFamily: "Poppins" }}
              >
                Version: {`${applicationName} ${nativeApplicationVersion}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
