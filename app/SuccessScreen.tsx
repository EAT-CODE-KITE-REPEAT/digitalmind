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
import { Entry } from "./Store";

type Props = {
  route: any;
  navigation: any;
};
class SuccessScreen extends React.Component<Props> {
  render() {
    const {
      route: { params },
      navigation,
    } = this.props;

    const entry: Entry = params?.entry;

    const url = `https://mindmirror.co/?id=${entry?.id}`;
    const content = `${entry?.description}\n\n${url}`;
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
              { title: entry?.title, message: content },
              {
                dialogTitle: "Delen",
                subject: entry?.title,
              }
            )
          }
        />
      </View>
    );
  }
}

export default SuccessScreen;
