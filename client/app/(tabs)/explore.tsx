import React, { useState, useEffect, useRef } from "react";
import {Link} from "expo-router";
import { StyleSheet, Text, View, StatusBar, FlatList } from 'react-native';


import Card from '../../components/RestaurantCard';

const restaurants = [
  {
    name: 'Local Boyz',
    categories: 'Hawaiian BBQ, Desserts, and Plate Lunches',
    image: require('../../assets/images/localboyz.jpeg'),
    id: 'e2fcrvPOJmyt4HET5Pnt',
  },
  {
    name: 'Bobahead',
    categories: 'Tea, Smoothies, and Snacks',
    image: require('../../assets/images/bobahead.jpg'),
    id: 'GdNBRYVuPnvN1EvHSu7K',
  },
  {
    name: 'Thai Chili',
    categories: 'Curries, Soups, and Salads',
    image: require('../../assets/images/thaichili.png'),
    id: 'sMYzSxkOVZI02LmYFRTs',
  },

];

const Explore = () => {
    return (
        <View style={styles.container}>
        {/* <Card /> */}
        <StatusBar barStyle="dark-content" />

        <FlatList
            data={restaurants}
            renderItem={({ item }) => {
            return <Card info={item} />;
            }}
            keyExtractor={(restaurant) => restaurant.id.toString()}
            showsVerticalScrollIndicator={false}
        />
        </View>
    );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default Explore;
        //    <Link href="/snap/e2fcrvPOJmyt4HET5Pnt">Local Boyz</Link>
        //     <Link href="/snap/GdNBRYVuPnvN1EvHSu7K">Bobahead</Link>