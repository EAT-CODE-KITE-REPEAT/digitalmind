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
import DateTimeInput from "./Components/DateTimeInput";
import { PlusMinusInput } from "./Components/PlusMinusInput";
import Separator from "./Components/Separator";
import Constants from "./Constants";
import { Device, Event } from "./Store";

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
  maxParticipants: string;
  date: Date | null;
  endDate: Date | null;
};

class _UpsertEvent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const item: Event = this.props.route.params?.item;

    if (item) {
      this.state = {
        id: item.id,
        title: item.title,
        description: item.description,
        maxParticipants: String(item.maxParticipants),
        date: new Date(item.date),
        endDate: new Date(item.endDate),
      };
    } else {
      this.state = {
        title: "",
        description: "",
        maxParticipants: "0",
        date: null,
        endDate: null,
      };
    }
  }

  submit = () => {
    const {
      id,
      date,
      endDate,
      title,
      description,
      maxParticipants,
    } = this.state;

    const { dispatch, navigation, token } = this.props;

    const url = `${Constants.SERVER_ADDR}/upsertEvent`;

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
        maxParticipants,
        date,
        endDate,
      }),
    })
      .then((response) => response.json())
      .then(async ({ response }) => {
        if (id) {
          dispatch({ type: "UPDATE_EVENT", value: response });
          navigation.goBack();
        } else {
          dispatch({ type: "ADD_EVENT", value: response });

          navigation.dispatch(
            StackActions.replace("successScreen", {
              event: response,
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
          <DateTimeInput
            onChange={(date) => this.setState({ date })}
            placeholder="Begin datum/tijd"
            value={this.state.date}
          />
          <Separator />
          <DateTimeInput
            onChange={(date) => this.setState({ endDate: date })}
            placeholder="Eind datum/tijd"
            value={this.state.endDate}
          />
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

          <PlusMinusInput
            title="Max. aantal deelnemers"
            value={this.state.maxParticipants}
            onChange={(maxParticipants) => this.setState({ maxParticipants })}
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

const UpsertEvent = connect(mapStateToProps, mapDispatchToProps)(_UpsertEvent);

export default UpsertEvent;
