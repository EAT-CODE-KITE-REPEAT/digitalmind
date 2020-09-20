import { connectActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import moment from "moment";
import React from "react";
import {
  AppState,
  FlatList,
  Image,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Separator from "./Components/Separator";
import C from "./Constants";
import {
  ATTENDANCE_MAYBE,
  ATTENDANCE_NO,
  ATTENDANCE_YES,
  Device,
  Entry,
  User,
} from "./Store";

type Props = {
  navigation: any;
  entries: Entry[];
  token: number;
  dispatch: Dispatch;
  user: User;
};
class App extends React.Component<Props> {
  state = { loading: false, appState: AppState.currentState };
  componentDidMount() {
    this.sendPushtoken();
    this.fetchUser();
    this.fetchEntries();

    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.fetchEntries();
      this.fetchUser();
    }
    this.setState({ appState: nextAppState });
  };

  renderItem = ({ item, index }: { item: Entry; index: number }) => {
    const attending = item.participants?.filter(
      (x) => x.attendance === ATTENDANCE_YES
    );

    const maybe = item.participants?.filter(
      (x) => x.attendance === ATTENDANCE_MAYBE
    );

    const not = item.participants?.filter(
      (x) => x.attendance === ATTENDANCE_NO
    );

    return (
      <TouchableOpacity
        key={`key${index}`}
        style={{
          backgroundColor: "#FFF",
          margin: 10,
          borderRadius: 15,
        }}
        onPress={() => {
          //open action sheet

          const options = ["Wijzigen", "Delen", "Verwijderen", "Annuleren"];
          const destructiveButtonIndex = 2;
          const cancelButtonIndex = 3;

          const url = `https://bij.link/?id=${item?.id}`;
          const content = `${item?.description}\n\nKlik hier om je aanwezigheid aan te geven: \n\n${url}`;

          this.props.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex,
              destructiveButtonIndex,
            },
            (buttonIndex: number) => {
              if (buttonIndex === 0) {
                this.props.navigation.navigate("upsertEntry", { item });
              }
              if (buttonIndex === 1) {
                Share.share(
                  { title: item.title, message: content },
                  {
                    dialogTitle: "Delen",
                    subject: item.title,
                  }
                );
              }
              if (buttonIndex === 2) {
                this.props.dispatch({ type: "DELETE_ENTRY", value: item.id });

                this.deleteEntry(item.id);
              }
            }
          );
        }}
      >
        <View
          style={{
            margin: 15,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 32 }}>{item.title}</Text>
          <Text>
            Van: {moment(new Date(item.date)).format("DD MMM YYYY HH:mm")}
          </Text>
          <Text>
            Tot: {moment(new Date(item.endDate)).format("DD MMM YYYY HH:mm")}
          </Text>
        </View>

        {item.description ? (
          <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
            <Text style={{ fontStyle: "italic" }}>{item.description}</Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>
              Aanwezig ({attending?.length || 0})
            </Text>
            {attending?.map((participant, index) => (
              <Text key={`key${index}`}>{participant.name}</Text>
            ))}
          </View>

          <View>
            <Text style={{ fontWeight: "bold" }}>
              Misschien ({maybe?.length || 0})
            </Text>
            {maybe?.map((participant) => (
              <Text>{participant.name}</Text>
            ))}
          </View>

          <View>
            <Text style={{ fontWeight: "bold" }}>
              Afwezig ({not?.length || 0})
            </Text>
            {not?.map((participant) => (
              <Text>{participant.name}</Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  sendPushtoken = async () => {
    const { user } = this.props;

    let pushtoken;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      pushtoken = (await Notifications.getExpoPushTokenAsync()).data;

      // console.log("new pushtoken", pushtoken, "user.pushtoken", user.pushtoken);

      if (user.pushtoken !== pushtoken) {
        fetch(`${C.SERVER_ADDR}/updateProfile`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: this.props.token, pushtoken }),
        })
          .then((response) => response.json())
          .then(async (response) => {
            console.log("RESPONSE", response);

            if (response) {
              this.fetchUser();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  fetchUser() {
    const { token, dispatch } = this.props;

    const url = `${C.SERVER_ADDR}/me?token=${token}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (response) => {
        dispatch({ type: "SET_USER", value: response });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteEntry(id: number) {
    const { token } = this.props;

    const url = `${C.SERVER_ADDR}/deleteEntry`;

    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        id,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        console.log("delete action success");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  fetchEntries() {
    const { token, dispatch } = this.props;

    this.setState({ loading: true });
    const url = `${C.SERVER_ADDR}/entries?token=${token}`;

    return fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (response) => {
        dispatch({ type: "SET_ENTRIES", value: response });
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderGear = () => (
    <View style={{ alignItems: "flex-end", marginHorizontal: 15 }}>
      <TouchableOpacity onPress={() => this.props.navigation.navigate("more")}>
        <FontAwesome name="gear" size={20} />
      </TouchableOpacity>
    </View>
  );

  renderPlusButton = () => (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate("upsertEntry")}
      hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
      style={{
        position: "absolute",
        alignSelf: "center",
        bottom: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellow",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <FontAwesome
        name="plus"
        color="#000"
        size={25}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}
      />
    </TouchableOpacity>
  );

  render() {
    const { entries } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {this.renderGear()}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", marginHorizontal: 15 }}>
            Agenda
          </Text>
          {entries?.length > 0 ? (
            <FlatList
              refreshing={this.state.loading}
              onRefresh={() => this.fetchEntries()}
              data={entries}
              renderItem={this.renderItem}
              ItemSeparatorComponent={Separator}
              ListFooterComponent={<View style={{ height: 80 }} />}
              keyExtractor={(item, index) => `item${item.id}`}
            />
          ) : (
            <View
              style={{
                margin: 15,
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text style={{ margin: 20, textAlign: "center" }}>
                Geen entries om weer te geven. Klik op de gele knop om er 1 aan
                te maken.
              </Text>
              <Image
                source={require("./assets/empty.gif")}
                style={{ borderRadius: 200 }}
              />
            </View>
          )}
        </View>
        {this.renderPlusButton()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ device }: { device: Device }) => {
  return {
    user: device.user,
    token: device.loginToken,
    entries: device.entries,
  };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectActionSheet(App));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
  },
});
