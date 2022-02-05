import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Divider, Heading, Row, FlatList, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as dFNS from 'date-fns'

export default class JobView extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static contextType = Context

  render() {

    let { job } = this.context
    let list = [
      // { x: 'Type', y: job.type },
      { x: 'Title', y: job.title },
      { x: 'Name', y: job.userName },
      { x: 'Description', y: job.description },
      { x: 'Tip', y: job.tip },
      { x: 'Address', y: job.address.replace(/([,][\s])/, `\n`) },
      { x: 'Email', y: job.email },
      { x: 'Phone', y: job.phone },
      { x: 'Creation Date', y: job.creationDate },
      { x: 'Deadline', y: job.endDate },
    ]

    return (
      <Center
        flex='1'
        bg='primary.1'
      >
        <Stack
          w='90%'
          space={wp(3)}
          my={wp(4)}
          px={wp(4)}
          bg='white'
          // borderWidth='1'
          borderRadius='20'
        >
          <FlatList
            data={list}
            keyExtractor={item => item.x}
            renderItem={({item}) => (
              <Box mt={wp(4)}>
                <Row
                  justifyContent='space-between'
                  mb={wp(4)}
                  // borderWidth='1'
                >
                  <Box flex='1'>
                    <Text>{item.x}</Text>
                  </Box>
                  <Box flex='5' pl={wp(2)}>
                    <Text fontSize={wp(3)}>{item.y}</Text>
                  </Box>
                </Row>
                <Divider />
              </Box>
            )}
          />
        </Stack>
      </Center>
    )
  }
}