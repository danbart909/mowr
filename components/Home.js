import React, { Component } from 'react';
import Context from '../context/Context.js'
import { Platform } from 'react-native'
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

    let { navigation } = this.context

    return (
      <ScrollView>

        <Center
          mb={wp(5)}
          p={wp(4)}
          w='100%'
          bg='primary.1'
          // borderRadius='40'
        >
          {/* <Text fontSize={wp(15)} color='white'>Welcome To</Text> */}
          <Text fontSize={wp(25)} color='white' fontFamily='TimesNewRomanItalic'
          // fontFamily='TimesNewRoman'
          onPress={() => {
            console.log('button pressed')
            navigation.navigate('Manage Jobs')
          }}
          >wrkr</Text>
        </Center>

        <Center
          // _dark={{ bg: "blueGray.900" }}
          // _light={{ bg: 'primary.1' }}
          p={wp(2)}
        >

          {/* <Center
            mb={wp(4)}
            p={wp(4)}
            alignItems='center'
            bg='primary.1'
            borderRadius='40'
          >
            <Text fontSize={wp(8)} bold color='white' textAlign='center'>(Helping Entrepreneurs Love People)</Text>
          </Center> */}

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

            <Text color='white'><Text color='white' bold underline>Special Note for iOS users!</Text> I received a MacBook two days before production and found that the spacing with everything is quite distorted compared to the Android version. If you find text spilling over into areas they don't belong because they don't fit their containers, just know that these particular issues are being worked on.</Text>

            <Text color='white' textAlign='center' mt={wp(3)} bold underline>Additional Information on How the App Works:</Text>

            <Text color='white'>All financial transactions are handled outside of the app. It is the job poster's responsibility to personally pay the worker for any services rendered. We handle no money ourselves, and we take no cut from any agreements between the worker and the job provider.</Text>

            <Text color='white'>When registering a new account, you'll be asked to set your address. You only have to do this once, afterwards any job you create will automatically use this address and the phone number you provided. You can change either one in your profile anytime you need to.</Text>

            <Text color='white'>You can have more than one job posted at a time.</Text>

            <Text color='white'>When a job is over (either somebody worked it or it expired), it's listing will not automatically delete. This is feature to be implemented at a later time. Please go to the job you've listed on the 'Manage Jobs' page and delete it from there, otherwise you may continue to receive inquiries.</Text>

            <Text color='white'>On the Search Jobs page you can press on the page number (looks like a fraction - e.g. 1/3) and you'll be given a menu to choose which page you want to see.</Text>
          </Stack>

          <Stack
            mt={wp(4)}
            p={wp(4)}
            bg='primary.1'
            borderRadius='40'
          >
            <Text color='white' textAlign='center' mt={wp(3)} bold>wrkr v1.0.2</Text>
            <Text color='white' textAlign='center' mt={wp(3)} underline mb={wp(4)}>Release Notes:</Text>
            <Text color='white'>- Fixed the keyboard for iOS so users can set their phone number on signup.</Text>
            <Text color='white'>- Fixed the date/time picker for iOS so users can create a job.</Text>
            <Text color='white'>- Fixed some spelling errors on the Report a Bug page. If you find any more spelling errors, please let me know!</Text>
            <Text color='white'>- Removed all but one of the placeholder jobs. I think if I remove them all, all power in a 5 mile radius will get knocked out so I'm just going to keep one in there for now.</Text>
            <Text color='white'>- I'm not sure if this is just a glitch on my emulator, but it appears the scrollbar on iOS is showing up near the left side of the homepage. Can someone let me know if it shows up like this on an actual iPhone?</Text>
            <Text color='white'>-Thanks for downloading! If you have any ideas or suggestions for me feel free to let me know!</Text>
          </Stack>
        </Center>
      </ScrollView>
    );
  }
}