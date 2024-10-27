import { supabaseClient } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function AccountsScreen() {
  async function handleSignOut() {
    const signOutRequest = await supabaseClient.auth.signOut();
  }
  return (
    <View className="bg-appBackground flex-1">
      <View className=" bg-accent rounded-b-3xl pt-20 px-8 pb-4">
        <Text
          className="text-text text-3xl"
          style={{ fontFamily: "PoppinsBold" }}
        >
          Account
        </Text>
      </View>
      <View className="mt-12">
        <View className="mx-12 ">
          <Text
            className="text-text text-lg border-b border-text mb-4 pb-2"
            style={{ fontFamily: "PoppinsBold" }}
          >
            Session
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-text p-2 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons size={24} name="log-out"></Ionicons>
            <Text className="text-base ml-2" style={{ fontFamily: "Poppins" }}>
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
