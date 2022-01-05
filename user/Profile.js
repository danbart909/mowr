import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, FormControl, Heading, Input, Modal, Stack, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'

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
    let credential = author.EmailAuthProvider.credential(user.email, loginPassword)

    author.reauthenticateWithCredential(auth.currentUser, credential)
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

    author.updateProfile(auth.currentUser, { displayName: nameNew })
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

    author.updateEmail(auth.currentUser, newEmail)
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

    author.updatePassword(auth.currentUser, newPassword)
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

  updatePhone = () => {
    let { auth, db, user } = this.context
    let { ref, get, child, update } = database
    let { newPhone } = this.state
    
    this.setState({
      phoneNumberBusy: true,
      phoneNumberError: false
    })

    // author.updateProfile(auth.currentUser, { phoneNumber: phoneNumber })
    update(ref(db, 'users/' + user.uid), { phoneNumber: newPhone })
      .then(() => {
        try { this.context.refresh() } catch(e){console.log('refresh error', e)}
        finally {
          this.setState({
            showPhone: false,
            newPhone: '',
            phoneNumberBusy: false,
            phoneNumberError: false
          }, () => {
            console.log('Profile', 'phone updated', newPhone)
            // this.context.refresh()
          })
        }
      })
      .catch((e) => {
        this.setState({
          phoneNumberBusy: false,
          phoneNumberError: true
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
              <Text textAlign='right'>{user.address ? user.address.replace(/([,][\s])/, `\n`) : 'No Address Saved'}</Text>
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

  // updateDisplayName = () => {
  //   let { auth } = this.context
  //   let { displayName } = this.state
    
  //   this.setState({
  //     displayNameBusy: true,
  //     displayNameError: false
  //   })

  //   author.updateProfile(auth.currentUser, { displayName: displayName })
  //     .then(() => {
  //       try { this.context.refresh() } catch(e){console.log(e)}
  //       finally {
  //         this.setState({
  //           displayName: '',
  //           displayNameBusy: false,
  //           displayNameError: false
  //         }, () => console.log('Profile', 'name updated', { displayName: displayName }))
  //       }
  //     })
  //     .catch((e) => {
  //       this.setState({
  //         displayNameBusy: false,
  //         displayNameError: true
  //       }, () => console.log('Profile', 'error updating name', e))
  //     })
  // }












//   <Modal
//   isOpen={showEmail}
//   onClose={() => this.setState({ showEmail: false })}
// >
//   <Modal.Content w={wp(80)}>
//     <Modal.CloseButton />
//     <Modal.Header>Change Email</Modal.Header>
//     <Modal.Body>
//       <FormControl>
//         <FormControl.Label>Change Email</FormControl.Label>
//         <Input
//           value={newEmail}
//           onChangeText={x => this.setState({ newEmail: x })}
//         />
//       </FormControl>
//     </Modal.Body>
//     <Button.Group
//       space={wp(2)}
//       alignSelf='flex-end'
//       pr={wp(2)}
//       pb={wp(2)}
//     >
//       <Button
//         variant='ghost'
//         onPress={() => this.setState({ showEmail: false })}
//       >Cancel</Button>
//       <Button
//         onPress={() => {
//           this.setState({ showEmail: false, newEmail: '' })
//         }}
//       >Save</Button>
//     </Button.Group>
//   </Modal.Content>
// </Modal>

// <Modal
//   isOpen={showPhone}
//   onClose={() => this.setState({ showPhone: false })}
// >
//   <Modal.Content w={wp(80)}>
//     <Modal.CloseButton />
//     <Modal.Header>Change Phone</Modal.Header>
//     <Modal.Body>
//       <FormControl>
//         <FormControl.Label>Change Phone</FormControl.Label>
//         <Input
//           value={newPhone}
//           onChangeText={x => this.setState({ newPhone: x })}
//         />
//       </FormControl>
//     </Modal.Body>
//     <Button.Group
//       space={wp(2)}
//       alignSelf='flex-end'
//       pr={wp(2)}
//       pb={wp(2)}
//     >
//       <Button
//         variant='ghost'
//         onPress={() => this.setState({ showPhone: false })}
//       >Cancel</Button>
//       <Button
//         onPress={() => {
//           this.setState({ showPhone: false, newPhone: '' })
//         }}
//       >Save</Button>
//     </Button.Group>
//   </Modal.Content>
// </Modal>

// <Modal
//   isOpen={showAddress}
//   onClose={() => this.setState({ showAddress: false })}
// >
//   <Modal.Content w={wp(80)}>
//     <Modal.CloseButton />
//     <Modal.Header>Change Address</Modal.Header>
//     <Modal.Body>
//       <FormControl>
//         <FormControl.Label>Change Address</FormControl.Label>
//         <Input
//           value={newAddress}
//           onChangeText={x => this.setState({ newAddress: x })}
//         />
//       </FormControl>
//     </Modal.Body>
//     <Button.Group
//       space={wp(2)}
//       alignSelf='flex-end'
//       pr={wp(2)}
//       pb={wp(2)}
//     >
//       <Button
//         variant='ghost'
//         onPress={() => this.setState({ showAddress: false })}
//       >Cancel</Button>
//       <Button
//         onPress={() => {
//           this.setState({ showAddress: false, newAddress: '' })
//         }}
//       >Save</Button>
//     </Button.Group>
//   </Modal.Content>
// </Modal>