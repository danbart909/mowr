import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, FormControl, Heading, Input, Row, ScrollView, Select, Stack, Spinner, TextArea, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'
import { collection, doc, setDoc, addDoc, getDoc, Timestamp } from 'firebase/firestore'
import { format } from 'date-fns'

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
      pickerMode: 'date',
      firstCheck: false,
      busy: false,
      error: false,
      showDatePicker: false,
      showTimePicker: false,
    }
  }

  static contextType = Context

  componentDidMount() {
  }

  submit = async () => {
    let { user, fire } = this.context
    let { title, description, type, tip, endDate, endTime } = this.state
    let { address, phone, email, uid, name, latitude, longitude } = user
    let creationDate = format(new Date(), 'PPPPp')
    let endDateAndTime = `${endDate} at ${endTime}`

    if (title === '') {
      alert('Please enter a Title')
    } else if (description === '') {
      alert('Please enter a Description')
    } else if (type === '') {
      alert('Please select a Type of Job')
    } else if (tip === '') {
      alert('Please enter a Tip.')
    } else if (isNaN(tip)) {
      alert('Tip must be a number.')
    } else if (endDate === '') {
      alert('Please select an End Date')
    } else if (endTime === '') {
      alert('Please select a Time./\n/If you do not want to select a time, please select 12:00 PM (Noon)')
    } else {
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
        creationDate: creationDate,
        type: type,
        tip: parseFloat(tip).toFixed(2),
        endDate: endDateAndTime,
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
          console.log('Create Job', 'job created', x)
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

  renderList = () => {
    let html = []
    let i = 0
    let { type, title, description, tip, endDate, endTime } = this.state
    let list = [
      // { x: type, y: 'Type', z: 'type' },
      { x: title, y: 'Title', z: 'title'},
      { x: description, y: 'Description', z: 'description'},
      { x: tip, y: 'Tip', z: 'tip'},
      { x: endDate, y: 'Deadline', z: 'endDate'},
    ]

    list.map(x => {
      html.push(
        <Box key={i++}>
          <Text pb={wp(1)}>{x.y}</Text>
          { x.z === 'type' ?
            <Select
              bg='white'
              selectedValue={type}
              onValueChange={(k) => this.setState({ type: k })}
              ref='type'
            >
              <Select.Item p={wp(3)} label='Yardwork' value='Yardwork' />
              <Select.Item p={wp(3)} label='Child Care' value='Child Care' />
              <Select.Item p={wp(3)} label='Other' value='Other' />
            </Select> :
          x.z === 'description' ?
            <TextArea
              h={wp(40)}
              // w={wp(70)}
              p={wp(2)}
              bg='white'
              onChangeText={(k) => this.setState({ description: k })}
              value={description}
            /> :
          x.z === 'endDate' ?
            <Input
              // w={wp(70)}
              bg='white'
              variant='rounded'
              onFocus={() => this.setState({ showDatePicker: true })}
              caretHidden={true}
              value={(endDate !== '' && endTime !== '') ? `${endDate} at ${endTime}` : 'Press Here to Set a Date and Time'}
            /> :
            <Input
              // w={wp(70)}
              bg='white'
              onChangeText={(k) => this.setState({ [x.z]: k })}
              value={x.x}
            />
          }
        </Box>
      )
    })

    return (
      <Stack
        p={wp(3)}
        mt={wp(2)}
      >
        {html}
      </Stack>
    )
  }

  render() {

    let { address, phone } = this.context.user
    let { endDate, showDatePicker, showTimePicker, pickerMode } = this.state

    return (
      <ScrollView
        p={wp(5)}
        bg='primary.1'
      >

        <Box
          bg='white'
          borderRadius='40'
        >
          {this.renderList()}
  
          <Box
            p={wp(3)}
            // mt={wp(2)}
          >
            <Text pb={wp(1)}>Address</Text>
            <Text pb={wp(1)}>{address}</Text>
            <Text pb={wp(1)}>Phone</Text>
            <Text pb={wp(1)}>{phone}</Text>
          </Box>
  
          <Button
            w='80%'
            m={wp(5)}
            onPress={() => this.submit()}
            alignSelf='center'
          >Create Job</Button>
        </Box>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode={pickerMode}
            minuteInterval={5}
            onChange={(event, date) => {
              pickerMode === 'date' ?
              this.setState({ pickerMode: 'time', endDate: format(date, 'PPPP')}) :
              this.setState({ pickerMode: 'date', showDatePicker: false, endTime: format(date, 'p')})
            }}
            // onChange={(event, date) => this.setState({ endDate: format(date, 'yyyy-MM-dd'), showDatePicker: false, showTimePicker: true })}
          />
        )}

      </ScrollView>
    )
  }
}