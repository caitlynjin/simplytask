import { View, Text, type TextProps, StyleSheet } from 'react-native';

export type CustomTextProps = TextProps & {
  type: "title" | "subtitle" | "body" | "button"
}

export function CustomText({type, ...props}: CustomTextProps) {
  return (
    <Text
      style={[
        type === "title" ? styles.titleText : undefined,
        type === "subtitle" ? styles.subtitleText : undefined,
        type === "body" ? styles.bodyText : undefined,
        type === "button" ? styles.buttonText : undefined
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 36,
    fontFamily: "Inter",
    fontWeight: "bold",
  },
  subtitleText: {
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "regular",
  },
  bodyText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "regular",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "bold",
  },
});