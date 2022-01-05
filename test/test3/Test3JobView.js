import React, { Component } from 'react'
import Context from '../../context/Context.js'
import { Box, Button, Center, Heading, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as dFNS from 'date-fns'

export default class Test3JobView extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {

    let job = {
      'ID': 'testID23432',
      'address': '1234 Address St., Town, ST 99999',
      'completed': false,
      'creationDate': '2021-10-18',
      'description': 'some description of the job goes here',
      'email': 'email@address.com',
      'endDate': '2021-12-29',
      'geo': {
        'lat': 33.9948414,
        'lng': -84.48495369999999
      },
      'key': '-MmJN-mTrcue2oP6g82u',
      'name': 'Donald Duck',
      'phone': '458-852-6254',
      'provider': 'XmC9HFgu8GTkMPz4ucQjkulbzG13',
      'tip': 15,
      'title': 'spaghetti',
      'type': 'Yardwork'
    }

    return (
      <Center>

        <Row>
          <Left>
            <Text>Type:</Text>
          </Left>
          <Right>
            <Text>{job.type}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Creation Date:</Text>
          </Left>
          <Right>
            <Text>{dFNS.format(new Date(job.creationDate), 'EEEE, PPP')}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Deadline:</Text>
          </Left>
          <Right>
            <Text>{dFNS.format(new Date(job.endDate), 'EEEE PPP')}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Title:</Text>
          </Left>
          <Right>
            <Text>{job.title}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Address:</Text>
          </Left>
          <Right>
            <Text>{job.address}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Tip:</Text>
          </Left>
          <Right>
            <Text>{job.tip}</Text>
          </Right>
        </Row>

        <Row minH={wp(20)}>
          <Left>
            <Text>Description:</Text>
          </Left>
          <Right>
            <Text>{job.description}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Phone:</Text>
          </Left>
          <Right>
            <Text>{job.phone}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Email:</Text>
          </Left>
          <Right>
            <Text>{job.email}</Text>
          </Right>
        </Row>

        <Row>
          <Left>
            <Text>Completion Status:</Text>
          </Left>
          <Right>
            <Text>{job.completed ? 'Completed' : 'Not Completed'}</Text>
          </Right>
        </Row>

      </Center>
    )
  }
}

const Row = (props) => {
  return (
    <Stack
      {...props}
      direction='row'
      w='100%'
      justifyContent='space-between'
      // borderWidth='1'
    />
  )
}

const Left = (props) => {
  return (
    <Box
      {...props}
      w='30%'
      p={wp(1)}
      borderWidth='1'
    />
  )
}

const Right = (props) => {
  return (
    <Box
      {...props}
      w='70%'
      p={wp(1)}
      borderWidth='1'
    />
  )
}