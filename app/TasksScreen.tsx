import { auth } from '@/firebaseConfig';
import { createTask } from '@/services/tasks';
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
  Keyboard,
  Image,
  TextInput
} from "react-native";

export default function TasksScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [addTaskToggled, setAddTaskToggled] = useState(false);

  const fetchTasks = async () => {

  }

  const cancelNewTask = () => {
    setAddTaskToggled(false);
  }

  const addNewTask = async () => {
    if (auth.currentUser) {
      await createTask(auth.currentUser.uid, name, description);
    }
    setAddTaskToggled(false);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <CustomText type="title">My Tasks</CustomText>
        </View>
        <View style={styles.contentContainer}>
          {/* Add task UI */}
          {!addTaskToggled ?
            <TouchableOpacity
              onPress={() => setAddTaskToggled(true)}
            >
              <View style={styles.addTaskContainer}>
                <CustomText type="mediumTitle">Add task</CustomText>
              </View>
            </TouchableOpacity>
          : undefined}
          {addTaskToggled ?
            <View>
              <View style={styles.addTaskContainer}>
                <TouchableOpacity onPress={cancelNewTask}>
                  <Image
                    source={require('@/assets/images/X.png')}
                    style={styles.xIcon}
                  />
                </TouchableOpacity>

                <TextInput
                  onChangeText={ (text) => setName(text) }
                  placeholder='Enter task name here'
                  style={styles.nameTextInput}
                />
              </View>
              <View style={styles.addTaskBodyContainer}>
                <TextInput
                  onChangeText={ (text) => setDescription(text) }
                  placeholder='Enter description here'
                  style={styles.descriptionTextInput}
                />

                <TouchableOpacity onPress={addNewTask}>
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          : undefined}
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    margin: 32,
  },
  addTaskContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
    backgroundColor: "#F1F1F1",
  },
  addTaskBodyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12.5,
    paddingHorizontal: 16,
    gap: 16,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
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
  nameTextInput: {
    width: 260,
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "medium",
  },
  descriptionTextInput: {
    width: 260,
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "regular",
  },
  xIcon: {
    width: 21,
    height: 21,
  },
  checkIcon: {
    width: 26,
    height: 26
  }
});
