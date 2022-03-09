import React, { Component } from 'react';
import Context from '../context/Context.js'
import { Platform } from 'react-native'
import { Box, Button, Flex, Heading, Row, ScrollView, Stack, Text, Center } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import firebase from '../config/firebase'
import { Video, AVPlaybackStatus } from 'expo-av'
import * as SplashScreen from 'expo-splash-screen'
import { LinearGradient } from 'expo-linear-gradient'

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
      <ScrollView bg='primary.1'>

        {/* <LinearGradient
          colors={['#289d15', '#ffffff']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        > */}
          <Center
            mb={wp(5)}
            w='100%'
          >
            <Center w='100%' bg='white'>
              <Text
                fontSize={wp(25)}
                fontFamily='Titillium'
                color='primary.1'
              onPress={() => {
                // this.context.test()
                console.log('click')
              }}
              >wrkr</Text>
            </Center>
            {/* <LinearGradient
              colors={['#289d15', '#ffffff']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            > */}
              <Box
                pt={wp(5)}
                px={wp(5)}
                // pb={wp(5)}
              >
                <WText fontSize={wp(6)} bold textAlign='center'>Post a job for anyone to contact you about, or search for a job to find work, make some money, and help out your community!</WText>
              </Box>
            {/* </LinearGradient> */}
          </Center>
  
          {/* <Center
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: 'primary.1' }}
            p={wp(2)}
          >   */}

          <Stack
            px={wp(5)}
            pb={wp(6)}
          >
            <Box>
              <Row
                flex='1'
                alignItems='center'
                justifyContent='space-between'
              >
                <WText>Find Community Help</WText>
                <Button
                  bg='primary.100'
                  // bg='primary.1'
                  onPress={() => this.context.navigation.navigate('Preface')}
                  // _text={{ color: 'white' }}
                ><WText fontSize={wp(5)}>Sign Up</WText></Button>
              </Row>
              <Box
                flex='1'
                alignItems='center'
              >
                <WText>or</WText>
              </Box>
              <Row
                flex='1'
                alignItems='center'
                justifyContent='space-between'
                // mr={wp(2)}
              >
                <WText mr={wp(1)}>Find Community Work</WText>
                <Button
                  bg='primary.100'
                  // bg='primary.1'
                  borderColor='white'
                  onPress={() => this.context.navigation.navigate('Search Jobs')}
                  _text={{ color: 'white', fontSize: wp(5) }}
                >Search Jobs</Button>
              </Row>
              {/* <Box flex='1'>
                <WText
                  px={wp(2)}
                  py={wp(1)}
                  mr={wp(1)}
                  mt={wp(1)}
                  color='darkgreen'
                  borderColor='primary.1'
                  borderWidth='1'
                  onPress={() => this.context.navigation.navigate('Preface')}
                >Sign Up</WText>
              </Box> */}
            </Box>
          </Stack>

          <Row bg='white'>
            <Box
              flex='1'
              my={wp(2)}
              mx={wp(0.5)}
              p={wp(1)}
              // mr={wp(1)}
              borderRadius='40'
              bg='primary.100'
            >
              <WText
                p={wp(1)}
                // borderWidth='1'
                textAlign='center'
                onPress={() => this.context.navigation.navigate('Info')}
              >How To Use This App</WText>
            </Box>
            <Box
              flex='1'
              my={wp(2)}
              mx={wp(0.5)}
              p={wp(0.5)}
              borderRadius='40'
              bg='primary.100'
            >
              <WText
                p={wp(1)}
                // borderWidth='1'
                textAlign='center'
                onPress={() => this.context.navigation.navigate('About')}
              >What is this App About?</WText>
            </Box>
          </Row>

            <Stack
              p={wp(4)}
              space={wp(4)}
            >
              <WText>With the wrkr app, anybody can post a job and it will be visible to anyone who is willing to help. We do not employ any workers ourselves and it exists purely as a convient way to help foster connections in the community. If you have a job that needs doing (mow a lawn, babysit, skim a pool), post it here and you may just find there are plenty of people out there who want to help. For more information, please press one of the buttons above.</WText>
              <WText>This app is in the early stages and some things may still be broken. Please be patient, as I am constantly working to improve this app.</WText>
            </Stack>
  
            <Stack
              mt={wp(4)}
              p={wp(4)}
            >
            </Stack>
          {/* </Center> */}
        {/* </LinearGradient> */}
      </ScrollView>
    );
  }
}

let WText = (props) => {
  return <Text color='white' {...props}>{props.children}</Text>
}