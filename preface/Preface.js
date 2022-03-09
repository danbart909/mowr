import React, { Component } from 'react'
import Context from '../context/Context.js'
import Login from './Login'
import Signup from './Signup'
import Phone from './Phone'
import Address from './Address'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Box, Button, Center, Flex, Heading, Link, NativeBaseProvider, Row, ScrollView, Stack, Text, KeyboardAvoidingView } from 'native-base'
import theme from '../config/theme'
import { Video, AVPlaybackStatus } from 'expo-av'

export default class Preface extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'Signup',
      keyboard: false
    }
  }

  static contextType = Context

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({ keyboard: true })
    )
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({ keyboard: false }
    ))
  }
    
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  render() {
    let { keyboard } = this.state
    return (
      <>
        <Video
          source={require('../assets/mower1.mp4')}
          ref={(ref) => this.background = ref }
          style={{ top: 0, right: 0, bottom: 0, left: 0, position: 'absolute' }}
          isLooping
          isMuted
          resizeMode='cover'
          shouldPlay
          // useNativeControls
        />
        <NativeBaseProvider theme={theme}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Center flex='1' bottom={keyboard ? hp(23) : 0}>
              {
                this.state.view === 'Signup' ?
                <Signup
                  setView={(x) => this.setState({ view: x })}
                  context={this.context}
                  keyboard={keyboard}
                /> :
                this.state.view === 'Phone' ?
                <Phone
                  setView={(x) => this.setState({ view: x })}
                  context={this.context}
                  keyboard={keyboard}
                /> :
                this.state.view === 'Address' ?
                <Address
                  setView={(x) => this.setState({ view: x })}
                  context={this.context}
                  keyboard={keyboard}
                /> :
                <Login
                  setView={(x) => this.setState({ view: x })}
                  context={this.context}
                  keyboard={keyboard}
                />
              }
            </Center>
          </TouchableWithoutFeedback>
        </NativeBaseProvider>
      </>
    )
  }
}