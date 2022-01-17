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
      .then(() => this.setState({ busy: false }, () => console.log('user jobs loaded', this.context.userJobs)))
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
        <Center >
          <Spinner color='green.500'/>
        </Center>
      )
    }

    if (error) {
      return (
        <Center pt={hp(50)}>
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
      <>
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
      </>
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
      <Box bg='green.600'>

        {this.renderList()}

      </Box>
    )
  }
}