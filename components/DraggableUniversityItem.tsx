import { Colors } from "@/constants/Colors";
import { removeUniversity } from "@/lib/user";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface DraggableUniversityItemProps {
  item: { id: number; logo: string; name: string; color: string };
  onRemoved: any;
}

const DraggableUniversityItem: React.FC<DraggableUniversityItemProps> =
  React.memo(({ item, onRemoved }) => {
    function remove() {
      setTimeout(() => {
        onRemoved(item.id);
      }, 300);
    }

    const offset = useSharedValue<number>(0);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: offset.value,
        },
      ],
    }));
    const pan = Gesture.Pan()
      .onChange((event) => {
        offset.value = event.translationX;
      })
      .onFinalize((event) => {
        console.log(event.translationX, event.velocityX);
        if (Math.abs(event.velocityX) > 1500) {
          offset.value = withSpring(
            500 * (event.velocityX / Math.abs(event.velocityX)),
            {
              mass: 1,
              damping: 14,
              stiffness: 234,
              overshootClamping: false,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 2,
              reduceMotion: ReduceMotion.System,
            }
          );
          runOnJS(remove)();
        } else {
          offset.value = withSpring(0);
        }
      });

    return (
      <GestureDetector key={item.id} gesture={pan}>
        <Animated.View
          className="flex-row mt-2 rounded-lg p-2 items-center"
          style={[{ backgroundColor: item.color + "70" }, animatedStyle]}
        >
          <Image
            source={{ uri: item.logo }}
            className="h-10 w-10 rounded-md"
          ></Image>

          <Text
            className="text-text flex-1 ml-2"
            style={{ fontFamily: "Poppins" }}
          >
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              removeUniversity(item.id).then(() => {});
            }}
          >
            <Ionicons
              color={Colors.text}
              name="remove-circle"
              size={24}
            ></Ionicons>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    );
  });
export default DraggableUniversityItem;
