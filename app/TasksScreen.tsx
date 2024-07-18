import { auth } from '@/firebaseConfig';
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  completeTask,
} from '@/services/tasks';
import { Timestamp } from 'firebase/firestore'
import { CustomText } from "@/components/CustomText";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  RefreshControl
} from "react-native";
import { TasksProp } from './_layout';

/**
 * The local task type
 *
 * inEdit is the state of whether the task is currently being edited
 */
type Task = {
  id: string;
  completed: boolean;
  completedAt: Timestamp;
  description: string;
  name: string;
  inEdit: boolean;
}

const TasksScreen = ({ navigation }: TasksProp) => {
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskToggled, setAddTaskToggled] = useState(false);

  /* Fetches tasks when opened */
  useEffect(() => {
    fetchTasks();
  }, []);

  /* Fetches all tasks and sets the local inEdit property */
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

  /* Ends editing of task without changes */
  const cancelNewTask = async () => {
    setAddTaskToggled(false);
  };

  /* Adds the new task and finishes add task prompt */
  const addNewTask = async () => {
    if (auth.currentUser && name) {
      await createTask(auth.currentUser.uid, name, description)
        .then(fetchTasks);
    }
    setAddTaskToggled(false);
    setName("");
    setDescription("");
  };

  /* Checks the task complete or unchecks the task as incomplete */
  const checkTask = async (task: Task) => {
    if (auth.currentUser) {
      await completeTask(auth.currentUser.uid, task, !task.completed)
        .then(fetchTasks);
    }
  };

  /* Sets the task in edit mode */
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

  /* Closes edit mode and updates the task */
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

  /* Removes the task from the list */
  const removeTask = async (task: Task) => {
    if (auth.currentUser) {
      await deleteTask(auth.currentUser.uid, task)
        .then(fetchTasks);
    }
  };

  /* Refreshes the page */
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks()
      .then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText type="title">My Tasks</CustomText>
      </View>

      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Add task */}
        {!addTaskToggled ?
          <TouchableOpacity
            onPress={() => setAddTaskToggled(true)}
          >
            <View style={styles.addTaskContainer}>
              <CustomText type="mediumTitle">Add task</CustomText>
            </View>
          </TouchableOpacity>
        : undefined}

        {/* Add task in creation mode */}
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

        {/* List of tasks */}
        {tasks.map((task) => (
          <View key={task.id}>
            <View style={styles.taskContainer}>
              <View style={styles.taskLeftPart}>
                {task.inEdit
                  // Display trash icon in edit mode to delete task
                  ? <TouchableOpacity onPress={() => removeTask(task)}>
                    <Image
                      source={require('@/assets/images/trash.png')}
                      style={styles.checkboxIcon}
                    />
                  </TouchableOpacity>
                  // Display checkbox icon to change task complete state
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
                // Display name text input in edit mode
                ? <TextInput
                  onFocus={() => setName(task.name)}
                  onChangeText={(text) => setName(text)}
                  placeholder={task.name}
                  style={styles.nameTextInput}
                  value={name}
                />
                // Display task name
                : <CustomText type="mediumTitle">{task.name}</CustomText>}
              </View>
            </View>

            <View style={styles.taskBodyContainer}>
              {task.inEdit
                // Display description text input in edit mode
                ? <TextInput
                  onFocus={() => setDescription(task.description)}
                  onChangeText={(text) => setDescription(text)}
                  placeholder={task.description}
                  style={styles.descriptionTextInput}
                  value={description}
                />
                // Display task description
                : <CustomText type="body" style={{ width: 260 }}>
                  {task.description}
                </CustomText>}

              {task.inEdit
                // Display check in edit mode to finish editing
                ? <TouchableOpacity onPress={() => {doneEditTask(task)}}>
                  <Image
                    source={require('@/assets/images/check.png')}
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
                // Display edit icon to start editing
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
    marginVertical: 32
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