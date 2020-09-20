import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import * as React from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Popup from "./Popup";

interface Props {
  value: Date | null;

  placeholder: string;
  onChange: (date: Date) => void;
}

interface State {
  showModal: boolean;
}
class DateTimeInput extends React.Component<Props, State> {
  state = {
    showModal: false,
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  renderModal = () => {
    const { value, onChange, placeholder } = this.props;
    const dateTimePicker = this.state.showModal ? (
      <DateTimePicker
        mode="datetime"
        locale="nl-NL"
        minuteInterval={15}
        value={value ? value : new Date()}
        onChange={(event, date) => {
          onChange(date);
          if (Platform.OS === "android") {
            this.toggleModal();
          }
        }}
      />
    ) : null;

    return Platform.OS === "android" ? (
      dateTimePicker
    ) : (
      <Popup
        visible={this.state.showModal}
        title={placeholder}
        onClose={this.toggleModal}
      >
        {dateTimePicker}

        <Button onPress={this.toggleModal} title="Ok" />
      </Popup>
    );
  };

  render() {
    const { onChange, value, placeholder } = this.props;

    return (
      <>
        <View
          style={{
            backgroundColor: "#FFF",
          }}
        >
          <TouchableOpacity
            style={{
              borderRightColor: "#CCC",
              borderRightWidth: StyleSheet.hairlineWidth,
              padding: 15,
            }}
            onPress={() => {
              this.toggleModal();
              // set it to now if you click it
              if (!value) {
                onChange(new Date(Date.now()));
              }
            }}
          >
            <Text style={{ color: "#000" }}>
              {value ? moment(value).format("DD MMM YYYY HH:mm") : placeholder}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
      </>
    );
  }
}

export default DateTimeInput;
