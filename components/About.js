import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, Row, Stack, Text } from 'native-base'
import { ActivityIndicator, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'

export default class About extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {
    return (
      <Center flex='1'>

        <Text>About</Text>

      </Center>
    )
  }
}