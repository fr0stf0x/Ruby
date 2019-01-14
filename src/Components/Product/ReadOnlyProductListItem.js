import React from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./productStyles";

const ReadOnlyProductListItem = ({ detail, status, index }) => {
  return (
    <View style={styles(index, status.available).listItem}>
      <View style={styles().imageContainer}>
        <Image
          source={{ uri: detail.imageUrl }}
          resizeMode="cover"
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View style={styles().infoAndActions}>
        <View style={styles().info}>
          <Text style={styles().listItemTitle}>{detail.name}</Text>
          <Text>{detail.type}</Text>
          <Text>
            Giá:
            {" " + (status.price.current || status.price.default).toString()}
          </Text>
        </View>
        <View style={styles().actions}>
          <Icon name="ios-arrow-forward" size={24} />
        </View>
      </View>
    </View>
  );
};

export default ReadOnlyProductListItem;