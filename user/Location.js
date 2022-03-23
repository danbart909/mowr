import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Factory, FlatList, Heading, Input, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { doc, setDoc } from 'firebase/firestore'
import Constants from 'expo-constants'
import { getCurrentPositionAsync, geocodeAsync, getForegroundPermissionsAsync } from 'expo-location'
import Geocoder from 'react-native-geocoding'
import MapView, { Marker } from 'react-native-maps'
import axios from 'react-native-axios'
import { Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { civicAPIKey, mapAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

const Icon = (props) => {
  const FAIcon = Factory(FontAwesomeIcon)
  return <FAIcon {...props} />
}

export default class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      autoResults: [],
      autoShow: false,
      busy: false,
      error: 0,
      latitude: 0,
      longitude: 0,
      autocmpltY: 0,
      autocmpltX: 0
    }
  }

  static contextType = Context

  componentDidMount () {
    let { user } = this.context

    user.latitude && this.setState({ latitude: user.latitude, longitude: user.longitude })
  }
    
  componentWillUnmount () {
  }

  findCoordinatesUsingForm = async () => {
    let { address } = this.state

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
          this.setState({ latitude: x[0].latitude, longitude: x[0].longitude, busy: false, error: 0 }, () => this.saveAddress(address, x[0].latitude, x[0].longitude))
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
        .then(x => this.setState({ latitude: x.coords.latitude, longitude: x.coords.longitude, busy: false, error: 0 }, async () => {
          Geocoder.from(x.coords.latitude, x.coords.longitude)
            .then(x => this.saveAddress(x.results[0].formatted_address, x.coords.latitude, x.coords.longitude))
            .catch(e => console.log(e))
        }))
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

  searchLocationForAutofill = async () => {
    axios.request({
      method: 'post',
      url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${mapAPIKey}&input=${this.state.address}&components=country:us`,
    })
    .then((res) => {
      let results = []
      res.data.predictions.map(x => results.push(x.description.slice(0, -5)))
      this.setState({ autoResults: results })
      })
    .catch((e) => {
      console.log('Location.js - searchLocation() error', e.response)
    });
  }

  saveAddress = async (address, latitude, longitude) => {
    let { fire, user } = this.context
    
    this.setState({
      busy: true,
      error: 0
    })

    await setDoc(doc(fire, 'users', user.uid), {
      address: address,
      latitude: latitude,
      longitude: longitude
    }, { merge: true })
      .then(() => {
        alert('Your Address Has Been Saved.')
        try { this.context.refresh() } catch(e){console.log(e)}
        finally {
          this.setState({
            busy: false,
            error: 0
          }, () => console.log('Location', 'address updated', address, latitude, longitude))
        }
      })
      .catch((e) => {
        this.setState({
          busy: false,
          error: 1
        }, () => console.log('Location', 'error updating address', e))
      })
  }

  changeInputByTyping = (x) => {
    let { address, autoShow } = this.state
    if (!autoShow && address.length >= 5) {
      this.setState({ address: x, autoShow: true })
      this.searchLocationForAutofill()
    } else if (autoShow && address.length <= 4) {
      this.setState({ address: x, autoShow: false })
    } else if (autoShow) {
      this.setState({ address: x })
      this.searchLocationForAutofill()
    } else {
      this.setState({ address: x })
    }
  }

  changeInputByPressing = (x) => {
    this.setState({ address: x, autoShow: false })
  }

  buttons = () => {
    let html = []

    if (this.state.busy) {
      html = <Spinner my={wp(1.29)} size='lg'/>
    } else {
      html = <>
        <Button
          onPress={() => this.state.address ? this.findCoordinatesUsingForm() : alert('Please Enter an Address')}
        >Save Address</Button>
        <Button
          leftIcon={
            <Icon
              icon={faMapMarkerAlt}
              color='white'
              mr={wp(2)}
            />
          }
          onPress={() => this.findCoordinatesUsingGPS()}
        >Use GPS</Button>
      </>
    }

    return (
      <Row
        w='100%'
        pt={wp(2)}
        justifyContent='space-evenly'
        alignItems='center'
      >
        { html }
      </Row>
    )
  }

  errorMessage = () => {
    let { error } = this.state
    let html = []

    error === 1 ? html = <Text color='error.700'>Error Saving Address to Profile, Please Try Again</Text> :
    error === 2 ? html = <Text color='error.700'>Error Communicating with Server, Please Try Again</Text> :
    error === 3 ? html = <Text color='error.700'>Please Grant Location Permissions to Mowr to Proceed</Text> :
    error === 4 ? html = <Text color='error.700'>Address Not Recognized or Another Error Occurred</Text> : <></>

    if (error === 0) {
      return <></>
    } else {
      return (
        <Box
          position='absolute'
          h='8%'
          w='100%'
          mt={hp(29)}
          alignSelf='center'
          justifyContent='center'
          alignItems='center'
          borderWidth='3'
          borderColor='primary.1'
        >
          <LinearGradient
              colors={['#289d15', '#ffffff']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            >{html}</LinearGradient>
        </Box>
      )
    }
  }

  render() {

    let { user } = this.context
    let { address, autoResults, autoShow, latitude, longitude, autocmpltY, autocmpltX } = this.state

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Box
          flex='1'
          justifyContent='flex-start'
          // p={wp(5)}
          // bg='primary.1'
        >
          <Box>
            <LinearGradient
              colors={['#289d15', '#ffffff']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <Row
                w='100%'
                mt={wp(4)}
                px={wp(4)}
                pb={wp(3)}
                justifyContent='space-between'
                alignItems='flex-start'
                onLayout={(e) => this.setState({ autocmpltY: autocmpltY+e.nativeEvent.layout.y, autocmpltX: autocmpltX+e.nativeEvent.layout.x })}
              >
                <Box flex='4'>
                  <Text>Your saved address:</Text>
                </Box>
                <Box flex='7'>
                  <Text textAlign='right'>{user.address ? user.address.replace(/([,][\s])/, `\n`) : 'No Address Saved'}</Text>
                </Box>
              </Row>

              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Box mt={wp(5)} onLayout={(e) => this.setState({ autocmpltY: autocmpltY+e.nativeEvent.layout.y, autocmpltX: autocmpltX+e.nativeEvent.layout.x })}>
                  <Text
                    pb={wp(1)}
                    px={wp(4)}
                    onPress={() => console.log(StatusBar.currentHeight)}
                  >Address:</Text>
                  <Input
                    // autoFocus
                    w={wp(80)}
                    bg='white'
                    alignSelf='center'
                    onLayout={(e) => this.setState({ autocmpltY: autocmpltY+e.nativeEvent.layout.y, autocmpltX: autocmpltX+e.nativeEvent.layout.x })}
                    fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                    onEndEditing={() => Keyboard.dismiss()}
                    onChangeText={(x) => this.changeInputByTyping(x)}
                    value={address}
                  />
                </Box>
              </KeyboardAvoidingView>
    
              <Box mt={wp(5)}>{this.buttons()}</Box>
    
              <Box mt={wp(5)}>{this.errorMessage()}</Box>
            </LinearGradient>
          </Box>
    
          <Box>
            <MapView
              style={{ height: wp(75), width: '100%' }}
              scrollEnabled={false}
              // loadingEnabled
              region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: latitude, longitude: longitude }}
              />
            </MapView>
          </Box>

        { autoShow &&
        <Box
          flex={1}
          position='absolute'
          h={hp(100)}
          w={wp(100)}
          zIndex='5'
          // borderWidth='1'
          onStartShouldSetResponder={() => this.setState({ autoShow: false })}
        >
          <Box
            position='absolute'
            top={autocmpltY}
            left={autocmpltX}
            w={wp(80)}
            h='auto'
            bg='white'
            // borderWidth='1'
            zIndex='10'
          >
            <FlatList
              data={autoResults}
              keyExtractor={y => y}
              renderItem={x => {
                return (
                  <Box
                    w='100%'
                    p='10'
                    borderBottomColor='gray.400'
                    borderBottomWidth='1'
                  >
                    <Text
                      w='100%'
                      onPress={() => this.changeInputByPressing(x.item)}
                    >
                      {x.item}
                    </Text>
                  </Box>
                )
              }}
            />
          </Box>
        </Box> }
        </Box>
      </TouchableWithoutFeedback>
    )
  }
}
