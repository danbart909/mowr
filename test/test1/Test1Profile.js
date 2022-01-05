import React, { Component } from 'react'
import Context from '../../context/Context.js'
import { StatusBar } from 'react-native'
import { Box, Button, Center, FormControl, Heading, Input, Row, Modal, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendarAlt, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import * as database from 'firebase/database'

export default class Test1Profile extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {

    let { user } = this.context

    return (
      <Center>

        <Stack w={wp(95)}
          h={hp(90)}
          space={wp(5)}
          alignItems='center'
          // justifyContent='center'
          // borderWidth='1'
        >

          <Stack
            h={wp(80)}
            justifyContent='center'
            alignItems='center'
            // borderWidth='1'
          >
            <Text fontSize={wp(20)} textAlign='center'>{user.displayName}</Text>
          </Stack>

          <Stack
            w={wp(85)}
            p={wp(2)}
            space={wp(1)}
            borderRadius='12'
            borderWidth='1'
          >
            <Row w='100%' justifyContent='space-between'>
              <Row space={wp(2)} alignItems='center'>
                <FontAwesomeIcon icon={faEnvelope}/>
                <Text fontSize={wp(2.5)}>Email</Text>
              </Row>
              <Text underline fontSize={wp(2)} color='green.600'>Press Here to Edit</Text>
            </Row>
            <Text fontSize={wp(3)} alignSelf='flex-end'>{user.email}</Text>
          </Stack>

          <Stack
            w={wp(85)}
            p={wp(2)}
            space={wp(1)}
            borderRadius='12'
            borderWidth='1'
          >
            <Row w='100%' justifyContent='space-between'>
              <Row space={wp(2)} alignItems='center'>
                <FontAwesomeIcon icon={faPhone}/>
                <Text fontSize={wp(2.5)}>Phone Number</Text>
              </Row>
              <Text underline fontSize={wp(2)} color='green.600'>Press Here to Edit</Text>
            </Row>
            <Text fontSize={wp(3)} alignSelf='flex-end'>{user.phoneNumber}</Text>
          </Stack>

          <Stack
            w={wp(85)}
            p={wp(2)}
            space={wp(1)}
            borderRadius='12'
            borderWidth='1'
          >
            <Row w='100%' justifyContent='space-between'>
              <Row space={wp(2)} alignItems='center'>
                <FontAwesomeIcon icon={faMapMarkerAlt}/>
                <Text fontSize={wp(2.5)}>Address</Text>
              </Row>
              <Text underline fontSize={wp(2)} color='green.600'>Press Here to Edit</Text>
            </Row>
            <Text fontSize={wp(3)} alignSelf='flex-end'>{user.address ? user.address.replace(/([,][\s])/, `\n`) : 'No Address Saved!'}</Text>
          </Stack>

        </Stack>

      </Center>
    )
  }
}