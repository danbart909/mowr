import React, { Component } from 'react'
import Context from '../context/Context'
import { Box, Button, Center, Factory, FormControl, Heading, Input, Modal, ScrollView, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { EmailAuthProvider, updatePassword, updateEmail, updateProfile, reauthenticateWithCredential } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

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
      keyboard: false,
    }
  }

  static contextType = Context

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({ keyboard: true })
    )
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({ keyboard: false }
    ))
  }
    
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

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
        <TouchableWithoutFeedback key={x.x} onPress={() => Keyboard.dismiss()}>
          <Modal
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
                    // autoFocus
                    onEndEditing={() => Keyboard.dismiss()}
                    value={x.new}
                    placeholder='XXX-XXX-XXXX'
                    onChangeText={y => this.setState({ [x.newName]: y })}
                  />
                  : <Input
                    // autoFocus
                    onEndEditing={() => Keyboard.dismiss()}
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
        </TouchableWithoutFeedback>
      )
    })

    html.push(
      <TouchableWithoutFeedback key={1} onPress={() => Keyboard.dismiss()}>
        <Modal
          isOpen={showLogin}
          onClose={() => this.setState({ showLogin: false })}
        >
          <Modal.Content
            w={wp(80)}
            borderRadius='3'
          >
            <Modal.CloseButton />
            <Modal.Header>Verify Login</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Please Re-Enter Your Password</FormControl.Label>
                <Input
                  onEndEditing={() => Keyboard.dismiss()}
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
      </TouchableWithoutFeedback>
    )

    return html
  }

  render() {

    let { user } = this.context

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView>
          <Box
            flex='1'
            // p={wp(5)}
            bg='primary.1'
          >
            <ScrollView>
              <LinearGradient
                colors={['#289d15', '#ffffff']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
              >
                <Stack
                  space={wp(10)}
                  pt={wp(5)}
                  px={wp(4)}
                  mt={wp(1)}
                >
      
                  <Stack space={wp(2)}>
                    <Row
                      pb={wp(1)}
                      justifyContent='space-between'
                      borderBottomWidth='1'
                    >
                      <Heading py={wp(1)} fontSize={wp(7)}>Name</Heading>
                      <Text
                        px={wp(2)}
                        py={wp(1)}
                        mr={wp(1)}
                        mt={wp(1)}
                        color='darkgreen'
                        borderColor='primary.1'
                        borderWidth='1'
                        onPress={() => this.setState({ nameShow: true })}
                      >Edit</Text>
                    </Row>
                    <Text>{user.name}</Text>
                  </Stack>
      
                  <Stack space={wp(2)}>
                    <Row
                      pb={wp(1)}
                      justifyContent='space-between'
                      borderBottomWidth='1'
                    >
                      <Heading py={wp(1)} fontSize={wp(7)}>Email</Heading>
                      <Text
                        px={wp(2)}
                        py={wp(1)}
                        mr={wp(1)}
                        mt={wp(1)}
                        color='darkgreen'
                        borderColor='primary.1'
                        borderWidth='1'
                        onPress={() => this.setState({ showEmail: true })}
                      >Edit</Text>
                    </Row>
                    <Text>{user.email}</Text>
                  </Stack>
      
                  <Stack space={wp(2)}>
                    <Row
                      pb={wp(1)}
                      justifyContent='space-between'
                      borderBottomWidth='1'
                    >
                      <Heading py={wp(1)} fontSize={wp(7)}>Phone</Heading>
                      <Text
                        px={wp(2)}
                        py={wp(1)}
                        mr={wp(1)}
                        mt={wp(1)}
                        color='darkgreen'
                        borderColor='primary.1'
                        borderWidth='1'
                        onPress={() => this.setState({ showPhone: true })}
                      >Edit</Text>
                    </Row>
                    <Text>{user.phone}</Text>
                  </Stack>
      
                  <Stack space={wp(2)}>
                    <Row
                      pb={wp(1)}
                      justifyContent='space-between'
                      borderBottomWidth='1'
                    >
                      <Heading py={wp(1)} fontSize={wp(7)}>Address</Heading>
                      <Text
                        px={wp(2)}
                        py={wp(1)}
                        mr={wp(1)}
                        mt={wp(1)}
                        color='darkgreen'
                        borderColor='primary.1'
                        borderWidth='1'
                        onPress={() => this.context.navigation.navigate('Location')}
                      >Edit</Text>
                    </Row>
                    <Text>{user.address.replace(/([,][\s])/, `\n`)}</Text>
                  </Stack>
                  
                  <Stack
                    mt={wp(2)}
                    mb={wp(6)}
                    w='60%'
                    space={wp(3)}
                    justifyContent='space-evenly'
                    alignSelf='center'
                    // borderWidth='1'
                  >
                    <Button
                      onPress={() => this.context.navigation.navigate('Manage Jobs')}
                    >Manage Your Jobs</Button>
                    <Button
                      onPress={() => this.setState({ showPassword: true })}
                    >Change Password</Button>
                    <Button
                      // variant='outline'
                      onPress={() => this.context.logout()}
                    >Logout</Button>
                  </Stack>
      
                </Stack>
              </LinearGradient>
            </ScrollView>
            {this.modals()}
          </Box>
        </ScrollView>
      </TouchableWithoutFeedback>
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