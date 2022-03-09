import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Column, FormControl, Heading, Input, Spinner, Row, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Keyboard } from 'react-native'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore'
import { LinearGradient } from 'expo-linear-gradient'

export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      busy: false,
      error: false,
      errorMessage: '',
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
      this.setState({ busy: true })
      createUserWithEmailAndPassword(auth, email, password)
        .then(async x => {
          console.log('User registered successfully!', x)
          this.props.context.updateContext('user', x.user)
          updateProfile(auth.currentUser, { displayName: displayName })
            .then(async () => {
              await this.createMirror()
              await this.context.refresh()
              this.setState({ busy: false, error: false, errorMessage: '' }, () => this.props.setView('Phone'))
            })
            .catch(e => this.setState({ busy: false, error: true, errorMessage: e.message }, () => console.log('error updating during registration', e)))
        })
        .catch(e => this.setState({ busy: false, error: true, errorMessage: e.message }, () => console.log('registration error', e)))
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

    let { displayName, email, password, passwordComfirm, busy, error, errorMessage } = this.state

    if (busy) {
      return (
        <Box
          borderWidth='5'
          borderColor='primary.1'
        >
          <Spinner size={wp(10)} m={wp(10)} color='primary.1'/>
        </Box>
      )
    }

    return (
      <>
        <LinearGradient
          colors={['#289d15', '#ffffff']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <Stack
            h={wp(120)}
            w={wp(65)}
            alignItems='center'
            p={wp(4)}
            borderWidth='2'
            // space={wp(2.5)}
          >
            <Heading
              flex='1'
              pt={wp(1)}
            >Signup</Heading>
      
            <Stack
              flex='2'
              justifyContent='center'
            >
              <Text pb={wp(1)}>Name</Text>
              <Input
                // placeholder='Name'
                // autoFocus
                onEndEditing={() => Keyboard.dismiss()}
                w={wp(50)}
                bg='white'
                onChangeText={(x) => this.setState({ displayName: x })}
                value={displayName}
              />
            </Stack>
      
            <Stack
              flex='2'
              justifyContent='center'
            >
              <Text pb={wp(1)}>Email</Text>
              <Input
                // placeholder='Email'
                onEndEditing={() => Keyboard.dismiss()}
                w={wp(50)}
                bg='white'
                onChangeText={(x) => this.setState({ email: x })}
                value={email}
              />
            </Stack>
    
            <Stack
              flex='2'
              justifyContent='center'
            >
              <Text pb={wp(1)}>Password</Text>
              <Input
                // placeholder='Password'
                onEndEditing={() => Keyboard.dismiss()}
                type='password'
                w={wp(50)}
                bg='white'
                onChangeText={(x) => this.setState({ password: x })}
                value={password}
              />
            </Stack>
    
            <Stack
              flex='2'
              justifyContent='center'
            >
              <Text pb={wp(1)}>Confirm Password</Text>
              <Input
                // placeholder='Confirm Password'
                onEndEditing={() => Keyboard.dismiss()}
                type='password'
                w={wp(50)}
                bg='white'
                onChangeText={(x) => this.setState({ passwordConfirm: x })}
                value={passwordComfirm}
              />
            </Stack>
    
            <Box
              flex='2'
              justifyContent='flex-end'
            >
              <Button
                px={wp(15)}
                onPress={() => this.registerUser()}
              >Sign Up</Button>
            </Box>
      
            <Stack
              flex='2'
              justifyContent='flex-end'
              alignItems='center'
            >
              <Text textAlign='center' fontSize={wp(4)}>
                Already have an account?
              </Text>
      
              <Text
                bold
                underline
                color='white'
                fontSize={wp(4)}
                textAlign='center'
                onPress={() => this.props.setView('Login')}
              >
                Press Here to Login
              </Text>
            </Stack>
      
            { error &&
              <Box
                h='130%'
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
          </Stack>
        </LinearGradient>
      </>
    )
  }
}