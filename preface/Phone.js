import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Column, Center, FormControl, Heading, Input, Modal, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { doc, setDoc } from 'firebase/firestore'
import Gradient from '../config/gradient'

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
          h='27%'
          w='65%'
          borderWidth='3'
          borderColor='primary.1'
        />

        <Stack
          h='27%'
          w='65%'
          alignItems='center'
          p={wp(4)}
        >
  
          <Heading
            flex='1'
            pt={wp(1)}
          >Phone Number</Heading>
  
          <Stack
            flex='2'
            justifyContent='center'
          >
            <Text pb={wp(1)}>Phone:</Text>
            <Input
              type='phone'
              placeholder='XXX-XXX-XXXX'
              // keyboardType='phone-pad'
              // textContentType='telephoneNumber'
              w={wp(50)}
              bg='white'
              onChangeText={(x) => this.setState({ phone: x })}
              value={this.state.phone}
            />
          </Stack>
  
          <Box
            flex='2'
            justifyContent='flex-end'
          >
            <Button
              onPress={() => this.setPhone()}
            >Submit</Button>
          </Box>
  
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
      </>
    )
  }
}