import { StackActions } from "@react-navigation/native";
import React from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { connect } from "react-redux";
import Constants from "./Constants";
import { Device, Entry } from "./Store";

type Props = {
  navigation: any;
  route: any;
  dispatch: ({ type, value }: { type: string; value: any }) => void;
  token: string;
};
type State = {
  id?: number;
  title: string;
  description: string;
};

class _UpsertEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const item: Entry = this.props.route.params?.item;

    if (item) {
      this.state = {
        id: item.id,
        title: item.title,
        description: item.description,
      };
    } else {
      this.state = {
        title: "",
        description: "",
      };
    }
  }

  submit = () => {
    const { id, title, description } = this.state;

    const { dispatch, navigation, token } = this.props;

    const url = `${Constants.SERVER_ADDR}/upsertEntry`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        token,
        title,
        description,
      }),
    })
      .then((response) => response.json())
      .then(async ({ response }) => {
        if (id) {
          dispatch({ type: "UPDATE_ENTRY", value: response });
          navigation.goBack();
        } else {
          dispatch({ type: "ADD_ENTRY", value: response });

          navigation.dispatch(
            StackActions.replace("successScreen", {
              entry: response,
            })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Titel"
            value={this.state.title}
            onChangeText={(value) => this.setState({ title: value })}
            style={{
              width: "100%",
              fontSize: 20,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: "#000",
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: "#000",
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          />

          <TextInput
            placeholder="Beschrijving"
            value={this.state.description}
            multiline
            onChangeText={(value) => this.setState({ description: value })}
            style={{
              width: "100%",
              height: 100,
              fontSize: 20,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: "#000",
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          />

          <Button title="Aanmaken" onPress={() => this.submit()} />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ device }: { device: Device }) => {
  return { token: device.loginToken };
}; //
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const UpsertEntry = connect(mapStateToProps, mapDispatchToProps)(_UpsertEntry);

export default UpsertEntry;
