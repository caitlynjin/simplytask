import { View, TextInput, type TextInputProps, StyleSheet } from 'react-native';

export function CustomTextInput({...props}: TextInputProps) {
  return (
    <View>
      <View style={{ padding: 8 }}>
        <TextInput
          style={styles.text}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
      </View>

      <View style={styles.outline} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "regular",
  },
  outline: {
    backgroundColor: "black",
    height: 2
  }
});