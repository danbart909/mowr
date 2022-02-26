import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, Input, Row, ScrollView, Stack, Text, TextArea } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'
import { post } from 'react-native-axios'
import Gradient from '../config/gradient'

export default class ReportBug extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      message: '',
      busy: false,
      error: false
    }
  }

  static contextType = Context

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

    let { email, message, busy, error } = this.state

    return (
      <Center
        flex='1'
        p={wp(5)}
        bg='primary.1'
      >
        <Gradient
          position='absolute'
          mt={wp(5)}
          h={hp(85)}
          w={wp(90)}
          alignSelf='center'
        />
          <Stack
            flex='1'
            w='100%'
            justifyContent='space-evenly'
            alignItems='center'
            // borderWidth='1'
          >

            <Text textAlign='center' px={wp(15)}>Use the form below to report any bugs and/or brokenness you encounter when using the app. The more detail you include, the higher the likelyhood we'll be able to fix it.</Text>

            <Center>
              <Stack>
                <Text textAlign='center'>Email Address:</Text>
                <Input
                  placeholder='email address'
                  w={wp(40)}
                  mt={wp(1)}
                  bg='white'
                  value={email}
                  onChangeText={x => this.setState({ email: x })}
                />
              </Stack>
  
              <Stack mt={wp(4)}>
                <Text textAlign='center'>Message:</Text>
                <TextArea
                  placeholder='Please include details such as what you were trying to get the app to do and what error (if any) you recieved, and/or what your last action was.'
                  h={hp(20)}
                  w={wp(75)}
                  p={wp(2)}
                  mt={wp(1)}
                  bg='white'
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
      </Center>
    )
  }
}