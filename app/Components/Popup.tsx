import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { FunctionComponent } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IProps {
  visible: boolean;
  title?: string;
  onClose?: any;
  fullScreen?: boolean;
  children: any;

  kas?: boolean;
}

const Popup: FunctionComponent<IProps> = ({
  visible,
  title,
  onClose,
  fullScreen,
  children,
  kas,
}) => {
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.popUpBackground}>
        <View style={[styles.popUp, { flex: fullScreen ? 1 : 0 }]}>
          {title || onClose ? (
            <View style={styles.popUpHeader}>
              {title ? (
                <Text style={styles.popUpHeaderTitle}>{title}</Text>
              ) : null}
              {onClose ? (
                <TouchableOpacity onPress={onClose}>
                  <FontAwesome name="close" style={{ margin: 10 }} />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popUpBackground: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#CCCCCCCC",
    justifyContent: "center",
  },
  popUp: {
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  popUpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CCC",
  },
  popUpHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    padding: 20,
  },
  popUpHeaderIcon: {
    color: "#000",
    padding: 20,
  },
});

export default Popup;
