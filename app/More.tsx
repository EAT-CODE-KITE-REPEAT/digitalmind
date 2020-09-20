import * as StoreReview from "expo-store-review";
import React from "react";
import { Linking, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import MenuItem from "./Components/MenuItem";
import { Device } from "./Store";
function App({
  navigation,
  dispatch,
  device,
}: {
  navigation: any;
  dispatch: Dispatch;
  device: Device;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {__DEV__ ? (
          <MenuItem onPress={() => dispatch({ type: "PURGE" })} title="Purge" />
        ) : null}
        <MenuItem onPress={() => StoreReview.requestReview()} title="Review" />

        <MenuItem
          onPress={() => Linking.openURL("https://weeklymvp.com/")}
          title="About the developer"
        />

        <MenuItem
          onPress={() => Linking.openURL("mailto:mindmirror@karsens.com")}
          title="Contact"
        />

        {__DEV__ ? (
          <MenuItem onPress={() => null} title={JSON.stringify(device.user)} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = ({ device }) => {
  return { device };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const App2 = connect(mapStateToProps, mapDispatchToProps)(App);

export default App2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
