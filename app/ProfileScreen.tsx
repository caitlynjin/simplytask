import { CustomText } from "@/components/CustomText";
import { auth } from "@/firebaseConfig";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ProfileProp } from "./_layout";

const ProfileScreen = ({ navigation }: ProfileProp) => {
  const signOut = async () => {
    try {
      await auth.signOut()
        .then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignUpScreen' }]
          })
        })
    } catch (error) {
      console.error("Error signing out");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText type="title">Profile</CustomText>
      </View>

      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={signOut}>
          <View style={styles.buttonContainer}>
            <CustomText type="button">Sign Out</CustomText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerContainer: {
    height: 150,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "gray",
    paddingHorizontal: 32,
    paddingBottom: 12
  },
  contentContainer: {
    height: "70%",
    margin: 32,
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#AEAEAE"
  }
});

export default ProfileScreen;