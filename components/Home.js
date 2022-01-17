import React, { Component } from 'react';
import Context from '../context/Context.js'
import { Box, Button, Flex, Text, Stack, Center, Heading } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

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
          <Button onPress={() => this.context.refresh()}>Refresh</Button>
          <Button onPress={() => this.context.test()}>Test</Button>
        </Stack>
        <Stack mt='20' space='12'>
          {/* <Button onPress={() => this.context.navigation.navigate('Test1JobView')}>Job View 1</Button> */}
          {/* <Button onPress={() => this.context.navigation.navigate('Test2JobView')}>Job View 2</Button> */}
          <Button onPress={() => this.context.navigation.navigate('Test1Profile')}>Profile 1</Button>
          <Button onPress={() => this.context.navigation.navigate('Test1SearchJobs')}>Search Jobs 1</Button>
          {/* <Button onPress={() => this.context.navigation.navigate('Test1CreateJob')}>Test 1 Create Job</Button> */}

          {/* <Button onPress={() => this.context.navigation.navigate('Test2Profile')}>Test 2 Profile</Button> */}
          {/* <Button onPress={() => this.context.navigation.navigate('Test2SearchJobs')}>Test 2 SearchJobs</Button> */}

          {/* <Button onPress={() => this.context.navigation.navigate('Test3JobView')}>Test 3 Job View</Button> */}
          {/* <Button onPress={() => this.context.navigation.navigate('Test3Profile')}>Test 3 Profile</Button> */}
          {/* <Button onPress={() => this.context.navigation.navigate('Test3ManageJobs')}>Manage Jobs 3</Button> */}
        </Stack>
      </Center>
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