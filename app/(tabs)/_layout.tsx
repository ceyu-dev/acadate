import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { BlurView } from "expo-blur";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShadowVisible: false,
          tabBarActiveTintColor: Colors.text,
          tabBarActiveBackgroundColor: "#9285d4",
          tabBarInactiveTintColor: Colors.text,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            margin: 12,
            borderRadius: 24,
          },
          tabBarStyle: {
            position: "absolute",
            height: 64,

            borderColor: Colors.accent,
            borderTopEndRadius: 16,
            borderTopStartRadius: 16,
            marginRight: 18,
            marginLeft: 18,
            backgroundColor: Colors.accent,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="universities"
          options={{
            title: "Universities",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "school" : "school-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "settings" : "settings-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
