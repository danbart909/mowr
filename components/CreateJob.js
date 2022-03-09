import React, { Component } from 'react'
import { Platform } from 'react-native'
import Context from '../context/Context.js'
import { Box, Button, Center, Factory, FormControl, Heading, Input, Row, ScrollView, Select, Stack, Spinner, TextArea, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'
import { collection, doc, setDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore'
import { format, parseISO, toString } from 'date-fns'
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

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

  combineDateAndTime = () => {
    let { endDate, endTime } = this.state

    this.setState({ endDateTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes()) })
  }

  submit = async () => {
    let { user, fire } = this.context
    let { title, description, type, tip, endDate, endTime, endDateTime } = this.state
    let { address, phone, email, uid, name, latitude, longitude } = user

    if (endDate === '') { alert('Please select an End Date') }
    else if (endTime === '') { alert('Please select a Time after you select a Date./\n/If you do not want to select a time, please select 12:00 PM (Noon)') }

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
            busy: false,
            error: false
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
    let { title, description, type, tip, endDate, endTime, endDateTime, showDatePicker, pickerMode, busy, error } = this.state

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView
          // p={wp(5)}
          bg='primary.1'
        >
  
          <LinearGradient
            colors={['#289d15', '#ffffff']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
          >
            <Stack
              p={wp(3)}
            >
              <Box>
                <Text pb={wp(1)}>Title</Text>
                <Input
                  // autoFocus
                  // w={wp(70)}
                  onEndEditing={() => Keyboard.dismiss()}
                  fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
                  bg='white'
                  onChangeText={(x) => this.setState({ title: x })}
                  value={title}
                />
              </Box>
              <Row>
                <Box flex='1' mr={wp(1)}>
                  <Text py={wp(1)}>Tip</Text>
                  <Input
                    // w={wp(70)}
                    onEndEditing={() => Keyboard.dismiss()}
                    fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
                    placeholder='Numbers only please'
                    bg='white'
                    onChangeText={(x) => this.setState({ tip: x })}
                    value={tip}
                  />
                </Box>
                <Box flex='1' ml={wp(1)}>
                  <Text py={wp(1)}>Type</Text>
                  <Select
                    bg='white'
                    fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
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
                <Text py={wp(1)}>Description</Text>
                <TextArea
                  h={wp(40)}
                  // w={wp(70)}
                  p={wp(2)}
                  bg='white'
                  fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
                  onChangeText={(x) => this.setState({ description: x })}
                  value={description}
                />
              </Box>
              <Box>
                <Button
                  w='50%'
                  my={wp(4)}
                  p={wp(1)}
                  alignSelf='center'
                  textAlign='center'
                  onPress={() => this.setState({ showDatePicker: true })}
                  _text={{ color: 'white' }}
                >Deadline</Button>
                <Input
                  // w={wp(70)}
                  // p={Platform.OS === 'ios' ? wp(4) : 0}
                  // p={wp(3)}
                  onEndEditing={() => Keyboard.dismiss()}
                  bg='white'
                  fontSize={Platform.OS === 'ios' ? wp(3.6) : wp(2.5)}
                  variant='rounded'
                  // onFocus={() => this.setState({ showDatePicker: true })}
                  caretHidden={true}
                  value={(endDate !== '' && endTime !== '') ? `${endDateTime}` : 'Press the Button Above to Set a Date and Time'}
                />
              </Box>
              {showDatePicker && (
                <DateTimePicker
                  value={endDateTime}
                  mode={pickerMode}
                  // mode={Platform.OS === 'ios' ? 'datetime' : pickerMode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={5}
                  onChange={async (event, date) => {
                    pickerMode === 'date' ?
                    this.setState({ pickerMode: 'time', endDate: new Date(date)}) :
                    this.setState({ pickerMode: 'date', showDatePicker: false, endTime: new Date(date)}, () => this.combineDateAndTime())
                  }}
                />
              )}
            </Stack>
    
            <Box
              p={wp(3)}
            >
              <Text fontSize={wp(4)}>Your Address:</Text>
              <Text py={wp(1)} fontSize={wp(3)}>{address ? address.replace(/([,][\s])/, `\n`) : 'No Address! Please go to your Profile to set an address.'}</Text>
              {address ? null : <Text bold underline onPress={() => this.context.navigation.navigate('Profile')}>Profile</Text>}
              <Text fontSize={wp(4)} py={wp(1)}>Your Phone Number:</Text>
              <Text fontSize={wp(3)}>{phone ? phone : 'No Phone Number! Please go to your Profile to set a phone number'}</Text>
              {phone ? null : <Text bold underline onPress={() => this.context.navigation.navigate('Profile')}>Profile</Text>}
            </Box>
  
            { error && <Text textAlign='center' color='red.400'>An error occured. Please try again.</Text> }
    
            <Button
              isLoading={busy}
              w='80%'
              m={wp(5)}
              alignSelf='center'
              onPress={() => this.submit()}
            >Create Job</Button>

          </LinearGradient>  
        </ScrollView>
      </TouchableWithoutFeedback>
    )
  }
}