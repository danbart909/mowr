import React, { Component } from 'react';
import Context from '../context/Context.js'
import { Box, Button, Flex, Heading, Row, ScrollView, Stack, Text, Center } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { linkWithphone, PhoneAuthProvider } from 'firebase/auth'
import firebase from '../config/firebase'
import Gradient from '../config/gradient'
import { Video, AVPlaybackStatus } from 'expo-av'
import * as SplashScreen from 'expo-splash-screen'

// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faCalendarAlt, faExclamationCircle, faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static contextType = Context

  // componentDidMount() {
  //   SplashScreen.preventAutoHideAsync();
  //   setTimeout(SplashScreen.hideAsync, 10000);
  // }

  render() {
    return (
      <ScrollView>
        <Center
          // _dark={{ bg: "blueGray.900" }}
          // _light={{ bg: 'primary.1' }}
          p={wp(2)}
        >
          <Center
            my={wp(5)}
            p={wp(4)}
            pt={0}
            bg='primary.1'
            borderRadius='40'
          >
            {/* <Text fontSize={wp(15)} color='white'>Welcome To</Text> */}
            <Text fontSize={wp(25)} color='white'>mowr</Text>
          </Center>

          <Center
            mb={wp(4)}
            p={wp(4)}
            alignItems='center'
            bg='primary.1'
            borderRadius='40'
          >
            <Text fontSize={wp(4)} bold color='white' textAlign='center'>Encouraging entrepreneurship among the youth by meeting community needs.</Text>
          </Center>
          
          <Stack
            p={wp(4)}
            space={wp(4)}
            bg='primary.1'
            borderRadius='40'
          >
            <Text color='white'>These are the infancy days of this app. Please be patient through crashes or errors. If one happens to you, please fill out the form on the <Text bg='white' color='primary.1' onPress={() => this.context.navigation.navigate('Report a Bug')}>Report a Bug</Text> page. You can use the form to also express any opinions you have or suggest improvements, not just strictly for reporting bugs.</Text>

            <Text color='white'>If you want to search for available jobs, then go to our <Text bg='white' color='primary.1' px={wp(1)} onPress={() => this.context.navigation.navigate('Search Jobs')}>Search Jobs</Text> page.</Text>

            <Text color='white'>If you want to find help and post a job, then visit our <Text bg='white' color='primary.1' px={wp(1)} onPress={() => this.context.navigation.navigate('Preface')}>Signup</Text> page.</Text>

            <Text color='white'><Text color='white' bold underline>Special Note for iOS users!</Text> I received a MacBook Air two days before production and found that the spacing with everything is quite distorted compared to the Android version. If you find text spilling over into areas they don't belong because they don't fit their containers, just know that I am aware of these particular issues and I am working on it.</Text>

          </Stack>

          {/* <Stack
            p={wp(4)}
            alignItems='center'
            bg='primary.1'
            borderRadius='40'
          >
            
          </Stack> */}

          {/* <Button onPress={() => this.context.navigation.navigate('Search Jobs')}>Search for Jobs</Button> */}

          {/* <Row
            mt={wp(4)}
            space={wp(1)}
            borderWidth='1'
          >
            <Button onPress={() => this.context.refresh()}>Refresh User</Button>
            <Button onPress={() => this.context.test()}>Science!!!</Button>
            <Button onPress={() => this.context.navigation.navigate('Test')}>Test Page</Button>
          </Row> */}
        </Center>
      </ScrollView>
    );
  }
}