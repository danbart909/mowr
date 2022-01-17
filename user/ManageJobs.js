import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, FlatList, Flex, Heading, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

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
    this.context.refreshUserJobs()
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

    if (userJobs.length === 0) {
      return (
        <Center flex='1'>
          <Text>When you create a job, it will show up here.</Text>
        </Center>
      )
    }

    // .title
    // .tip
    // .type
    // .description
    // this.viewJob(x)

    return (
      <FlatList
        data={userJobs}
        keyExtractor={item => item.uid}
        ref='list'
        renderItem={({item, index}) => (
          <Stack
            m={wp(5)}
            bg='white'
            borderRadius='25'
            // borderWidth='1'
          >
            <Row
              // justifyContent='space-between'
              alignItems='flex-start'
              p={wp(2)}
              // borderBottomWidth='1'
            >
              <Center
                flex='1'
                p={wp(1)}
                // borderWidth='1'
              >
                <Text fontSize={wp(5)}>{index+1}</Text>
              </Center>
              <Box
                flex='9'
                p={wp(1)}
                // borderWidth='1'
              >
                <Text fontSize={wp(3.5)}>{item.title}</Text>
              </Box>
            </Row>

            <Row
              justifyContent='space-between'
              px={wp(2)}
              // borderWidth='1'
            >
              <Box
                flex='1'
                // borderWidth='1'
              >
                <Text>Creation Date</Text>
                <Text>{item.creationDate}</Text>
              </Box>
              <Box
                flex='1'
                alignItems='flex-end'
                // borderWidth='1'
              >
                <Text>Deadline</Text>
                <Text>{item.endDate}</Text>
              </Box>
            </Row>

            <Center>
              <Button my={wp(1.5)} onPress={() => this.viewJob(item)}>VIEW JOB</Button>
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

        <Button
          position='absolute'
          justifyContent='center'
          alignItems='center'
          right={wp(5)}
          bottom={wp(5)}
          boxSize={wp(10)}
          bg='white'
          borderRadius='50'
          borderColor='green.600'
          borderWidth='1'
          // onPress={() => this.refs.list.scrollTo()}
          onPress={() => this.refs.list.scrollToIndex({ index: 0 })}
        >
          <FontAwesomeIcon icon={faArrowUp} size={wp(4)}/>
        </Button>

      </Box>
    )
  }
}