import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import {Link} from "expo-router";
import { router } from 'expo-router';




const RestaurantCard = ({ info }) => {
    const { name, categories, image, id } = info;

    const handlePress = () => {
    router.push(`/snap/${id}`);
        };
    return (
        <Pressable onPress={handlePress}>
            <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Image style={styles.imageStyle} source={image} />
                <View style={styles.infoStyle}>
                <Text style={styles.titleStyle}>{name}</Text>
                <Text style={styles.categoryStyle}>{categories}</Text>
                </View>
            </View>
            </View>
        </Pressable>
    );
};

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;
const styles = StyleSheet.create({
  container: {
    width: deviceWidth - 20,
    alignItems: 'center',
    marginTop: 25,
  },
  cardContainer: {
    width: deviceWidth - offset,
    backgroundColor: '#fff',
    height: 200,
    borderRadius: radius,

    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    elevation: 9,
  },
  imageStyle: {
    height: 130,
    width: deviceWidth - offset,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: '800',
  },
  categoryStyle: {
    fontWeight: '200',
  },
  infoStyle: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
});

export default RestaurantCard;