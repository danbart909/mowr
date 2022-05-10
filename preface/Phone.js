import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Column, Center, FormControl, Heading, Input, Modal, Spinner, Stack, Text } from 'native-base'
import { Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { doc, setDoc } from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'

export default class Phone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      busy: false,
      error: false
    }
  }

  static contextType = Context

  setPhone = async () => {
    let { user, fire } = this.context
    let { phone } = this.state
    let { uid } = user

    if (!phone.match(/^[1-9]\d{2}-\d{3}-\d{4}/)) {
      alert('Please enter a phone number formatted with hyphens\n\n###-###-####')
    } else {
      this.setState({
        busy: true,
        error: false
      })
      await setDoc(doc(fire, 'users', uid), {
        phone: phone
      }, { merge: true })
        .then(() => {
          try { this.context.refresh() } catch(e){console.log('refresh error', e)}
          finally {
            this.setState({
              phone: '',
              busy: false,
              error: false
            }, () => {
              console.log('Profile', 'phone updated', phone)
              this.props.setView('Address')
            })
          }
        })
        .catch((e) => {
          this.setState({
            busy: false,
            error: true
          }, () => console.log('Profile', 'error updating phone number', e))
        })
    }
  }

  render() {

    let { busy, error } = this.state

    if (busy) {
      return (
        <Box
          borderWidth='5'
          borderColor='primary.1'
          bg='white'
        >
          <Spinner size={wp(10)} m={wp(10)} color='primary.1'/>
        </Box>
      )
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <LinearGradient
          colors={['#289d15', '#ffffff']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <Stack
            h={wp(120)}
            w={wp(90)}
            alignItems='center'
            p={wp(4)}
          >
    
            <Stack
              flex='2'
              justifyContent='space-evenly'
            >
              <Heading
                py={wp(1)}
              >Phone Number</Heading>
              <Text lineHeight={wp(7)}>Please provide your phone number. When you create a job, your phone number will be automatically attatched to your job. You can change your phone number at any time on your profile page. <Text color='white'>Address</Text> works like this too, which you'll set on the next page.</Text>
            </Stack>
    
            <Stack
              flex='1'
              justifyContent='space-evenly'
            >
              <Stack
                justifyContent='center'
              >
                <Text pb={wp(1)}>Phone:</Text>
                <Input
                  // autoFocus
                  placeholder='XXX-XXX-XXXX'
                  w={wp(50)}
                  bg='white'
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  onChangeText={(x) => this.setState({ phone: x })}
                  value={this.state.phone}
                />
              </Stack>
      
              <Box
                justifyContent='flex-end'
              >
                <Button
                  onPress={() => this.setPhone()}
                >Submit</Button>
              </Box>
            </Stack>
    
              { error &&
                <Box
                  h='180%'
                  position='absolute'
                  justifyContent='flex-end'
                >
                  <Text
                    textAlign='center'
                    color='red.700'
                    bg='white'
                    p={wp(3)}
                    borderRadius='40'
                  >An error occured. Please try again.</Text>
                </Box>
              }
    
          </Stack>
        </LinearGradient>
      </TouchableWithoutFeedback>
    )
  }
}