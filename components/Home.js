import React, { Component } from 'react';
import Context from '../context/Context.js'
import { Box, Button, Flex, Text, Stack, Center, Heading } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { linkWithphone, PhoneAuthProvider } from 'firebase/auth'
import firebase from '../config/firebase'

// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faCalendarAlt, faExclamationCircle, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static contextType = Context

  render() {
    return (
      <>
        <Center
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
          p='4'
          flex='1'
        >
          <Stack
            direction='row'
            space='2'
            p='12'
            borderWidth='1'
            borderColor='black'
            // bg='emerald.500'
          >
            <Button onPress={() => this.context.navigation.navigate('Search Jobs')}>Search for Jobs</Button>
            <Button onPress={() => this.context.refresh()}>Refresh User</Button>
            <Button onPress={() => this.context.test()}>Experiment</Button>
            <Button onPress={() => this.context.navigation.navigate('Search Jobs 2')}>Search Jobs 2</Button>
          </Stack>
          {/* <Stack
            direction='row'
            space='2'
            p='12'
            borderWidth='1'
            borderColor='black'
            // bg='emerald.500'
          >
            <Button onPress={() => this.test1()}>test1</Button>
            <Button onPress={() => this.test2()}>test2</Button>
          </Stack> */}

          <Stack mt='20' space='12'>
            {/* <Button onPress={() => this.context.navigation.navigate('TestJobView')}>Test Job View</Button> */}
            {/* <Button onPress={() => this.context.navigation.navigate('TestProfile')}>Test Profile</Button> */}
            {/* <Button onPress={() => this.context.navigation.navigate('TestSearchJobs')}>Test Search Jobs</Button> */}
            {/* <Button onPress={() => this.context.navigation.navigate('TestCreateJob')}>Test Create Job</Button> */}
          </Stack>
        </Center>
      </>
    );
  }
}

// <Stack space={5} alignItems="center">
//   <Heading size="lg">Welcome to NativeBase</Heading>
//   <Stack space={2} direction='row' alignItems="center">
//     <Text>Edit</Text>
//     <Code>App.js</Code>
//     <Text>and save to reload.</Text>
//   </Stack>
//   <Link href="https://docs.nativebase.io" isExternal>
//     <Text color="primary.500" underline fontSize={"xl"}>Learn NativeBase</Text>
//   </Link>
// </Stack>