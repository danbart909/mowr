import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Column, Center, Factory, FlatList, FormControl, Heading, Input, Modal, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { doc, setDoc } from 'firebase/firestore'
import Constants from 'expo-constants'
import { getCurrentPositionAsync, geocodeAsync, getForegroundPermissionsAsync } from 'expo-location'
import Geocoder from 'react-native-geocoding'
import MapView, { Marker } from 'react-native-maps'
import axios from 'react-native-axios'
import Gradient from '../config/gradient'

const { civicAPIKey, mapAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

const Icon = (props) => {
  const FAIcon = Factory(FontAwesomeIcon)
  return <FAIcon {...props} />
}

export default class Address extends Component {
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
    }
  }

  static contextType = Context

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
        justifyContent='space-evenly'
        alignItems='center'
      >
        { html }
      </Row>
    )
  }

  errorMessageOrButton = () => {
    let { user } = this.context
    let { error } = this.state
    let html = []

    if (error === 0) {
      html = <Button
      variant={user.address ? 'solid' : 'disabled'}
      bg={user.address ? 'primary.1' : 'white'}
      mt={wp(2)}
      w={wp(60)}
      borderWidth={user.address ? null : '1'}
      onPress={() => user.address ? this.finish() : alert('Please Enter an Address')}
    >
      <Text color={user.address ? 'white' : 'coolGray.400'} >
        Continue to Mowr Homepage
      </Text>
    </Button>
    } if (error === 1) {
      html = <Center mt={wp(4)} mb={wp(2)}><Text color='error.700'>Error Saving Address to Profile, Please Try Again</Text></Center>
    } if (error === 2) {
      html = <Center mt={wp(4)} mb={wp(2)}><Text color='error.700'>No Address Received From Server, Please Try Again</Text></Center>
    } if (error === 3) {
      html = <Center mt={wp(4)} mb={wp(2)}><Text color='error.700'>Please Grant Location Permissions to Mowr to Proceed</Text></Center>
    } if (error === 4) {
      html = <Center mt={wp(4)} mb={wp(2)}><Text color='error.700'>Address Not Recognized or Another Error Occurred</Text></Center>
    }

    return html
  }

  finish = async () => {
    await this.props.setView('Login')
    this.context.navigation.navigate('Home')
  }

  render() {

    let { user } = this.context
    let { address, autoResults, autoShow, latitude, longitude } = this.state

    return (
      <>
        <Gradient
          position='absolute'
          h='90%'
          w='85%'
          borderWidth='3'
          borderColor='primary.1'
        />

        <Stack
          h='90%'
          w='85%'
          alignItems='center'
        >
  
          <Stack
            px={wp(3)}
            space={wp(3)}
            mb={wp(5)}
            // borderWidth='1'
          >
  
            <Heading pt={wp(5)} textAlign='center'>Enter Your Address</Heading>
  
            <Row
              // w='100%'
              justifyContent='space-between'
              alignItems='flex-start'
              // borderWidth='1'
            >
              <Box flex='4'>
                <Text>Your saved address:</Text>
              </Box>
              <Box flex='7'>
                <Text textAlign='right'>{user.address ? user.address.replace(/([,][\s])/, `\n`) : 'No Address Saved'}</Text>
              </Box>
            </Row>
  
              <Box>
                <Text pb={wp(1)}>Address:</Text>
                <Input
                  w={wp(78)}
                  bg='white'
                  alignSelf='center'
                  onChangeText={(x) => this.changeInputByTyping(x)}
                  value={address}
                />
              </Box>
  
            {this.buttons()}
  
            <Center>
              {this.errorMessageOrButton()}
            </Center>
  
          </Stack>
  
          <ScrollView>
            <MapView
              style={{ height: hp(42), width: wp(84) }}
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
          </ScrollView>
  
          { autoShow &&
          <Box
            position='absolute'
            h={hp(100)}
            w={wp(100)}
            mt={wp(-7)}
            zIndex='5'
            onStartShouldSetResponder={() => this.setState({ autoShow: false })}
          >
            <Box
              position='absolute'
              top={user.address ? hp(24.5) : hp(22)}
              left={wp(11)}
              w={wp(70)}
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
  
        </Stack>
      </>
    )
  }
}