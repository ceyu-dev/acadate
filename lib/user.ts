import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabaseClient } from "./supabase";

let name: String;
let pendingChange: boolean = false;
async function getName() {
  if (!name) {
    const { data, error } = await supabaseClient.auth.getUser();
    name = data.user?.user_metadata.display_name;
  }
  return name;
}

async function addUniversity(university: {}) {
  try {
    const prevUniversities = await getAddedUniversities();
    const jsonData = JSON.stringify(
      prevUniversities
        ? [...prevUniversities, university].filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          )
        : [university]
    );
    pendingChange = true;
    await AsyncStorage.setItem("universities", jsonData);
  } catch (e) {}
}
async function getAddedUniversities() {
  try {
    const value = await AsyncStorage.getItem("universities");

    return value ? JSON.parse(value) : null;
  } catch (e) {
    return null;
  }
}
async function removeUniversity(university_id: number) {
  try {
    console.log("Removing");
    const prevUniversities: { id: number }[] = await getAddedUniversities();
    const newArray = prevUniversities.filter(
      (item) => item.id !== university_id
    );
    const jsonData = JSON.stringify(newArray);
    pendingChange = true;
    await AsyncStorage.setItem("universities", jsonData);
  } catch (e) {}
}
function checkPending() {
  return pendingChange;
}
function resetPending() {
  pendingChange = false;
}
export {
  getName,
  addUniversity,
  getAddedUniversities,
  removeUniversity,
  resetPending,
  checkPending,
};
