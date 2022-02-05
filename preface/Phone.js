import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Column, Center, FormControl, Heading, Input, Modal, Spinner, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { doc, setDoc } from 'firebase/firestore'

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

    if (this.state.busy) {
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

        <Heading>Enter Your Phone Number</Heading>

        <FormControl>
          <FormControl.Label pb='5'>Phone:</FormControl.Label>
          <Input
            type='password'
            placeholder='XXX-XXX-XXXX'
            keyboardType='phone-pad'
            textContentType='telephoneNumber'
            w={wp(50)}
            bg='white'
            onChangeText={(x) => this.setState({ phone: x })}
            value={this.state.phone}
          />
        </FormControl>

        <Button
          onPress={() => this.setPhone()}
        >Submit</Button>

      </Column>
    )
  }
}