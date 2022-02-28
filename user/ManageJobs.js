import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, FlatList, Flex, Heading, Row, ScrollView, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import Gradient from '../config/gradient'

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
    this.checkForJobs()
  }

  checkForJobs = async () => {
    console.log('ManageJobs - checkForJobs')
    this.setState({ busy: true, error: false })
    await this.context.refreshUserJobs()
      .then(() => this.setState({ busy: false }))
      .catch(e => this.setState({ busy: false, error: true }, () => console.log('error retrieving jobs', e)))
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
        <Center pt={hp(40)}>
          <Spinner size={wp(20)} color='white'/>
        </Center>
      )
    }

    if (error) {
      return (
        <Center pt={hp(40)}>
          <Text color='white'>There was an error retrieving your jobs from the server.</Text>
          <Button
            mt={wp(5)}
            borderWidth='1'
            borderColor='white'
            onPress={() => this.context.refreshUserJobs()}
          >Press to Retry</Button>
        </Center>
      )
    }

    if (userJobs.length === 0) {
      return (
        <Center pt={hp(45.5)}>
          <Text color='white'>When you create a job, it will show up here.</Text>
        </Center>
      )
    }

    return (
      <FlatList
        data={userJobs}
        keyExtractor={item => item.id}
        ref='list'
        // refreshing={false}
        // onRefresh={() => this.checkForJobs()}
        renderItem={({item, index}) => (
          <Gradient
            m={wp(4)}
            px={wp(4)}
          >
            <Row alignItems='flex-start' pt={wp(2)}>
              <Center>
                <Text fontSize={wp(7)}>#{index+1}</Text>
              </Center>
              <Box
                flex='1'
                pt={wp(1)}
                pb={wp(2)}
                px={wp(2)}
              >
                <Text fontSize={Platform.OS === 'ios' ? wp(6) : wp(3.5)} noOfLines={2}>{item.title}</Text>
              </Box>
              <Center py={wp(1)}>
                <Text
                  fontSize={wp(4)}
                  textAlign='right'
                >${item.tip}</Text>
              </Center>
            </Row>

            <Box py={wp(5)}>
              <Text noOfLines={5}>{item.description}</Text>
            </Box>

            <Row justifyContent='space-between'>
              <Box
                w={wp(42)}
                alignItems='flex-start'
              >
                <Text
                  pb={wp(1)}
                  borderBottomWidth='1'
                >Creation Date</Text>
                <Text
                  pt={wp(1)}
                  lineHeight={Platform.OS === 'ios' ? wp(6) : wp(3.5)}
                >{format(new Date(item.creationDate.seconds*1000), 'E, PP')}</Text>
              </Box>
              <Box
                w={wp(42)}
                alignItems='flex-end'
              >
                <Text
                  pb={wp(1)}
                  borderBottomWidth='1'                
                >Deadline</Text>
                <Text
                  pt={wp(1)}
                  textAlign='right'
                  lineHeight={Platform.OS === 'ios' ? wp(6) : wp(3.5)}
                >{format(new Date(item.endDate.seconds*1000), 'E, PPp')}</Text>
              </Box>
            </Row>

            <Center>
              <Button
                my={wp(5)}
                onPress={() => this.viewJob(item)}
              >VIEW JOB</Button>
            </Center>
            
          </Gradient>
        )}
      />
    )
  }

  render() {
    return (
      <Box flex='1' bg='primary.1'>

        {this.renderList()}

        { this.context.userJobs.length >= 3 && <Button
          position='absolute'
          justifyContent='center'
          alignItems='center'
          right={wp(5)}
          bottom={wp(5)}
          boxSize={wp(10)}
          bg='white'
          borderRadius='50'
          borderColor='primary.1'
          borderWidth='1'
          onPress={() => this.refs.list.scrollToIndex({ index: 0 })}
        >
          <FontAwesomeIcon icon={faArrowUp} size={wp(4)}/>
        </Button> }

      </Box>
    )
  }
}