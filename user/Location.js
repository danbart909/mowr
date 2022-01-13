import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Factory, FormControl, Heading, Input, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import { getCurrentPositionAsync, geocodeAsync, getForegroundPermissionsAsync } from 'expo-location'
import Geocoder from 'react-native-geocoding'
import MapView, { Marker } from 'react-native-maps'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      street: '1819 Tree Top Way',
      city: 'Marietta',
      state: 'Georgia',
      zip: '30062',
      busy: false,
      error: 0,
      latitude: 0,
      longitude: 0
    }
  }

  static contextType = Context

  componentDidMount() {
    let { user } = this.context

    user.latitude ? this.setState({ latitude: user.latitude, longitude: user.longitude }) : null
  }

  findCoordinatesUsingForm = async () => {
    let { street, city, state, zip } = this.state
    let address = `${street}, ${city}, ${state}, ${zip}`

    this.setState({ busy: true, error: 0 })

    let status = await getForegroundPermissionsAsync()
    if (status.granted) {
      await geocodeAsync(address)
      .then(x => {
        if (x.length === 0) {
          console.log('empty response', x)
          this.setState({ busy: false, error: 2 })
        } else {
          console.log('data received', x)
          this.setState({ latitude: x[0].latitude, longitude: x[0].longitude, busy: false, error: 0 }, () => this.saveAddress(address))
        }
      })
      .catch(e => this.setState({ busy: false, error: 4 }, () => console.log(e)))
    } else {
      console.log('permissions not granted, asking for permissions')
      let permission = await requestForegroundPermissionsAsync()
      if (permission.granted) {
        this.findCoordinatesUsingForm()
      } else {
        console.log('permissions not granted, no actions taken')
        this.setState({ busy: false, error: 3 })
      }
    }
  }

  findCoordinatesUsingGPS = async () => {
    this.setState({ busy: true, error: 0 })

    let status = await getForegroundPermissionsAsync()
    if (status.granted) {
      await getCurrentPositionAsync({ accuracy: 5 })
        .then(x => this.setState({ latitude: x.coords.latitude, longitude: x.coords.longitude, busy: false, error: 0 }, () => this.geocodeAddressFromGPS()))
        .catch(e => this.setState({ busy: false, error: 4 }, () => console.log(e)))
    } else {
      console.log('permissions not granted, asking for permissions')
      let permission = await requestForegroundPermissionsAsync()
      if (permission.granted) {
        this.findCoordinatesUsingGPS()
      } else {
        console.log('permissions not granted, no actions taken')
        this.setState({ busy: false, error: 3 })
      }
    }
  }

  saveAddress = async (address) => {
    let { db, user } = this.context
    let { latitude, longitude } = this.state
    
    this.setState({
      busy: true,
      error: 0
    })

    // update(ref(db, 'users/' + user.uid), {
    //   address: address,
    //   latitude: latitude,
    //   longitude: longitude
    // })
    //   .then(() => {
    //     try { this.context.refreshUser() } catch(e){console.log(e)}
    //     finally {
    //       this.setState({
    //         busy: false,
    //         error: 0
    //       }, () => console.log('Location', 'address updated', {address}))
    //     }
    //   })
    //   .catch((e) => {
    //     this.setState({
    //       busy: false,
    //       error: 1
    //     }, () => console.log('Location', 'error updating address', e))
    //   })
  }

  geocodeAddressFromGPS = async () => {
    Geocoder.from(this.state.latitude, this.state.longitude)
      .then(x => this.saveAddress(x.results[0].formatted_address))
      .catch(e => console.log(e))
  }

  buttons = () => {
    let html = []

    if (this.state.busy) {
      html = <Spinner size='lg'/>
    } else {
      html = <>
        <Button
          onPress={() => this.findCoordinatesUsingForm()}
        >Submit Form</Button>
        <Button
          onPress={() => this.findCoordinatesUsingGPS()}
        >Use GPS</Button>
      </>
    }

    return (
      <Row
        w='100%'
        mb={wp(2)}
        p={wp(2)}
        justifyContent='space-evenly'
        alignItems='center'
      >
        {html}
      </Row>
    )
  }

  errorMessage = () => {
    let { error } = this.state
    let html = []

    if (error === 0) {
      html = <></>
    } if (error === 1) {
      html = <Center mb={wp(3)}><Text color='error.700'>Error Saving Address to Profile, Please Try Again</Text></Center>
    } if (error === 2) {
      html = <Center mb={wp(3)}><Text color='error.700'>No Address Received From Server, Please Try Again</Text></Center>
    } if (error === 3) {
      html = <Center mb={wp(3)}><Text color='error.700'>Please Grant Location Permissions to Mowr to Proceed</Text></Center>
    } if (error === 4) {
      html = <Center mb={wp(3)}><Text color='error.700'>Address Not Recognized or Another Error Occurred</Text></Center>
    }

    return html
  }

  render() {

    let { user } = this.context
    let { street, city, state, zip, busy, error } = this.state

    return (
      <ScrollView>

        <Stack
          my={wp(3)}
          px={wp(3)}
          space={wp(2)}
        >

          <Row
            w='100%'
            justifyContent='space-between'
            alignItems='flex-start'
          >
            <Box flex='3'>
              <Text>Your address:</Text>
            </Box>
            <Box flex='7'>
              <Text textAlign='right'>{user.address ? user.address : 'No Address Saved'}</Text>
            </Box>
          </Row>

          <FormControl>
            <FormControl.Label pb='5'>Street</FormControl.Label>
            <Input
              // w={wp(50)}
              bg='white'
              onChangeText={(x) => this.setState({ street: x })}
              value={street}
            />
          </FormControl>
  
          <FormControl>
            <FormControl.Label pb='5'>City</FormControl.Label>
            <Input
              // w={wp(50)}
              bg='white'
              onChangeText={(x) => this.setState({ city: x })}
              value={city}
            />
          </FormControl>
  
          <FormControl>
            <FormControl.Label pb='5'>State</FormControl.Label>
            <Input
              // w={wp(50)}
              bg='white'
              onChangeText={(x) => this.setState({ state: x })}
              value={state}
            />
          </FormControl>
  
          <FormControl>
            <FormControl.Label pb='5'>Zip</FormControl.Label>
            <Input
              // w={wp(50)}
              bg='white'
              onChangeText={(x) => this.setState({ zip: x })}
              value={zip}
            />
          </FormControl>

        </Stack>

        {this.buttons()}

        {this.errorMessage()}

        <MapView
          style={{ height: wp(75), width: '100%' }}
          scrollEnabled={false}
          // loadingEnabled
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
          />
        </MapView>

      </ScrollView>
    )
  }
}

































// import React, { Component } from 'react'
// import Context from '../../context/Context.js'
// import colors from '../../config/colors'
// import ss from '../../config/ss'
// import tx from '../../config/tx'
// import { TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native'
// import { Button, Divider, Input, Text } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import Constants from 'expo-constants'
// import * as LocationExpo from 'expo-location'
// import Geocoder from 'react-native-geocoding'
// import MapView, { Marker } from 'react-native-maps'
// import * as author from "firebase/auth"

// const { civicAPIKey } = Constants.manifest.extra
// Geocoder.init(civicAPIKey)

// export default class Location extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       hasLocationPermissions: false,
//       street: '1819 Tree Top Way',
//       city: 'Marietta',
//       state: 'GA',
//       zip: '30062',
//       busy: false,
//       error: false,
//       latitude: 0,
//       longitude: 0
//     }
//   }

//   static contextType = Context

//   findCoordinatesUsingForm = async () => {
//     let { street, city, state, zip } = this.state

//     let address = `${street}, ${city}, ${state}, ${zip}`

//     await geocodeAsync(address)
//       .then(x => this.setState({ latitude: x[0].latitude, longitude: x[0].longitude }, () => this.saveAddress(address)))
//       .catch(e => console.log(e))
//   }

//   findCoordinatesUsingGPS = async () => {
//     let status = await getForegroundPermissionsAsync();
//     if (status.granted) {
//       await getCurrentPositionAsync({ accuracy: 5 })
//         .then(x => this.setState({ latitude: x.coords.latitude, longitude: x.coords.longitude }, () => this.geocodeAddressFromGPS()))
//         .catch(e => console.log(e))
//     } else {
//       console.log('permissions not granted, asking for permissions')
//       let permission = await requestForegroundPermissionsAsync();
//       if (permission.granted) {
//         await getCurrentPositionAsync({ accuracy: 5 })
//           .then(x => this.setState({latitude: x.coords.latitude, longitude: x.coords.longitude }, () => this.geocodeAddressFromGPS()))
//           .catch(e => console.log(e))
//       } else {
//         console.log('permissions not granted, no actions taken')
//       }
//     }
//   }

//   saveAddress = async (address) => {
//     let { db, user } = this.context
//     let { latitude, longitude } = this.state
    
//     this.setState({
//       busy: true,
//       error: false
//     })

//     update(ref(db, 'users/' + user.uid), {
//       address: address,
//       latitude: latitude,
//       longitude: longitude
//     })
//       .then(() => {
//         try { this.context.refresh() } catch(e){console.log(e)}
//         finally {
//           this.setState({
//             busy: false,
//             error: false
//           }, () => console.log('Location', 'address updated', {address}))
//         }
//       })
//       .catch((e) => {
//         this.setState({
//           busy: false,
//           error: true
//         }, () => console.log('Location', 'error updating address', e))
//       })
//   }

//   geocodeAddressFromGPS = async () => {
//     Geocoder.from(this.state.latitude, this.state.longitude)
//       .then(x => this.saveAddress(x.results[0].formatted_address))
//       .catch(e => console.log(e))

//       // this.setState({ busy: false, error: true })
//   }

//   render() {

//     let { user } = this.context

//     return (
//       <View style={ss.container}>
//         <ScrollView contentContainerStyle={styles.mainBox}>

//           <Text style={tx.BMC}>Your address: {user.address ? user.address : 'No Address Saved'}</Text>

//           <View style={styles.addressForm}>
//             <TextInput
//               style={styles.textInputStyle}
//               placeholder="Street"
//               value={this.state.street}
//               onChangeText={(x) => this.setState({ street: x })}
//             />
//             <TextInput
//               style={styles.textInputStyle}
//               placeholder="City"
//               value={this.state.city}
//               onChangeText={(x) => this.setState({ city: x })}
//             />
//             <TextInput
//               style={styles.textInputStyle}
//               placeholder="State"
//               value={this.state.state}
//               onChangeText={(x) => this.setState({ state: x })}
//             />
//             {/* <TextInput
//               style={ss.textInputStyle}
//               placeholder="Zip Code"
//               value={this.state.zip}
//               onChangeText={(x) => this.setState({ zip: x })}
//             /> */}
//             <Input
//               placeholder='ZIP'
//               leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
//               value={this.state.zip}
//               onChangeText={(x) => this.setState({ zip: x })}
//             />
//           </View>

//           <View style={ss.buttonRow}>
//             <TouchableOpacity
//               style={ss.button}
//               onPress={() => this.findCoordinatesUsingForm()}
//             >
//               <Text style={tx.WMC}>Find Coordinates Using Form</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={ss.button}
//               onPress={() => this.findCoordinatesUsingGPS()}
//             >
//               <Text style={tx.WMC}>Find Coordinates Using GPS</Text>
//             </TouchableOpacity>
//           </View>

//           <MapView
//             style={styles.map}
//             scrollEnabled={false}
//             loadingEnabled={true}
//             region={{
//               latitude: this.state.latitude,
//               longitude: this.state.longitude,
//               latitudeDelta: 0.01,
//               longitudeDelta: 0.01,
//             }}
//           >
//             <Marker
//               coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
//             />
//           </MapView>

//         </ScrollView>
//       </View>
//     )
//   }
// }