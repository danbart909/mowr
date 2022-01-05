import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, FlatList, Flex, Heading, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'
import * as dFNS from 'date-fns'

export default class ManageJobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      busy: false,
      error: false
    }
  }

  static contextType = Context

  componentDidMount() {
  }

  viewJob = async (x) => {
    await this.context.updateContext('job', x)
    this.context.navigation.navigate('User Job View')
  }

  renderList = () => {
    let { busy, error } = this.state
    let { userJobs } = this.context

    if (busy) {
      return (
        <Center flex='1'>
          <Spinner color='green.500'/>
        </Center>
      )
    }

    if (error) {
      return (
        <Center flex='1'>
          <Text>There was an error retrieving your jobs from the server.</Text>
        </Center>
      )
    }

    if (!userJobs.length) {
      return (
        <Center flex='1'>
          <Text>When you create a job, it will show up here.</Text>
        </Center>
      )
    }

    return (
      <FlatList
        data={userJobs}
        keyExtractor={item => item.ID}
        renderItem={({item}) => (
          <Stack
            mb={wp(10)}
            bg='white'
            borderWidth='1'
          >
            <Row
              justifyContent='space-between'
              alignItems='center'
              p={wp(2)}
              borderBottomWidth='1'
            >
              <Box flex='6'>
                <Text fontSize='2xl'>{item.title}</Text>
              </Box>
              <Flex>
                <Text fontSize='lg'>$ {item.tip}</Text>
              </Flex>
            </Row>
            <Row
              justifyContent='space-between'
              alignItems='center'
              p={wp(2)}
              borderBottomWidth='1'
            >
              <Flex>
                <Text fontSize='xs'>Type: {item.type}</Text>
              </Flex>
              <Flex>
                <Text fontSize='xs'>Status: {item.completed ? 'Completed' : 'Not Completed'}</Text>
              </Flex>
            </Row>
            <Box
              h={wp(40)}
              p={wp(2)}
              overflow='hidden'
              borderBottomWidth='1'
            >
              <Text
                // isTruncated
                // noOfLines={6}
                fontSize='xs'
              >{item.description}</Text>
            </Box>
            <Row
              justifyContent='space-between'
              alignItems='center'
              p={wp(2)}
              borderBottomWidth='1'
            >
              <Flex alignItems='flex-start'>
                <Text fontSize='xs'>Created {dFNS.formatDistance(new Date(item.creationDate), new Date(), { addSuffix: true })}</Text>
                <Text>{dFNS.format(new Date(item.creationDate), 'EEEE, PPP')}</Text>
              </Flex>
              <Flex alignItems='flex-end'>
                <Text fontSize='xs'>Ending {dFNS.formatDistance(new Date(item.endDate), new Date(), { addSuffix: true })}</Text>
                <Text>{dFNS.format(new Date(item.endDate), 'EEEE, PPP')}</Text>
              </Flex>
            </Row>
            <Center>
              <Button
                my={wp(1.5)}
                onPress={() => this.viewJob(item)}
              >
                VIEW JOB
              </Button>
            </Center>
          </Stack>
        )}
      />
    )
  }

  render() {
    return (
      <Box bg='green.600'>

        {this.renderList()}

      </Box>
    )
  }
}