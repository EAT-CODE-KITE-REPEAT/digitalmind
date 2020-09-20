import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
const { width, height } = Dimensions.get("window");
const renderDownloadButtons = ({ routeName }) => (
  <View style={{ flex: 1 }}>
    <View
      style={{
        flex: 1,
        flexDirection: width < 600 ? "column" : "row",
        flexWrap: "wrap",
      }}
    >
      <TouchableOpacity
        style={{ marginLeft: 20, marginTop: 20 }}
        onPress={() =>
          Linking.openURL(
            "https://apps.apple.com/us/app/bij-link/id1526004916?app=itunes&ign-mpt=uo%3D4"
          )
        }
      >
        <Image
          source={require("./assets/app-store-badge.svg")}
          style={{ width: 200, height: 60 }}
        />
      </TouchableOpacity>

      {routeName !== "iosHome" ? (
        <TouchableOpacity
          style={{ marginLeft: 20, marginTop: 20 }}
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.leckr.bij"
            )
          }
        >
          <Image
            source={require("./assets/google-play-badge.svg")}
            style={{ width: 200, height: 60 }}
          />
        </TouchableOpacity>
      ) : undefined}
    </View>
  </View>
);

export default renderDownloadButtons;
