import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GetStartedPage() {
  return (
    <ImageBackground
      source={require("../assets/images/getStarted.png")}
      className="flex-1 justify-center items-center"
    >
      <Image
        source={require("../assets/images/studying.png")}
        className="w-full aspect-auto drop-shadow-lg"
        style={{ height: 390 }}
      ></Image>
      <View className="mt-12">
        <Text
          style={{ fontFamily: "PoppinsBold" }}
          className="text-text text-2xl "
        >
          Get started with{" "}
          <Text style={{ fontFamily: "EBGaramondBold" }} className="text-3xl">
            Acadate
          </Text>
          !
        </Text>
      </View>
      <View>
        <Text
          className="text-text text-justify mx-4 opacity-80"
          style={{ fontFamily: "Poppins" }}
        >
          From exam dates to breaks, we’ve got everything in one spot so you
          don’t have to stress. Add your schools now and stay on top of things
          with ease!
        </Text>
      </View>
      <View className="pt-12 justify-center items-center gap-2">
        <TouchableOpacity
          onPress={() => {
            router.navigate("/signUp");
          }}
          className="bg-text py-2 px-4 rounded-lg justify-center items-center"
        >
          <Text style={{ fontFamily: "Poppins" }}>Sign up for free!</Text>
        </TouchableOpacity>
        <Text className="text-text" style={{ fontFamily: "Poppins" }}>
          or
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.navigate("/signIn");
          }}
          className="bg-transparent border border-text py-2 px-4 rounded-lg justify-center items-center"
        >
          <Text style={{ fontFamily: "Poppins" }} className="text-text">
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
