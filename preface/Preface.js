import React, { Component } from 'react'
import Context from '../context/Context.js'
import Login from './Login'
import Signup from './Signup'
import Phone from './Phone'
import Address from './Address'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Box, Button, Center, Flex, Heading, Link, NativeBaseProvider, Row, Stack, Text } from 'native-base'
import theme from '../config/theme'
import { Video, AVPlaybackStatus } from 'expo-av'

export default class Preface extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'Login'
    }
  }

  static contextType = Context

  render() {
    return (
      <>
        <Video
          source={require('../assets/mower1.mp4')}
          ref={(ref) => this.background = ref }
          style={styles.backgroundVideo}
          isLooping
          isMuted
          resizeMode='cover'
          shouldPlay
          // useNativeControls
        />
        <NativeBaseProvider theme={theme}>
          <Center flex='1'>
            {
              this.state.view === 'Signup' ?
              <Signup
                setView={(x) => this.setState({ view: x })}
                context={this.context}
              /> :
              this.state.view === 'Phone' ?
              <Phone
                setView={(x) => this.setState({ view: x })}
                context={this.context}
              /> :
              this.state.view === 'Address' ?
              <Address
                setView={(x) => this.setState({ view: x })}
                context={this.context}
              /> :
              <Login
                setView={(x) => this.setState({ view: x })}
                context={this.context}
              />
            }
          </Center>
        </NativeBaseProvider>
      </>
    )
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})







  // <ScrollView
  //           style={{ flex: 1 }}
  //           horizontal={true}
  //           scrollEventThrottle={wp(100)}
  //           pagingEnabled={true}
  //           ref={(node) => this.scroll = node}
  //         >
  //           {this.renderFirst()}
  //           {this.renderSecond()}
  //           {this.renderThird()}
  //         </ScrollView>