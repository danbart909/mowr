import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, FormControl, Heading, Input, Modal, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { EmailAuthProvider, updatePassword, updateEmail, updateProfile, reauthenticateWithCredential } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameNew: '',
      nameShow: false,
      nameBusy: false,
      nameError: false,

      newEmail: '',
      showEmail: false,
      emailBusy: false,
      emailError: false,

      newPhone: '',
      showPhone: false,
      phoneBusy: false,
      phoneError: false,

      newPassword: '',
      showPassword: false,
      passwordBusy: false,
      passwordError: false,

      loginPassword: '',
      showLogin: false,
      loginBusy: false,
      loginError: false,

      emailOrPassword: '',
    }
  }

  static contextType = Context

  reauthenticate = () => {
    let { auth, user } = this.context
    let { loginPassword, emailOrPassword } = this.state
    let credential = EmailAuthProvider.credential(user.email, loginPassword)

    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        console.log('reauthentication successful')
        emailOrPassword === 'email' ? this.setState({ showEmail: true, showLogin: false, emailOrPassword: '' }) : this.setState({ showPassword: true, showLogin: false, emailOrPassword: '' })
      })
      .catch(e => console.log('reauthentication error', e))
  }

  updateDisplayName = () => {
    let { auth } = this.context
    let { nameNew } = this.state

    this.setState({
      nameBusy: true,
      nameError: false
    })

    updateProfile(auth.currentUser, { displayName: nameNew })
      .then(() => {
        try { this.context.refresh() } catch(e){console.log('refresh error', e)}
        finally {
          this.setState({
            nameShow: false,
            nameNew: '',
            nameBusy: false,
            nameError: false
          }, () => {
            console.log('Profile', 'name updated', nameNew)
            // this.context.refresh()
          })
        }
      })
      .catch((e) => {
        this.setState({
          nameBusy: false,
          nameError: true
        }, () => console.log('Profile', 'error updating name', e))
      })
  }

  updateEmail = async () => {
    let { auth } = this.context
    let { newEmail } = this.state
    
    this.setState({
      emailBusy: true,
      emailError: false
    })

    updateEmail(auth.currentUser, newEmail)
      .then(() => this.setState({
          showEmail: false,
          newEmail: '',
          emailBusy: false,
          emailError: false
        }, () => {
          console.log('Profile', 'email updated', newEmail)
          this.context.refresh()
        })
      )
      .catch((e) => {
        this.setState({
          emailBusy: false,
          emailError: true
        }, () => console.log('Profile', 'error updating email', e))
      })
  }

  updatePassword = async () => {
    let { auth } = this.context
    let { newPassword } = this.state
    
    this.setState({
      passwordBusy: true,
      passwordError: false
    })

    await setDoc(doc(fire, 'users', 'XQb2ICAUlPNtAhw8jwv6'), {
      address: 'some address'
    }, { merge: true })
      .then(x => console.log('success', x))
      .catch(e => console.log('error', e))

    updatePassword(auth.currentUser, newPassword)
      .then(() => {
        try { this.context.refresh() } catch(e){console.log('refresh error', e)}
        finally {
          this.setState({
            showPassword: false,
            newPassword: '',
            passwordBusy: false,
            passwordError: false
          }, () => {
            console.log('Profile', 'password updated', newPassword)
            // this.context.refresh()
          })
        }
      })
      .catch((e) => {
        this.setState({
          passwordBusy: false,
          passwordError: true
        }, () => console.log('Profile', 'error updating password', e))
      })
    
  }

  updatePhone = async () => {
    let { auth, user, fire } = this.context
    let { newPhone } = this.state
    let { uid } = user
    
    this.setState({
      phoneBusy: true,
      phoneError: false
    })

    await setDoc(doc(fire, 'users', uid), {
      phone: newPhone
    }, { merge: true })
      .then(() => {
        try { this.context.refresh() } catch(e){console.log('refresh error', e)}
        finally {
          this.setState({
            showPhone: false,
            newPhone: '',
            phoneBusy: false,
            phoneError: false
          }, () => {
            console.log('Profile', 'phone updated', newPhone)
            this.context.refresh()
          })
        }
      })
      .catch((e) => {
        this.setState({
          phoneBusy: false,
          phoneError: true
        }, () => console.log('Profile', 'error updating phone number', e))
      })
  }

  modals = () => {
    let html = []
    let { nameNew, nameShow, nameBusy, nameError, showEmail, newEmail, emailBusy, emailError, showPhone, newPhone, phoneBusy, phoneError, showAddress, newAddress, addressBusy, addressError, newPassword, showPassword, passwordBusy, passwordError, loginPassword, showLogin, loginBusy, loginError } = this.state

    let list = [
      { x: 'Name', show: nameShow, showName: 'nameShow', new: nameNew, newName: 'nameNew', busy: nameBusy, error: nameError },
      { x: 'Email', show: showEmail, showName: 'showEmail', new: newEmail, newName: 'newEmail', busy: emailBusy, error: emailError },
      { x: 'Phone', show: showPhone, showName: 'showPhone', new: newPhone, newName: 'newPhone', busy: phoneBusy, error: phoneError },
      { x: 'Address', show: showAddress, showName: 'showAddress', new: newAddress, newName: 'newAddress', busy: addressBusy, error: addressError },
      { x: 'Password', show: showPassword, showName: 'showPassword', new: newPassword, newName: 'newPassword', busy: passwordBusy, error: passwordError }
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
                { x.x === 'Phone' ?
                <Input
                  value={x.new}
                  placeholder='XXX-XXX-XXXX'
                  keyboardType='phone-pad'
                  textContentType='telephoneNumber'
                  onChangeText={y => this.setState({ [x.newName]: y })}
                />
                : <Input
                  value={x.new}
                  onChangeText={y => this.setState({ [x.newName]: y })}
                /> }
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
                  x.x === 'Name' ? this.updateDisplayName() :
                  x.x === 'Email' ? this.updateEmail() :
                  x.x === 'Phone' ? this.updatePhone() :
                  x.x === 'Address' ? this.updateAddress() :
                  this.updatePassword()
                }}
              >{x.busy ? '' : 'Save'}</Button>
            </Button.Group>
          </Modal.Content>
        </Modal>
      )
    })

    html.push(
      <Modal
        key={1}
        isOpen={showLogin}
        onClose={() => this.setState({ showLogin: false })}
      >
        <Modal.Content w={wp(80)}>
          <Modal.CloseButton />
          <Modal.Header>Verify Login</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Please Re-Enter Your Password</FormControl.Label>
              <Input
                value={loginPassword}
                onChangeText={y => this.setState({ loginPassword: y })}
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
              onPress={() => this.setState({ showLogin: false })}
            >Cancel</Button>
            <Button
              isLoading={loginBusy}
              onPress={() => this.reauthenticate()}
            >{loginBusy ? '' : 'Save'}</Button>
          </Button.Group>
        </Modal.Content>
      </Modal>
    )

    return html
  }

  render() {

    let { user } = this.context

    return (
      <Box
        flex='1'
        p={wp(5)}
        bg='primary.1'
      >
        <Center
          bg='white'
          borderRadius='40'
        >
          <Stack w='90%'
            my={wp(5)}
            space={wp(3)}
            // borderWidth='1'
          >
  
            <Row>
              <Box flex='4'>
                <Text>Display Name:</Text>
              </Box>
              <Box flex='6'>
                <Text textAlign='right'>{user.name}</Text>
                <Text bold underline color='green.600'
                  fontSize='10'
                  alignSelf='flex-end'
                  onPress={() => this.setState({ nameShow: true })}
                >Press Here to Edit</Text>
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
                  onPress={() => this.setState({ emailOrPassword: 'email', showLogin: true })}
                  // onPress={() => this.setState({ showEmail: true })}
                >Press Here to Edit</Text>
              </Box>
            </Row>
    
            <Row>
              <Box flex='4'>
                <Text>Phone Number:</Text>
              </Box>
              <Box flex='6'>
                <Text textAlign='right'>{user.phone ? user.phone : 'No Phone Number Saved'}</Text>
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
                <Text textAlign='right' lineHeight={wp(3.2)}>{user.address ? user.address.replace(/([,][\s])/, `\n`) : 'No Address Saved'}</Text>
                <Text bold underline color='green.600'
                  fontSize='10'
                  alignSelf='flex-end'
                  onPress={() => this.context.navigation.navigate('Location')}
                >Press Here to Edit</Text>
              </Box>
            </Row>
  
            <Text bold underline color='green.600'
              fontSize='10'
              alignSelf='flex-end'
              onPress={() => this.setState({ emailOrPassword: 'password', showLogin: true })}
              // onPress={() => this.setState({ showPassword: true })}
            >Press Here to Change Password</Text>
    
            <Button
              mt={wp(1)}
              onPress={() => this.context.logout()}
            >Logout</Button>
  
          </Stack>
          {this.modals()}
        </Center>
      </Box>
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