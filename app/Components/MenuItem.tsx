import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const MenuItem = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          padding: 15,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "#000",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{title}</Text>

        <FontAwesome name="chevron-right" size={20} />
      </View>
    </TouchableOpacity>
  );
};
export default MenuItem;
