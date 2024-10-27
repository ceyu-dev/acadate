import { Colors } from "@/constants/Colors";
import { supabaseClient } from "@/lib/supabase";
import { router } from "expo-router";
import { Fragment, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignInScreen() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);

  async function handleSignIn() {
    if (email.length == 0) {
      setErrorMessage("Please enter your email.");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Email is invalid.");
      return;
    }
    if (password.length == 0) {
      setErrorMessage("Please type your password.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    router.dismiss();
    router.replace("/(tabs)/");
  }

  return (
    <Fragment>
      <View className="bg-accent flex-1 pt-16 px-8">
        <View className="gap-2">
          <Text
            className="text-text  text-3xl"
            style={{ fontFamily: "PoppinsBold" }}
          >
            Sign In
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
              Email
            </Text>
            <TextInput
              textContentType="emailAddress"
              className="border border-text text-text rounded-lg px-3 py-2"
              selectionColor={Colors.text}
              style={{ fontFamily: "Poppins" }}
              placeholder="johndoe@email.com"
              placeholderTextColor={Colors.text + "80"}
              value={email}
              onChangeText={setEmail}
            ></TextInput>
          </View>
          <View className="gap-2">
            <Text
              className="text-text text-base"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Password
            </Text>
            <TextInput
              textContentType="password"
              secureTextEntry={true}
              className="border border-text text-text rounded-lg px-3 py-2"
              selectionColor={Colors.text}
              style={{ fontFamily: "Poppins" }}
              placeholder="Please type your password"
              placeholderTextColor={Colors.text + "80"}
              value={password}
              onChangeText={setPassword}
            ></TextInput>
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
        <View className="pt-4 justify-center items-center gap-2">
          <TouchableOpacity
            onPress={handleSignIn}
            className="bg-text py-2 px-4 flex-row rounded-lg justify-center items-center"
          >
            <ActivityIndicator
              animating={true}
              color={Colors.accent}
              className={`pr-2 ${isLoading ? "" : "hidden"}`}
            ></ActivityIndicator>
            <Text style={{ fontFamily: "PoppinsBold" }}>Sign in</Text>
          </TouchableOpacity>
          <Text className="text-text pt-4" style={{ fontFamily: "Poppins" }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.replace("/signUp");
            }}
            className="bg-transparent border border-text py-2 px-4 rounded-lg justify-center items-center"
          >
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-text">
              Sign up for free!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}
