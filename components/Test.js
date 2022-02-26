import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, FlatList, Input, Text, ScrollView, Select, Spinner, Stack, Row, Switch } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Gradient from '../config/gradient'
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

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  static contextType = Context

  renderTexts = () => {
    let fonts = [
      'Karla',
      // 'Rubik',
      // 'Nunito',
      // 'Mulish',
      'Heebo',
      // 'Hahmlet',
      // 'Arimo',
      'Titillium',
      'SourceSansPro',
      'Roboto',
      'PTSans',
      'NotoSans',
      'Mukta',
      'FiraSans',
      'Lato'
    ]
    let html = []

    fonts.map(x => {
      html.push(<Center key={x} my={wp(2)}>
        <Text fontFamily={x}>{x}</Text>
        <Text fontFamily={x}>You can make it you can make it! Just eight more seconds! Powerslide! Shake the coconut with Thursday inside and you stop hitting me where are all these dam workers coming from? Wow Magneto! Even that tanker was intimidated by my crocs.</Text>
      </Center>)
    })

    return html
  }

  render() {
    
    let { zip, geo, job } = this.context
    let { sortBy, sortType, sortDirection, busy, error } = this.state

    return (
      <ScrollView>
        {this.renderTexts()}
      </ScrollView>
    )
  }
}