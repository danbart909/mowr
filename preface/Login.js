import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Column, FormControl, Heading, Input, Spinner, Row, ScrollView, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { LinearGradient } from 'expo-linear-gradient'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      busy: false,
      error: false,
      errorMessage: '',
    }
  }

  static contextType = Context

  loginUser = async () => {
    let { email, password } = this.state
    if (email === '' && password === '') {
      Alert.alert('Enter details to login!')
    } else {
      this.setState({ busy: true })
      signInWithEmailAndPassword(this.context.auth, email, password)
        .then(x => {
          this.setState({ busy: false, error: false, errorMessage: '' })
          this.context.refresh()

          this.context.navigation.navigate('Home')
        })
        .catch(e => {
          console.log('error logging in', e, e.message)
          this.setState({ busy: false, error: true, errorMessage: e.message })
        })
    }
  }

  render() {

    let { email, password, busy, error, errorMessage } = this.state

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
            h={hp(55)}
            w={wp(65)}
            alignItems='center'
            p={wp(4)}
            borderWidth='2'
          >
    
            <Heading
              flex='1'
              pt={wp(3)}
            >Log In</Heading>
    
            <Box
              flex='3'
            >
              <Stack
                flex='1'
                justifyContent='center'
              >
                <Text pb={wp(1)}>Email</Text>
                <Input
                  // autoFocus
                  // placeholder='Email'
                  // onEndEditing={() => Keyboard.dismiss()}
                  w={wp(50)}
                  bg='white'
                  onChangeText={(x) => this.setState({ email: x })}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  value={email}
                />
              </Stack>
      
              <Stack
                flex='1'
                justifyContent='center'
              >
                <Text pb={wp(1)}>Password</Text>
                <Input
                  // placeholder='Password'
                  // onEndEditing={() => Keyboard.dismiss()}
                  type='password'
                  w={wp(50)}
                  bg='white'
                  onChangeText={(x) => this.setState({ password: x })}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  value={password}
                />
              </Stack>
            </Box>
    
            <Box
              flex='2'
              w='100%'
              justifyContent='center'
            >
              {/* <Text
                bold
                underline
                fontSize={wp(4)}
                alignSelf='flex-end'
              >
                Forgot Password?
              </Text> */}
      
              <Button
                px={wp(15)}
                alignSelf='center'
                onPress={() => this.loginUser()}
              >Log In</Button>
            </Box>
    
            <Box
              flex='2'
              justifyContent='flex-end'
            >
              <Text pb={wp(1)} textAlign='center' fontSize={wp(4)}>
                Don't have an account?
              </Text>
      
              <Text
                bold
                underline
                color='white'
                fontSize={wp(4)}
                textAlign='center'
                onPress={() => this.props.setView('Signup')}
                // onPress={() => this.props.setView('Address')}
              >
                Press Here to Sign Up
              </Text>
            </Box>
    
          </Stack>
          { error &&
            <Box
              h='80%'
              position='absolute'
              justifyContent='flex-end'
            >
              <Text
                textAlign='center'
                color='red.700'
                bg='white'
                p={wp(3)}
                borderRadius='40'
              >{errorMessage}</Text>
            </Box>
          }
        </LinearGradient>
      </TouchableWithoutFeedback>
    )
  }
}