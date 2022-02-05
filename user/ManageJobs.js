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
    this.checkForJobs()
  }

  checkForJobs = async () => {
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
        keyExtractor={item => item.uid}
        ref='list'
        // refreshing={false}
        // onRefresh={() => this.checkForJobs()}
        renderItem={({item, index}) => (
          <Stack
            m={wp(5)}
            bg='white'
            borderRadius='40'
            // borderWidth='1'
          >
            <Row
              // justifyContent='space-between'
              alignItems='flex-start'
              p={wp(2)}
              // borderBottomWidth='1'
            >
              <Center
                // flex='2'
                py={wp(1)}
                px={wp(2)}
                borderWidth='1'
                borderRadius='40'
                bg='primary.1'
                // bg='primary.101'
              >
                <Text fontSize={wp(6)} color='white'>#{index+1}</Text>
              </Center>
              <Box
                flex='1'
                py={wp(1)}
                px={wp(3)}
                // borderWidth='1'
              >
                <Text fontSize={wp(3.5)} borderBottomWidth='1'>{item.title}</Text>
              </Box>
              <Center
                // flex='2'
                p={wp(1)}
                borderWidth='1'
                borderRadius='40'
                bg='primary.1'
                // bg='primary.101'
              >
                <Text fontSize={wp(4)} textAlign='right' color='white'>${item.tip}</Text>
              </Center>
            </Row>

            <Row
              justifyContent='space-between'
              px={wp(2)}
            >
              <Box
                // flex='1'
                w={wp(42)}
                px={wp(1.5)}
                py={wp(2)}
                borderRadius='20'
                alignItems='flex-start'
                bg='primary.101'
                borderWidth='1'
              >
                <Text
                  pb={wp(1)}
                  color='white'
                  borderBottomColor='white'
                  borderBottomWidth='1'
                >Creation Date</Text>
                <Text
                  pt={wp(1)}
                  lineHeight={wp(3.2)}
                  color='white'
                >{item.creationDate.replace(' at', '\nat')}</Text>
              </Box>
              <Box
                // flex='1'
                w={wp(42)}
                px={wp(1.5)}
                py={wp(2)}
                borderRadius='20'
                alignItems='flex-end'
                bg='primary.101'
                borderWidth='1'
              >
                <Text
                  pb={wp(1)}
                  color='white'
                  borderBottomColor='white'
                  borderBottomWidth='1'
                >Deadline</Text>
                <Text
                  pt={wp(1)}
                  textAlign='right'
                  lineHeight={wp(3.2)}
                  color='white'
                >{item.endDate.replace(' at', '\nat')}</Text>
              </Box>
            </Row>

            <Center>
              <Button
                my={wp(1.5)}
                onPress={() => this.viewJob(item)}
              >VIEW JOB</Button>
            </Center>
            
          </Stack>
        )}
      />
    )
  }

  // renderPage = () => {
  //   let { busy, error } = this.state

  //   if (error) {
  //     return <Center>
  //       <Text>An error occurred, please press the button below to retry.</Text>
  //       <Button
  //         onPress={() => }
  //       >Retry</Button>
  //     </Center>
  //   }
  // }

  render() {
    return (
      <Box flex='1' bg='primary.1'>

        {this.renderList()}

        { this.context.userJobs.length >= 4 && <Button
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