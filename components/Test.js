import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, Factory, FlatList, Input, Modal, ScrollView, Spinner, Text, Select, Stack, Row, Switch } from 'native-base'
import { Animated, View, Pressable, Platform, Keyboard, KeyboardAvoidingView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import {  } from '../config/helper.js'
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
// import Constants from 'expo-constants'
// import Geocoder from 'react-native-geocoding'
// import MapView, { Marker } from 'react-native-maps'
// import { getDistance } from 'geolib'
// import { format } from 'date-fns'
// import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore'

// const { civicAPIKey } = Constants.manifest.extra
// Geocoder.init(civicAPIKey)

const AnimBox = (props) => {
  const NewBox = Factory(Animated.View)
  return <NewBox {...props} />
}

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: true
    }
  }

  static contextType = Context

  render() {
    
    let { zip, geo, job } = this.context
    let { sortBy, sortType, sortDirection, busy, error } = this.state

    return (
      <ScrollView bg='primary.1'>
        <WText>Test page</WText>
      </ScrollView>
    )
  }
}

let WText = (props) => {
  return <Text color='white' {...props}>{props.children}</Text>
}












  // renderTexts = () => {
  //   let fonts = [
  //     // 'Roboto',
  //     // 'Karla',
  //     // 'SourceSansPro',
  //     // 'NotoSans',
  //     // 'Mukta',
  //     // 'Lato'
  //   ]
  //   let html = []

  //   fonts.map(x => {
  //     html.push(<Stack
  //         key={x}
  //         my={wp(4)}
  //         space={wp(3)}
  //         alignItems='center'
  //         borderWidth='2'
  //       >
  //       <WText fontFamily={x}>{x}</WText>
  //       <WText fontFamily={x} fontSize={wp(9)}>HEADER BASEJUMPING</WText>
  //       <WText fontFamily={x} fontSize={wp(7)}>Title Friendship Burrito</WText>
  //       <WText fontFamily={x}>You can make it you can make it! Just eight more seconds! Powerslide! Shake the coconut with Thursday inside and you stop hitting me where are all these dam workers coming from? Wow Magneto! Even that tanker was intimidated by my crocs.</WText>
  //       <Button
  //         onPress={() => console.log('press')}
  //         _text={{ fontFamily: x }}
  //       >This is a Button</Button>
  //     </Stack>)
  //   })

  //   return html
  // }