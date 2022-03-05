import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Column, FormControl, Heading, Input, Spinner, Row, ScrollView, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Gradient from '../config/gradient'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      busy: false,
      error: false,
      errorMessage: '',
      toast: false,
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
        <Gradient
          borderWidth='5'
          borderColor='primary.1'
        >
          <Spinner size={wp(10)} m={wp(10)} color='primary.1'/>
        </Gradient>
      )
    }

    return (
      <>
        <Gradient
          position='absolute'
          h='55%'
          w='65%'
          borderWidth='3'
          borderColor='primary.1'
        />
  
        <Stack
          h='55%'
          w='65%'
          alignItems='center'
          p={wp(4)}
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
                // placeholder='Email'
                w={wp(50)}
                bg='white'
                onChangeText={(x) => this.setState({ email: x })}
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
                type='password'
                w={wp(50)}
                bg='white'
                onChangeText={(x) => this.setState({ password: x })}
                value={password}
              />
            </Stack>
          </Box>
  
          <Box
            flex='2'
            w='100%'
            justifyContent='space-between'
          >
            <Text
              bold
              underline
              fontSize={wp(2.5)}
              alignSelf='flex-end'
            >
              Forgot Password?
            </Text>
    
            <Button
              w={wp(20)}
              alignSelf='center'
              onPress={() => this.loginUser()}
            >Log In</Button>
          </Box>
  
          <Box
            flex='2'
            justifyContent='flex-end'
          >
            <Text pb={wp(1)} textAlign='center'>
              Don't have an account?
            </Text>
    
            <Text
              bold
              underline
              color='primary.1'
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
      </>
    )
  }
}