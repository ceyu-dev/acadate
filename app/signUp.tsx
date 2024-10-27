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
import SignIn from "./signIn";

export default function SignUpScreen() {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPassword, setRetypedPassword] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dialogShown, setDialogShown] = useState<boolean>(false);
  function handleSignUpConfirmation() {
    setDialogShown(false);
    router.replace("/signIn");
  }
  async function handleSignUp() {
    if (email.length == 0) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Email is invalid.");
      return;
    }
    if (username.length == 0) {
      setErrorMessage("Username is required.");
      return;
    }
    if (username.length < 4) {
      setErrorMessage("Username must be at least 4 characters long.");
      return;
    }
    if (!usernameRegex.test(username)) {
      setErrorMessage(
        "Username can only contain letters, numbers, and underscores."
      );
      return;
    }
    if (password.length == 0) {
      setErrorMessage("Please type a password.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (retypedPassword.length == 0) {
      setErrorMessage("Please retype your password.");
      return;
    }
    if (retypedPassword != password) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    console.log("Trying to sign up...");
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: username,
        },
      },
    });
    console.log("Operation complete.");
    setLoading(false);
    if (error) {
      setErrorMessage(error.message);
      console.log("Error!");
      return;
    }
    if (!session) {
      setDialogShown(true);
    }
  }

  return (
    <Fragment>
      <View className="bg-accent flex-1 pt-16 px-8">
        <View className="gap-2">
          <Text
            className="text-text  text-3xl"
            style={{ fontFamily: "PoppinsBold" }}
          >
            Sign Up
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
              className="text-text  text-base"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Display name
            </Text>
            <TextInput
              textContentType="username"
              onChangeText={setUsername}
              value={username}
              className="border border-text text-text rounded-lg px-3 py-2"
              selectionColor={Colors.text}
              style={{ fontFamily: "Poppins" }}
              placeholder="TheRealJohn"
              placeholderTextColor={Colors.text + "80"}
            ></TextInput>
          </View>
          <View className="gap-2">
            <Text
              className="text-text  text-base"
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
              placeholder="At least 8 characters"
              placeholderTextColor={Colors.text + "80"}
              value={password}
              onChangeText={setPassword}
            ></TextInput>

            <TextInput
              textContentType="password"
              secureTextEntry={true}
              className="border border-text text-text rounded-lg px-3 py-2"
              selectionColor={Colors.text}
              style={{ fontFamily: "Poppins" }}
              placeholder="Retype your password"
              placeholderTextColor={Colors.text + "80"}
              value={retypedPassword}
              onChangeText={setRetypedPassword}
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
            onPress={handleSignUp}
            className="bg-text py-2 px-4 flex-row rounded-lg justify-center items-center"
          >
            <ActivityIndicator
              animating={true}
              color={Colors.accent}
              className={`pr-2 ${isLoading ? "" : "hidden"}`}
            ></ActivityIndicator>
            <Text style={{ fontFamily: "PoppinsBold" }}>Sign up for free!</Text>
          </TouchableOpacity>
          <Text className="text-text pt-4" style={{ fontFamily: "Poppins" }}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              router.replace("/signIn");
            }}
            className="bg-transparent border border-text py-2 px-4 rounded-lg justify-center items-center"
          >
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-text">
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {dialogShown ? (
        <View
          className="absolute px-7 justify-center h-full items-center w-full"
          style={{ backgroundColor: "#00000070" }}
        >
          <View className="bg-text p-4 rounded-lg w-full justify-center items-center">
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-black">
              Signed up successfully!
            </Text>
            <Text style={{ fontFamily: "Poppins" }}>
              Please check your email for confirmation.
            </Text>
            <TouchableOpacity
              className="bg-accent p-2 rounded-lg mt-5"
              onPress={handleSignUpConfirmation}
            >
              <Text className="text-text" style={{ fontFamily: "Poppins" }}>
                Understood!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="absolute" />
      )}
    </Fragment>
  );
}
