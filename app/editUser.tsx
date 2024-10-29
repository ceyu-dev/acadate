import LoadingText from "@/components/LoadingText";
import { Colors } from "@/constants/Colors";
import { supabaseClient } from "@/lib/supabase";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

export default function ChangeDisplayNameModal() {
  const isFocused = useIsFocused();
  const [userDetails, setUserDetails] = useState<any>();
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    console.log("Opened modal");
    supabaseClient.auth.getUser().then((user) => {
      if (user.data) {
        setUserDetails(user.data.user);
        setNewDisplayName(user.data.user?.user_metadata.display_name);
      }
    });
  }, [isFocused]);

  function handleUpdate() {
    if (newDisplayName) {
      setErrorMessage("");
      if (newDisplayName != userDetails.user_metadata.display_name) {
        supabaseClient.auth.updateUser({
          data: { display_name: newDisplayName },
        });
      }

      router.dismiss();
    } else {
      setErrorMessage("Please enter a different display name");
    }
  }
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: "#00000070" }}
    >
      <Animated.View
        entering={FadeInDown}
        exiting={FadeOutDown}
        className="bg-accent h-5/6 w-11/12 pt-16 px-8 rounded-lg"
      >
        <ScrollView>
          <View className="gap-2">
            <Text
              className="text-text  text-3xl"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Edit user info
            </Text>
            <Text
              style={{ fontFamily: "Poppins" }}
              className="text-text opacity-80"
            >
              Please enter your details
            </Text>
          </View>
          <View className="pt-12 gap-4">
            <View className="gap-2">
              <Text
                className="text-text  text-base"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Your email
              </Text>
              {userDetails?.email ? (
                <Animated.Text
                  entering={FadeInUp}
                  className="text-text text-lg"
                  style={{ fontFamily: "Poppins" }}
                >
                  {userDetails?.email}
                </Animated.Text>
              ) : (
                <LoadingText></LoadingText>
              )}
            </View>
            <View className="gap-2">
              <Text
                className="text-text text-base"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Display name
              </Text>
              {userDetails?.user_metadata.display_name ? (
                <Animated.View entering={FadeInUp}>
                  <TextInput
                    textContentType="username"
                    className="border border-text text-text rounded-lg px-3 py-2"
                    selectionColor={Colors.text}
                    style={{ fontFamily: "Poppins" }}
                    placeholder={`${
                      userDetails?.user_metadata.display_name
                        ? `${userDetails.user_metadata.display_name}`
                        : "Update your display name"
                    }`}
                    placeholderTextColor={Colors.text + "80"}
                    onChangeText={setNewDisplayName}
                    value={newDisplayName}
                  ></TextInput>
                </Animated.View>
              ) : (
                <LoadingText></LoadingText>
              )}
            </View>
          </View>
          <View className="border-b border-text pt-4 justify-center items-center">
            <Text
              className={
                errorMessage
                  ? "opacity-100 h-12  text-rose-300 "
                  : "opacity-0 h-12 text-rose-300"
              }
              style={{ fontFamily: "Poppins" }}
            >
              {errorMessage}
            </Text>
          </View>
        </ScrollView>

        <View className="pt-4 justify-center flex-row items-center gap-2 mb-6 ">
          <TouchableOpacity
            onPress={handleUpdate}
            className="bg-text py-2 px-4 flex-row rounded-lg justify-center items-center"
          >
            <Text style={{ fontFamily: "PoppinsBold" }}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.dismiss();
            }}
            className="bg-transparent border border-text py-2 px-4 rounded-lg justify-center items-center"
          >
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-text">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
