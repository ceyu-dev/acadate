import React, { useEffect } from "react";
import { Dimensions, Image, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const LoadingText = React.memo(() => {
  const offset = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withTiming(4 * width, {
          duration: 2000,
        }),
        withTiming(-2 * width, {
          duration: 0,
        })
      ),
      -1, // Infinite repetition
      false // Don't reverse the animation
    );
  }, []);
  return (
    <Animated.View entering={FadeIn}>
      <View
        className={`h-9 overflow-hidden bg-white opacity-20 rounded-lg mt-2`}
      >
        <Animated.Image
          style={[animatedStyle, { left: -3 * width }]}
          source={require("../assets/images/blur.png")}
          className="absolute h-36 -top-18 aspect-square"
        ></Animated.Image>
      </View>
    </Animated.View>
  );
});

export default LoadingText;
