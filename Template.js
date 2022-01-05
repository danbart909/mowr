import React, { Component } from 'react'
// import Context from './context/Context.js'
import { Box, Button, Center, Heading, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'

export default class Template extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {
    return (
      <Box>

        <Text>Template</Text>

      </Box>
    )
  }
}

// export default function Template() {
//   return (
//     <Box>

//       <Text>Template</Text>

//     </Box>
//   )
// }