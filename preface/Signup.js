import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Column, FormControl, Heading, Input, Row, Stack, Text } from 'native-base'
import { ActivityIndicator } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'

export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isLoading: false,
      error: false
    }
  }

  static contextType = Context

  registerUser = async () => {
    let { ref, set } = database
    let { auth, db } = this.context
    let { role, displayName, email, password } = this.state
    if (this.state.displayName === '' && this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signup!')
    } else if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert("Passwords don't match!")
    } else {
      this.setState({ isLoading: true })
      author.createUserWithEmailAndPassword(auth, email, password)
        .then(x => {
          console.log('User registered successfully!', x)
          // set(ref(db, 'users/' + x.user.uid), { role: role })
          // x.user.role = role
          this.props.context.updateContext('user', x.user)
          author.updateProfile(auth.currentUser, {displayName: displayName})
            .then(async () => {
              await this.context.refresh()
              this.setState({ isLoading: false, error: false }, () => this.context.navigation.navigate('Home'))
            })
            .catch(e => this.setState({ isLoading: false, error: true }, () => console.log('error updating during registration', e)))
        })
        .catch(e => this.setState({ isLoading: false, error: true }, () => console.log('registration error', e)))
    }
  }

  render() {

    let { displayName, email, password, passwordComfirm, isLoading, error } = this.state

    if (isLoading) {
      return (
        <Box
          bg='white'
          p={wp(5)}
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

        {/* <Text fontSize={wp(5)}>Signup</Text> */}

        <Heading>Signup</Heading>

        <FormControl>
          <FormControl.Label pb='5'>Name</FormControl.Label>
          <Input
            // placeholder='Name'
            w={wp(50)}
            bg='white'
            onChangeText={(x) => this.setState({ displayName: x })}
            value={displayName}
          />
        </FormControl>

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

        <FormControl>
          <FormControl.Label pb='5'>Confirm Password</FormControl.Label>
          <Input
            // placeholder='Confirm Password'
            type='password'
            w={wp(50)}
            bg='white'
            onChangeText={(x) => this.setState({ passwordComfirm: x })}
            value={passwordComfirm}
          />
        </FormControl>

        <Button
          onPress={() => console.log('Sign Up')}
        >Sign Up</Button>

        <Text>
          Already have an account?
        </Text>

        <Text
          bold
          underline
          color='green.600'
          onPress={() => this.props.setView('Login')}
        >
          Press Here to Login
        </Text>

      </Column>
    )
  }
}