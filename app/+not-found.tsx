import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function NotFoundScreen(){
    return(
        <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text>This screen doesn't exist.</Text>
        <Link href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
    )
}

const styles = StyleSheet.create(
  {
    container:{
      flex:1,
      justifyContent: "center",
      alignItems: "center"
    }
  }
)