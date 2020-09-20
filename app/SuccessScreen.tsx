import * as Calendar from "expo-calendar";
import React from "react";
import {
  Alert,
  Button,
  Clipboard,
  Image,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Event } from "./Store";

type Props = {
  route: any;
  navigation: any;
};
class SuccessScreen extends React.Component<Props> {
  addToCalendar = async () => {
    const {
      route: { params },
    } = this.props;

    const event: Event = params?.event;

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendar = await Calendar.getDefaultCalendarAsync();

      Calendar.createEventAsync(calendar.id, {
        startDate: new Date(event.date),
        endDate: new Date(event.endDate),
        title: event.title,
        notes: event.description,
      });
    }

    //
  };
  render() {
    const {
      route: { params },
      navigation,
    } = this.props;

    const event: Event = params?.event;

    const url = `https://bij.link/?id=${event?.id}`;
    const content = `${event?.description}\n\nKlik hier om je aanwezigheid aan te geven: \n\n${url}`;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text>{`Je evenement is aangemaakt. Gefeliciteerd! 
        
Hier is je link:`}</Text>

        <TouchableOpacity
          style={{ marginBottom: 20 }}
          onPress={() => {
            Clipboard.setString(url);
            Alert.alert("Gekopieerd naar klembord");
          }}
        >
          <Text>{url}</Text>
        </TouchableOpacity>

        <Image
          source={require("./assets/success.gif")}
          style={{ borderRadius: 200 }}
        />
        <Button
          title="Deel"
          onPress={() =>
            Share.share(
              { title: event?.title, message: content },
              {
                dialogTitle: "Delen",
                subject: event?.title,
              }
            )
          }
        />

        <Button title="Toevoegen aan agenda" onPress={this.addToCalendar} />
      </View>
    );
  }
}

export default SuccessScreen;
