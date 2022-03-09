import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, Input, Row, ScrollView, Stack, Text, TextArea } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { post } from 'react-native-axios'
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default class ReportBug extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      message: '',
      busy: false,
      error: false,
      keyboard: false
    }
  }

  static contextType = Context

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.setState({ keyboard: true }, () => console.log('keyboard On ReportBug'))
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({ keyboard: false }, () => console.log('keyboard Off, ReportBug')
    ))
  }
    
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  submit = async () => {
    let { email, message } = this.state
    
    if (email === '') {
      alert('Please enter an email address.')
    } else if (message === '') {
      alert('Please enter a message to send.')
    }

    this.setState({ busy: true, error: false })

    post('https://formspree.io/f/xlezbdln', {
      email: email,
      message: message
    })
      .then(async x => {
        this.setState({ message: '', busy: false, error: false })
        console.log('message success', x)
        alert('Message was sent successfully! Thank you!')
      })
      .catch(e => {
        console.log('message error', e.response)
        if (e.response.status === 422) {
          alert('Please enter a real email address.')
          this.setState({ busy: false })
        } else {
          this.setState({ busy: false, error: true })
        }
      })
  }

  render() {

    let { email, message, busy, error, keyboard } = this.state

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Center flex='1'>
          <LinearGradient
            colors={['#289d15', '#ffffff']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
          >
            <Stack
              flex='1'
              bottom={keyboard ? hp(23) : 0}
              justifyContent='space-evenly'
              alignItems='center'
            >

              <Text textAlign='center' px={wp(5)}>Use the form below to report any bugs and/or brokenness you encounter when using the app. The more detail you include, the higher the likelihood we'll be able to fix it.</Text>
  
              <Center>
                <Stack>
                  <Text textAlign='center'>Email Address:</Text>
                  <Input
                    placeholder='email address'
                    onEndEditing={() => Keyboard.dismiss()}
                    w={wp(40)}
                    mt={wp(1)}
                    bg='white'
                    value={email}
                    fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
                    onChangeText={x => this.setState({ email: x })}
                  />
                </Stack>
    
                <Stack mt={wp(4)}>
                  <Text textAlign='center'>Message:</Text>
                  <TextArea
                    placeholder='Please include details such as what you were trying to get the app to do and what error (if any) you received, and/or what your last action was.'
                    h={hp(20)}
                    w={wp(75)}
                    p={wp(2)}
                    mt={wp(1)}
                    bg='white'
                    onEndEditing={() => Keyboard.dismiss()}
                    fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
                    onChangeText={x => this.setState({ message: x })}
                    value={message}
                  />
                  { error && <Center bg='white' borderRadius='40' p={wp(3)}><Text textAlign='center' color='red.400'>An error occurred. Please try again.</Text></Center>}
                </Stack>
              </Center>
  
              <Button
                isLoading={busy}
                onPress={() => this.submit()}
              >Submit</Button>
  
            </Stack>
            </LinearGradient>
        </Center>
      </TouchableWithoutFeedback>
    )
  }
}