import { Colors } from "@/constants/Colors";
import { addUniversity } from "@/lib/user";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, ViewToken } from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface UniversityItemProps {
  item: { id: number; color: any; logo: any; name: any };
  viewableItems: SharedValue<ViewToken[]>;
}

const UniversityItem: React.FC<UniversityItemProps> = ({
  item,
  viewableItems,
}) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item.id === item.id)
    );
    return {
      opacity: withTiming(isVisible ? 1 : 0, {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.8, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            reduceMotion: ReduceMotion.System,
          }),
        },
      ],
    };
  }, []);

  return (
    <Animated.View
      style={rStyle}
      className=" mx-8 mt-4 rounded-xl overflow-hidden "
    >
      <TouchableOpacity
        className="flex-row  p-4   items-center"
        style={[{ backgroundColor: item.color + "70" }]}
      >
        <Image
          className="w-14 h-14 rounded-md"
          source={{
            uri: item.logo,
          }}
        ></Image>
        <Text
          className="ml-4 text-text text-base flex-1"
          style={{ fontFamily: "Poppins" }}
        >
          {item.name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            addUniversity(item);
          }}
          className="py-2"
        >
          <Ionicons name="add-circle" size={36} color={Colors.text}></Ionicons>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default UniversityItem;
