import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Column, FormControl, Heading, Input, Spinner, Row, Stack, Text } from 'native-base'
import { ActivityIndicator } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore'

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
    let { auth } = this.context
    let { displayName, email, password } = this.state
    if (this.state.displayName === '' && this.state.email === '' && this.state.password === '') {
      alert('Enter details to signup!')
    } else if (this.state.password !== this.state.passwordConfirm) {
      alert("Passwords don't match!")
    } else {
      this.setState({ isLoading: true })
      createUserWithEmailAndPassword(auth, email, password)
        .then(async x => {
          console.log('User registered successfully!', x)
          this.props.context.updateContext('user', x.user)
          updateProfile(auth.currentUser, { displayName: displayName })
            .then(async () => {
              await this.createMirror()
              await this.context.refresh()
              this.setState({ isLoading: false, error: false }, () => this.props.setView('Phone'))
            })
            .catch(e => this.setState({ isLoading: false, error: true }, () => console.log('error updating during registration', e)))
        })
        .catch(e => this.setState({ isLoading: false, error: true }, () => console.log('registration error', e)))
    }
  }

  createMirror = async () => {
    let { fire, auth } = this.context
    let { email, uid } = auth.currentUser
    
    await setDoc(doc(fire, 'users', uid), {
      name: this.state.displayName,
      address: '',
      latitude: 0,
      longitude: 0,
      email: email,
      phone: '',
      joinDate: Timestamp.fromDate(new Date()),
      uid: uid
    })
      .then(() => console.log('mirror success'))
      .catch(e => console.log('mirror error', e))
  }

  render() {

    let { displayName, email, password, passwordComfirm, isLoading, error } = this.state

    if (isLoading) {
      return (
        <Box
          bg='white'
          borderWidth='5'
          borderColor='green.500'
          borderRadius='40'
        >
          <Spinner size={wp(10)} m={wp(10)} color='green.500'/>
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
        borderRadius='40'
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
            onChangeText={(x) => this.setState({ passwordConfirm: x })}
            value={passwordComfirm}
          />
        </FormControl>

        <Button
          onPress={() => this.registerUser()}
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