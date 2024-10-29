import DraggableUniversityItem from "@/components/DraggableUniversityItem";
import { Colors } from "@/constants/Colors";
import { getAddedUniversities, removeUniversity } from "@/lib/user";
import { getLatestUpdate } from "@/lib/version";
import { useIsFocused } from "@react-navigation/native";
import { applicationName, nativeApplicationVersion } from "expo-application";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  CurvedTransition,
  FadeIn,
  LinearTransition,
} from "react-native-reanimated";

interface University {
  name: string;
  id: number;
  logo: string;
  color: string;
}

interface UpdateInfo {
  latestVersion: {
    html_url: string;
    tag_name: string;
  };
  isCurrentVersionLatest: boolean;
  canUpdate: boolean;
}

const INITIAL_UPDATE_INFO: UpdateInfo = {
  latestVersion: { html_url: "", tag_name: "" },
  isCurrentVersionLatest: false,
  canUpdate: false,
};

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>(INITIAL_UPDATE_INFO);
  const [isUpdateLoading, setUpdateLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);

  const updateUniversities = useCallback(async () => {
    try {
      const unis = await getAddedUniversities();
      setUniversities(unis);
    } catch (error) {
      console.error("Failed to fetch universities:", error);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      updateUniversities();
    }
  }, [isFocused, updateUniversities]);

  const checkForUpdates = useCallback(async () => {
    setUpdateLoading(true);
    try {
      const latestUpdate = await getLatestUpdate();
      const newUpdateInfo: UpdateInfo = {
        latestVersion: latestUpdate,
        isCurrentVersionLatest:
          latestUpdate.tag_name === nativeApplicationVersion,
        canUpdate: latestUpdate.tag_name !== nativeApplicationVersion,
      };
      setUpdateInfo(newUpdateInfo);
    } catch (error) {
      console.error("Failed to check for updates:", error);
    } finally {
      setUpdateLoading(false);
    }
  }, []);

  const handleUpdates = useCallback(() => {
    if (updateInfo?.latestVersion.html_url) {
      Linking.openURL(updateInfo.latestVersion.html_url);
    } else {
      checkForUpdates();
    }
  }, [updateInfo, checkForUpdates]);

  const handleUniversityRemoval = useCallback(
    async (id: number) => {
      try {
        await removeUniversity(id);
        await updateUniversities();
      } catch (error) {
        console.error("Failed to remove university:", error);
      }
    },
    [updateUniversities]
  );

  const renderEmptyList = useCallback(
    () => (
      <Animated.View className="mx-12 py-8 justify-center items-center">
        <Text style={{ fontFamily: "Poppins" }} className="text-text">
          Oh, nothing to see here.
        </Text>
      </Animated.View>
    ),
    []
  );

  const renderUniversityItem = useCallback(
    ({ item }: { item: University }) => (
      <Animated.View entering={FadeIn} className="mx-12 mb-4">
        <DraggableUniversityItem
          onRemoved={handleUniversityRemoval}
          key={item.id}
          item={item}
        />
      </Animated.View>
    ),
    [handleUniversityRemoval]
  );

  const renderListFooter = useCallback(() => <View className="py-12" />, []);

  const getUpdateButtonStyle = useCallback(
    () =>
      `mx-12 p-2 rounded-lg mt-4 flex-row items-center justify-center ${
        updateInfo.isCurrentVersionLatest
          ? "opacity-50 text-text border border-text"
          : "bg-text text-black"
      }`,
    [updateInfo.isCurrentVersionLatest]
  );

  const getUpdateButtonTextStyle = useCallback(
    () =>
      `ml-2 ${updateInfo.isCurrentVersionLatest ? "text-text" : "text-black"}`,
    [updateInfo.isCurrentVersionLatest]
  );

  const getUpdateButtonText = useCallback(() => {
    if (updateInfo.canUpdate) {
      return `Update to ${updateInfo.latestVersion.tag_name}`;
    }
    return updateInfo.isCurrentVersionLatest
      ? "You're up to date!"
      : "Check for updates";
  }, [updateInfo]);

  return (
    <GestureHandlerRootView>
      <View className="bg-appBackground flex-1">
        <View className="bg-accent rounded-b-3xl pt-12 px-8 pb-4">
          <Text
            className="text-text text-3xl"
            style={{ fontFamily: "PoppinsBold" }}
          >
            Settings
          </Text>
        </View>
        <Animated.View layout={LinearTransition} className="mt-12">
          <View>
            <Text
              className="text-text mx-12 text-lg border-b border-text mb-4 pb-2"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Your calendars
            </Text>
            <Animated.FlatList
              ListEmptyComponent={renderEmptyList}
              data={universities}
              itemLayoutAnimation={CurvedTransition}
              ListFooterComponent={renderListFooter}
              renderItem={renderUniversityItem}
            />
          </View>
          <Animated.View layout={LinearTransition}>
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
              <TouchableOpacity
                onPress={handleUpdates}
                className={getUpdateButtonStyle()}
                disabled={isUpdateLoading || updateInfo.isCurrentVersionLatest}
              >
                <ActivityIndicator
                  className={isUpdateLoading ? "" : "hidden"}
                  animating={true}
                  color={Colors.accent}
                />
                <Text
                  style={{ fontFamily: "Poppins" }}
                  className={getUpdateButtonTextStyle()}
                >
                  {getUpdateButtonText()}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
}
