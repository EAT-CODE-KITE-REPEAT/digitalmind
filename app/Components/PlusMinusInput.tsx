import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const PlusMinusInput = ({
  title,
  onChange,
  value,
}: {
  title: string;
  onChange: (value: string) => void;
  value: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#000",
        paddingHorizontal: 15,
        paddingVertical: 5,
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 15 }}>{title}</Text>

      <TouchableOpacity
        onPress={() =>
          onChange(Number(value) <= 1 ? "1" : (Number(value) - 1).toString())
        }
      >
        <View
          style={{
            borderRadius: 25,
            borderWidth: 1,
            borderColor: "#000",
            width: 35,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>-</Text>
        </View>
      </TouchableOpacity>
      <TextInput
        placeholder="Times"
        value={value}
        onChangeText={onChange}
        style={{
          fontSize: 24,
          padding: 5,
        }}
      />

      <TouchableOpacity
        onPress={() => onChange((Number(value) + 1).toString())}
      >
        <View
          style={{
            borderRadius: 25,
            borderWidth: 1,
            borderColor: "#000",
            width: 35,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
