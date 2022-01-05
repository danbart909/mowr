import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Column, FormControl, Heading, Input, Row, Stack, Text } from 'native-base'
import { ActivityIndicator, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'p@gmail.com',
      password: 'pppppppp',
      isLoading: false,
      error: false
    }
  }

  static contextType = Context

  loginUser = async () => {
    let { email, password } = this.state
    if (email === '' && password === '') {
      Alert.alert('Enter details to login!')
    } else {
      this.setState({ isLoading: true })
      this.context.login(email, password)
        .then(() => this.setState({ isLoading: false, error: false }, () => this.context.navigation.navigate('Home')))
        .catch(e => this.setState({ isLoading: false, error: true }, () => console.log('error logging in', e)))
    }
  }

  render() {

    let { email, password, isLoading, error } = this.state

    if (isLoading) {
      return (
        <Box
          bg='white'
          p={wp(2.5)}
          borderWidth='5'
          borderColor='green.500'
        >
          <ActivityIndicator size='large' color='green'/>
        </Box>
      )
    }

    return (
      <Column
        alignItems='center'
        p={wp(5)}
        space={wp(2.5)}
        bg='gray.100'
        borderWidth='3'
        borderColor='green.500'
      >

        {/* <Text fontSize={wp(5)}>Log In</Text> */}

        <Heading>Log In</Heading>

        <FormControl>
          <FormControl.Label pb='5'>Email</FormControl.Label>
          <Input
            // placeholder='Email'
            w={wp(50)}
            bg='white'
            onChangeText={(x) => this.setState({ email: x })}
            value={email}
          />
        </FormControl>

        <FormControl>
          <FormControl.Label pb='5'>Password</FormControl.Label>
          <Input
            // placeholder='Password'
            type='password'
            w={wp(50)}
            bg='white'
            onChangeText={(x) => this.setState({ password: x })}
            value={password}
          />
        </FormControl>

        <Text
          bold
          underline
          // color='green.600'
          fontSize='10'
          alignSelf='flex-end'
        >
          Forgot Password?
        </Text>

        <Button
          onPress={() => this.loginUser()}
        >Log In</Button>

        <Text>
          Don't have an account?
        </Text>

        <Text
          bold
          underline
          color='green.600'
          onPress={() => this.props.setView('Signup')}
        >
          Press Here to Sign Up
        </Text>

      </Column>
    )
  }
}