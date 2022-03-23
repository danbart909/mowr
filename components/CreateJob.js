import React, { Component } from 'react'
import { Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import Context from '../context/Context.js'
import { Box, Button, Center, Factory, FormControl, Heading, Input, Row, ScrollView, Select, Stack, Spinner, TextArea, Text, KeyboardAvoidingView, Modal } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'
import { collection, doc, setDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore'
import { add, set } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import { HelpIcon } from '../config/helper.js'

export default class CreateJob extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      type: 'Yardwork',
      tip: '',
      endDate: '',
      endTime: '',
      endDateTime: new Date(),
      pickerMode: 'date',
      firstCheck: false,
      busy: false,
      error: false,
      showDatePicker: false,
      standingOffer: false,
      showModal: false,
      modalTitle: '',
      modalText: ''
    }
  }

  static contextType = Context

  combineDateAndTime = () => {
    let { endDate, endTime } = this.state

    this.setState({ endDateTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes()) })
  }

  makeStandingOffer = () => {
    let { standingOffer } = this.state
    
    if (standingOffer) {
      this.setState({
        standingOffer: false,
        endDateTime: new Date()
      })
    } else {
      this.setState({
        standingOffer: true,
        endDateTime: new Date(2022, 11, 31, 23, 59, 59)
        // endDateTime: null,
      })
    }
  }

  showModal = (x) => {
    let text = ''
    let textArray = [
      "Maximum limit is 60 characters.",
      "Please enter a number, no dollar sign needed.\n\nSupport for hourly tips will be coming in the near future, but for now please be sure to specify this in the description.\n\nAn amount of 0 will also be accepted.",
      "Select how you'd like to classify this job. Additional options to be included at a later date. Feel free to offer any suggestions you have for this.",
      "Your address, phone number, and email information are already included with the job, so there's no need to write those in if you don't want to.\n\nIf you want to make the tip hourly, be sure to specify it here.\n\nBe sure to include not just basic information about the job, but also things like your expectations about the job and the worker who should apply. Most people who will be searching for jobs using this app will have limited professional experience in landscaping or other applicable fields.",
      "If you don't want to set a deadline, you can choose to make a Standing Offer. Standing Offers have their deadline set to the last day of the year.\n\nIf you need to change a deadline later, please delete the job and make a new one. Support for changing deadlines will be re-added at a later date."
      // \n\nIf your expectations aren't somewhat reasonable, it is unlikely you will get satisfactory help here.
    ]
    if (x === 'title') { text = textArray[0] }
    else if (x === 'tip') { text = textArray[1] }
    else if (x === 'type') { text = textArray[2] }
    else if (x === 'description') { text = textArray[3] }
    else if (x === 'deadline') { text = textArray[4] }
    else { null }
    this.setState({ showModal: true, modalText: text, modalTitle: x.toUpperCase() })
  }

  submit = async () => {
    let { user, fire } = this.context
    let { title, description, type, tip, endDate, endTime, endDateTime, standingOffer } = this.state
    let { address, phone, email, uid, name, latitude, longitude } = user

    if (endDate === '' && standingOffer === false) { alert('Please select an End Date') }
    else if (endTime === '' && standingOffer === false) { alert('Please select a Time after you select a Date./\n/If you do not want to select a time, please select 12:00 PM (Noon)') }

    // let endDateAndTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes())

    if (user.address === '' || user.phone === '') { alert("You don't have a phone number or address saved. Both are needed to create a job. Please go to the Profile page in the menu to set them.") }
    else if (title === '') { alert('Please enter a Title') }
    else if (description === '') { alert('Please enter a Description') }
    else if (type === '') { alert('Please select a Type of Job') }
    else if (tip === '') { alert('Please enter a Tip.') }
    else if (isNaN(tip)) { alert('Please enter in only numbers for the tip.') }
    else {
      this.setState({ busy: true })
      await addDoc(collection(fire, 'jobs'), {
        userId: uid,
        userName: name,
        title: title,
        phone: phone,
        email: email,
        address: address,
        latitude: latitude,
        longitude: longitude,
        description: description,
        creationDate: new Date(),
        type: type,
        tip: parseInt(tip),
        endDate: endDateTime,
      })
        .then(async (x) => {
          this.setState({
            title: '',
            description: '',
            type: 'Yardwork',
            tip: '',
            endDate: '',
            endTime: '',
            endDateTime: new Date(),
            pickerMode: 'date',
            firstCheck: false,
            busy: false,
            error: false,
            showDatePicker: false,
            standingOffer: false,
          })
          this.context.refreshUserJobs()
          console.log('Create Job', 'job created')
          this.context.navigation.navigate('Manage Jobs')
        })
        .catch((e) => {
          this.setState({
            busy: false,
            error: true
          }, () => console.log('Create Job', 'error creating job', e))
        })
    }
  }

  render() {

    let { address, phone } = this.context.user
    let { title, description, type, tip, endDate, endTime, endDateTime, showDatePicker, pickerMode, busy, error, standingOffer, showModal, modalText, modalTitle } = this.state
    let dtText = () => {
      if (endDate !== '' && endTime !== '') {
        return `${endDateTime}`
      } else if (standingOffer) {
        return `${new Date(2022, 11, 31, 23, 59, 59)}`
      } else {
        return 'Press the "Set Deadline" Button Above to Set a Date and Time'
      }
    }

    return (
      <ScrollView
        // p={wp(5)}
        bg='primary.1'
      >
        <LinearGradient
          colors={['#289d15', '#ffffff']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Stack
              p={wp(3)}
              space={wp(2)}
            >
              <Box>
                <Text fontSize={wp(6)}>Title</Text>
                <Input
                  // onEndEditing={() => Keyboard.dismiss()}
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  bg='white'
                  onChangeText={(x) => this.setState({ title: x })}
                  value={title}
                />
              </Box>
  
              <Row>
                <Box flex='1' mr={wp(1)}>
                  <Row
                    alignItems='center'
                    justifyContent='space-between'
                    pb={wp(1)}
                    mr={wp(1)}
                  >
                    <Text fontSize={wp(6)}>Tip</Text>
                    <HelpIcon
                      onPress={() => this.showModal('tip')}
                    />
                  </Row>
                  <Input
                    // w={wp(70)}
                    // onEndEditing={() => Keyboard.dismiss()}
                    fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                    placeholder='Numbers only please'
                    bg='white'
                    onChangeText={(x) => this.setState({ tip: x })}
                    value={tip}
                  />
                </Box>
                <Box flex='1' ml={wp(1)}>
                  <Row
                    alignItems='center'
                    justifyContent='space-between'
                    pb={wp(1)}
                    mr={wp(1)}
                  >
                    <Text fontSize={wp(6)}>Type</Text>
                    <HelpIcon
                      onPress={() => this.showModal('type')}
                    />
                  </Row>
                  <Select
                    bg='white'
                    fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                    selectedValue={type}
                    onValueChange={(x) => this.setState({ type: x })}
                    ref='type'
                    _item={{ backgroundColor: 'white' }}
                  >
                    <Select.Item p={wp(3)} label='Yardwork' value='Yardwork' />
                    <Select.Item p={wp(3)} label='Child Care' value='Child Care' />
                    <Select.Item p={wp(3)} label='Other' value='Other' />
                  </Select>
                </Box>
              </Row>
  
              <Box>
                <Row
                  alignItems='center'
                  justifyContent='space-between'
                  pb={wp(1)}
                  mr={wp(1)}
                >
                  <Text fontSize={wp(6)}>Description</Text>
                  <HelpIcon
                    onPress={() => this.showModal('description')}
                  />
                </Row>
                <TextArea
                  h={wp(40)}
                  // w={wp(70)}
                  p={wp(2)}
                  bg='white'
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  onChangeText={(x) => this.setState({ description: x })}
                  value={description}
                />
              </Box>
  
              <Stack
                mt={wp(6)}
                space={wp(6)}
                // borderWidth='1'
              >
                <Row
                  justifyContent='space-evenly'
                  alignItems='center'
                >
                  <Button
                    // w='50%'
                    disabled={standingOffer ? true : false}
                    bg={standingOffer ? 'coolGray.400' : 'darkgreen'}
                    alignSelf='center'
                    textAlign='center'
                    onPress={() => this.setState({ showDatePicker: true })}
                  >Set Deadline</Button>
                  <Button
                    alignSelf='center'
                    textAlign='center'
                    bg={standingOffer ? 'primary.101' : 'darkgreen'}
                    onPress={() => this.makeStandingOffer()}
                  >Standing Offer</Button>
                  <HelpIcon
                    onPress={() => this.showModal('deadline')}
                  />
                </Row>
                {/* <Input
                  bg='white'
                  fontSize={Platform.OS === 'ios' ? wp(4.5) : wp(3)}
                  variant='rounded'
                  caretHidden={true}
                  pl={wp(2)}
                  value={dtText()}
                /> */}
                <Box
                  bg='white'
                  mb={wp(1)}
                  borderRadius='35'
                >
                  <Text
                    p={wp(2)}
                    textAlign='center'
                  >{dtText()}</Text>
                </Box>
              </Stack>
  
              {showDatePicker && (
                <DateTimePicker
                  value={endDateTime}
                  mode={pickerMode}
                  // mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={5}
                  maximumDate={new Date(add(new Date(), { days: 60 }))}
                  minimumDate={new Date()}
                  onChange={async (event, date) => {
                    pickerMode === 'date' ?
                    this.setState({ pickerMode: 'time', endDate: new Date(date)}) :
                    this.setState({ pickerMode: 'date', showDatePicker: false, endTime: new Date(date)}, () => this.combineDateAndTime())
                  }}
                />
              )}
            </Stack>
          </KeyboardAvoidingView>

          {/* <Stack
            p={wp(3)}
            space={wp(5)}
          >
            <Text>If you don't want to set a deadline, you can choose to make a Standing Offer. Standing Offers have their deadline set to the last day of the year.</Text>
            <Text>Support for hourly tips will be coming in the near future, but for now please be sure to specify this in the description.</Text>
          </Stack> */}
  
          <Stack
            p={wp(3)}
            space={wp(5)}
            // borderWidth='1'
          >
            <Text fontSize={wp(6)}>Your Saved Address:</Text>

            {address ?
            <Text textAlign='right'>{address.replace(/([,][\s])/, `\n`)}</Text> :
            <Stack>
              <Text color='darkred'>I'm sorry, but an error occured when you signed up and your address wasn't saved. Please go to your Profile to set an address.</Text>
              <Button alignSelf='center' w='30%' onPress={() => this.context.navigation.navigate('Profile')}>Profile</Button>
            </Stack>}

            <Text fontSize={wp(6)}>Your Phone Number:</Text>

            {phone ?
            <Text textAlign='right'>{phone}</Text> :
            <Stack>
              <Text color='darkred'>I'm sorry, but an error occured when you signed up and your phone number wasn't saved. Please go to your Profile to set a phone number.</Text>
              <Button alignSelf='center' w='30%' onPress={() => this.context.navigation.navigate('Profile')}>Profile</Button>
            </Stack>}

          </Stack>

          { error && <Text textAlign='center' color='red.400'>An error occured. Please try again.</Text> }
  
          <Button
            isLoading={busy}
            w='80%'
            my={wp(12)}
            // mb={wp(8)}
            alignSelf='center'
            onPress={() => this.submit()}
          >Create Job</Button>

        </LinearGradient>

        <Modal
          isOpen={showModal}
          onClose={() => this.setState({ showModal: false })}
          size={'xl'}
        >
          <Modal.Content>
            <Modal.Header><Text>{modalTitle}</Text></Modal.Header>
            <Modal.Body>
              <Text>{modalText}</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onPress={() => this.setState({ showModal: false })}
              >Close</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

      </ScrollView>
    )
  }
}