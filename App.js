import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  
  
  const [location, setLocation] = useState(null); // State where location is saved
  const [address, setAddress] = useState("Current location")
  const [coordinates, setCoordinates] = useState({
    coordinates: {
      latitude: 60.201373,
      longitude: 24.934041,
    },
    region: {
      latitude: 60.200692,
      longitude: 24.934302,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0221
    },
    marker: {
      title: "Current location"
    }
  })

  let query = {
    key: 'sF9p8uyAG1K3bh34AxL7ym3iDkS6Vixl',
    location: address,
    boundingBox: "70.311707,18.878964,59.705277,31.009365",
    maxResults: "1"
  }

  useEffect(() => (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(location);
      console.log('Location:', location)
      setCoordinates({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221
        },
        marker: {
          title: "Current location"
        }
      })
    })(), []);

 

  const getCoordinates = () => {
    console.log(address)
    console.log(`http://www.mapquestapi.com/geocoding/v1/address?key=${query.key}&location=${address}&maxResults=${query.maxResults}&boundingBox=${query.boundingBox}`)
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${query.key}&location=${address}&maxResults=${query.maxResults}&boundingBox=${query.boundingBox}`)
    .then(response => response.json())
    .then(responseJson => setCoordinates({
      coordinates: {
        latitude: responseJson.results[0].locations[0].latLng.lat,
        longitude: responseJson.results[0].locations[0].latLng.lng
      },
      region: {
        latitude: responseJson.results[0].locations[0].latLng.lat,
        longitude: responseJson.results[0].locations[0].latLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      },
      marker: {
        title: address
      }
    }))
    .then(console.log(coordinates))
  }


  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={coordinates.region}
      >
        <Marker
          coordinate={coordinates.coordinates}
          title={coordinates.marker.title}
        />
        
      </MapView>
      <View style={styles.search}>
      <TextInput style={{fontSize: 18, width: 200}} placeholder='keyword' 
          onChangeText={text => setAddress(text)} />
        <Button title="Find" onPress={getCoordinates} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    height: "100%"
  },
  map: {
    //flex: 1,
    width: "100%",
    height: "80%"
  },
  search: {
    //flex: 1,
    borderTopWidth: 10,
    borderColor: "#fff",
    width: "100%",
    height: "20%"
  }
});