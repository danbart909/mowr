import React, { Component } from 'react'
import Context from '../../context/Context.js'
import { Box, Button, Center, FormControl, Heading, Input, Modal, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as database from 'firebase/database'

export default class Test2Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newEmail: '',
      showEmail: false,
      emailBusy: false,
      emailError: false,

      newPhone: '',
      showPhone: false,
      phoneBusy: false,
      phoneError: false,

      newAddress: '',
      showAddress: false,
      addressBusy: false,
      addressError: false
    }
  }

  static contextType = Context

  updateEmail = () => {
    console.log('updateEmail')
  }

  updatePhone = () => {
    console.log('updatePhone')
  }

  modals = () => {
    let html = []
    let { showEmail, newEmail, emailBusy, emailError, showPhone, newPhone, phoneBusy, phoneError, showAddress, newAddress, addressBusy, addressError } = this.state
    let list = [
      { x: 'Email', show: showEmail, showName: 'showEmail', new: newEmail, newName: 'newEmail', busy: emailBusy, error: emailError },
      { x: 'Phone', show: showPhone, showName: 'showPhone', new: newPhone, newName: 'newPhone', busy: phoneBusy, error: phoneError },
      { x: 'Address', show: showAddress, showName: 'showAddress', new: newAddress, newName: 'newAddress', busy: addressBusy, error: addressError }
    ]

    list.map(x => {
      html.push(
        <Modal
          key={x.x}
          isOpen={x.show}
          onClose={() => this.setState({ [x.showName]: false })}
        >
          <Modal.Content w={wp(80)}>
            <Modal.CloseButton />
            <Modal.Header>Edit Profile</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>{`${x.x}`}</FormControl.Label>
                <Input
                  value={x.new}
                  onChangeText={y => this.setState({ [x.newName]: y })}
                />
              </FormControl>
            </Modal.Body>
            <Button.Group
              space={wp(2)}
              alignSelf='flex-end'
              pr={wp(2)}
              pb={wp(2)}
            >
              <Button
                variant='ghost'
                onPress={() => this.setState({ [x.showName]: false })}
              >Cancel</Button>
              <Button
                isLoading={x.busy}
                onPress={() => {
                  x.x === 'Email' ? this.updateEmail() :
                  x.x === 'Phone' ? this.updatePhone() :
                  this.updateAddress()
                }}
              >{x.busy ? '' : 'Save'}</Button>
            </Button.Group>
          </Modal.Content>
        </Modal>
      )
    })

    return html
  }

  render() {

    let { user } = this.context

    return (
      <Center>

        <Stack w='90%'
          mt={wp(5)}
          space={wp(3)}
          // borderWidth='1'
        >

          <Row>
            <Box flex='4'>
              <Text>Display Name:</Text>
            </Box>
            <Box flex='6'>
              <Text textAlign='right'>{user.displayName}</Text>
            </Box>
          </Row>
  
          <Row>
            <Box flex='3'>
              <Text>Email:</Text>
            </Box>
            <Box flex='7'>
              <Text textAlign='right'>{user.email}</Text>
              <Text bold underline color='green.600'
                fontSize='10'
                alignSelf='flex-end'
                onPress={() => this.setState({ showEmail: true })}
              >Press Here to Edit</Text>
            </Box>
          </Row>
  
          <Row>
            <Box flex='4'>
              <Text>Phone Number:</Text>
            </Box>
            <Box flex='6'>
              <Text textAlign='right'>{user.phoneNumber}</Text>
              <Text bold underline color='green.600'
                fontSize='10'
                alignSelf='flex-end'
                onPress={() => this.setState({ showPhone: true })}
              >Press Here to Edit</Text>
            </Box>
          </Row>

          <Row>
            <Box flex='3'>
              <Text>Your Address:</Text>
            </Box>
            <Box flex='7'>
              <Text textAlign='right'>{user.address ? user.address : 'No Address Saved'}</Text>
              <Text bold underline color='green.600'
                fontSize='10'
                alignSelf='flex-end'
                onPress={() => this.context.navigation.navigate('Location')}
              >Press Here to Edit</Text>
            </Box>
          </Row>
  
          <Button onPress={() => this.context.logout()}>Logout</Button>

        </Stack>

        {this.modals()}

      </Center>
    )
  }
}

const Row = (props) => {
  return (
    <Stack
      {...props}
      direction='row'
      // w='100%'
      // justifyContent='space-between'
      alignItems='flex-start'
      // borderWidth='1'
    />
  )
}