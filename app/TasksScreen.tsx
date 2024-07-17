import { auth } from '@/firebaseConfig';
import { createTask, getAllTasks, updateTask, deleteTask, completeTask } from '@/services/tasks';
import { } from 'firebase/firestore'
import { CustomText } from "@/components/CustomText";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView
} from "react-native";

type Task = {
  id: string;
  completed: boolean;
  completedAt: Date;
  description: string;
  name: string;
  inEdit: boolean;
}

const TasksScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskToggled, setAddTaskToggled] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (auth.currentUser) {
      await getAllTasks(auth.currentUser.uid)
      .then((fetchedTasks) => {
        if (fetchedTasks) {
          setTasks(fetchedTasks.map((task) => ({
            ...task,
            inEdit: false
          })));
        }
      });
    }
  };

  const cancelNewTask = async () => {
    setAddTaskToggled(false);
  };

  const addNewTask = async () => {
    if (auth.currentUser && name) {
      await createTask(auth.currentUser.uid, name, description)
        .then(fetchTasks);
    }
    setAddTaskToggled(false);
    setName("");
    setDescription("");
  };

  const checkTask = async (task: Task) => {
    if (auth.currentUser) {
      await completeTask(auth.currentUser.uid, task, !task.completed)
        .then(fetchTasks);
    }
  };

  const editTask = async (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.id === taskId ? {
          ...prevTask,
          inEdit: !prevTask.inEdit
        } : prevTask
      )
    );
  };

  const doneEditTask = async (task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.id === task.id ? {
          ...prevTask,
          inEdit: !prevTask.inEdit
        } : prevTask
      )
    );

    if (auth.currentUser) {
      await updateTask(auth.currentUser.uid, task, task.completed, description, name)
        .then(fetchTasks);
      setName("");
      setDescription("");
    }
  };

  const removeTask = async (task: Task) => {
    if (auth.currentUser) {
      await deleteTask(auth.currentUser.uid, task)
        .then(fetchTasks);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText type="title">My Tasks</CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
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

        {/* Tasks UI */}
        {tasks.map((task) => (
          <View key={task.id}>
            <View style={styles.taskContainer}>
              <View style={styles.taskLeftPart}>
                {task.inEdit
                  // In edit state
                  ? <TouchableOpacity onPress={() => removeTask(task)}>
                    <Image
                      source={require('@/assets/images/trash.png')}
                      style={styles.checkboxIcon}
                    />
                  </TouchableOpacity>
                  // Normal state
                  : <TouchableOpacity onPress={() => checkTask(task)}>
                    <Image
                      source={
                        task.completed
                        ? require('@/assets/images/checkbox-filled.png')
                        : require('@/assets/images/checkbox.png')
                      }
                      style={styles.checkboxIcon}
                    />
                  </TouchableOpacity>}
                {task.inEdit
                ? <TextInput
                  onFocus={() => setName(task.name)}
                  onChangeText={(text) => setName(text)}
                  placeholder={task.name}
                  style={styles.nameTextInput}
                  value={name}
                />
                : <CustomText type="mediumTitle">{task.name}</CustomText>}
              </View>
            </View>

            <View style={styles.taskBodyContainer}>
              {task.inEdit
                ? <TextInput
                  onFocus={() => setDescription(task.description)}
                  onChangeText={(text) => setDescription(text)}
                  placeholder={task.description}
                  style={styles.descriptionTextInput}
                  value={description}
                />
                : <CustomText type="body" style={{ width: 260 }}>
                  {task.description}
                </CustomText>}

              {task.inEdit
                // Edit state
                ? <TouchableOpacity onPress={() => {doneEditTask(task)}}>
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
                // Normal state
                : <TouchableOpacity onPress={() => {editTask(task.id)}}>
                  <Image
                    source={require('@/assets/images/edit.png')}
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>}
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingHorizontal: 32,
    marginTop: 32,
    marginBottom: 96
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
  taskContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
  },
  taskLeftPart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  taskBodyContainer: {
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
  },
  checkboxIcon: {
    width: 21,
    height: 21
  }
});

export default TasksScreen;