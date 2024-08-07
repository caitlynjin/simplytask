import { auth } from '@/firebaseConfig';
import { createUser } from '@/services/users';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { } from 'firebase/firestore'
import { CustomText } from "@/components/CustomText";
import { CustomTextInput } from "@/components/CustomTextInput";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { SignUpScreenProp } from './_layout';

const SignUpScreen = ({ navigation }: SignUpScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Signs up the new user or signs in the existing user */
  const handleUser = async () => {
    console.log("Handle user")
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await createUser(userCredential.user.uid, email);
        navigation.navigate("BottomNav");
        console.log('User account created:', userCredential.user.uid);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          signInWithEmailAndPassword(auth, email, password)
            .then(() => {
              navigation.navigate("BottomNav");
              console.log("User was signed in")
            })
        } else {
          console.error(error);
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <CustomText type="title">Let's get started</CustomText>

            <CustomText type="body">
              Enter your email and password to sign up, or log in if you have an account.
            </CustomText>
          </View>

          {/* Text inputs for email and password */}
          <View style={styles.inputContainer}>
            <View style={{ gap: 4 }}>
            <CustomText type="subtitle">Email</CustomText>

              <CustomTextInput
                onChangeText={(text) => { setEmail(text) }}
                placeholder="Enter email here"
              />
            </View>

            <View style={{ gap: 4 }}>
              <CustomText type="subtitle">Password</CustomText>

              <CustomTextInput
                onChangeText={(text) => { setPassword(text) }}
                placeholder="Enter password here"
              />
            </View>
          </View>

          {/* Sign up or log in button */}
          <TouchableOpacity
            onPress={() => { handleUser() }}
          >
            <View style={styles.buttonContainer}>
              <CustomText type="button">Sign up / Log in</CustomText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF"
  },
  contentContainer: {
    marginHorizontal: 32,
    gap: 48,
  },
  headerContainer: {
    gap: 16
  },
  inputContainer: {
    gap: 48,
    marginBottom: 64
  },
  buttonContainer: {
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "gray",
  },
});

export default SignUpScreen;