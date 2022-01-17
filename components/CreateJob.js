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
      phone: '',
      description: '',
      type: 'Yardwork',
      tip: '',
      endDate: '',
      address: '',
      latitude: 0,
      longitude: 0,
      firstCheck: false,
      busy: false,
      error: false,
      showDatePicker: false
    }
  }

  static contextType = Context

  componentDidMount() {
    this.setAddressAndPhoneOnMount()
  }

  setAddressAndPhoneOnMount = () => {
    let { address, geo, phoneNumber } = this.context.user
    let state = this.state
    state.address = address
    state.latitude = geo.latitude
    state.longitude = geo.longitude
    state.phone = phoneNumber
    this.setState(state)
    console.log('CreateJob - setAddressAndPhoneOnMount() - sets address, latitude, longitude, and phone for the form')
  }

  submit = async () => {
    let { user, fire } = this.context
    let { title, phone, address, description, type, tip, endDate, latitude, longitude } = this.state
    let random = String(Math.random())
    let jobID = random.slice(-14)
    let creationDate = format(new Date(), 'yyyy-MM-dd')

    if (title === '') {
      alert('Please enter a Title')
    } else if (phone === '') {
      alert('Please enter a Phone Number')
    } else if (address === '') {
      alert('Please enter an Address')
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
    } else {
      this.setState({ busy: true })
      // push(ref(db, 'jobs/'), {
      //   ID: jobID,
      //   provider: user.uid,
      //   name: user.displayName,
      //   title: title,
      //   phone: phone,
      //   email: user.email,
      //   address: address,
      //   geo: {
      //     lat: latitude,
      //     lng: longitude,
      //   },
      //   description: description,
      //   creationDate: creationDate,
      //   type: type,
      //   tip: parseInt(tip),
      //   endDate: endDate,
      // })
      await addDoc(collection(fire, 'jobs'), {
        userId: user.uid,
        userName: user.displayName,
        title: title,
        phone: phone,
        email: user.email,
        address: address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description,
        creationDate: creationDate,
        type: type,
        tip: parseFloat(tip),
        endDate: endDate,
      })
        .then(() => {
          this.setState({
            title: '',
            description: '',
            type: 'Yardwork',
            tip: '',
            endDate: '',
            busy: false,
            error: false
          }, () => console.log('Create Job', 'job created'))
          this.context.refresh()
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
    let { type, title, description, address, phone, tip, endDate } = this.state
    let list = [
      { x: type, y: 'Type', z: 'type' },
      { x: title, y: 'Title', z: 'title'},
      { x: description, y: 'Description', z: 'description'},
      { x: address, y: 'Address', z: 'address'},
      { x: phone, y: 'Phone', z: 'phone'},
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
              onFocus={() => this.setState({ showDatePicker: true })}
              value={endDate}
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

    let { type, title, description, address, phone, tip, endDate, showDatePicker } = this.state

    return (
      <ScrollView>

        {this.renderList()}

        <Button
          w='80%'
          m={wp(5)}
          onPress={() => this.submit()}
          alignSelf='center'
        >Create Job</Button>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            onChange={(event, date) => this.setState({ endDate: format(date, 'yyyy-MM-dd'), showDatePicker: false })}
          />
        )}

      </ScrollView>
    )
  }
}















// return (
//   <ScrollView>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>Type</FormControl.Label>
//       <Select
//         // w={wp(70)}
//         bg='white'
//         selectedValue={type}
//         onValueChange={(x) => this.setState({ type: x })}
//       >
//         <Select.Item p={wp(3)} label='Yardwork' value='Yardwork' />
//         <Select.Item p={wp(3)} label='Child Care' value='Child Care' />
//         <Select.Item p={wp(3)} label='Other' value='Other' />
//       </Select>
//     </FormControl>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>Title</FormControl.Label>
//       <Input
//         // w={wp(70)}
//         bg='white'
//         onChangeText={(x) => this.setState({ title: x })}
//         value={title}
//       />
//     </FormControl>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>Description</FormControl.Label>
//       <TextArea
//         h={wp(40)}
//         // w={wp(70)}
//         p={wp(2)}
//         bg='white'
//         onChangeText={(x) => this.setState({ description: x })}
//         value={description}
//       />
//     </FormControl>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>Address</FormControl.Label>
//       <Input
//         // w={wp(70)}
//         bg='white'
//         onChangeText={(x) => this.setState({ address: x })}
//         value={address}
//       />
//     </FormControl>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>Phone</FormControl.Label>
//       <Input
//         // w={wp(70)}
//         bg='white'
//         onChangeText={(x) => this.setState({ phone: x })}
//         value={phone}
//       />
//     </FormControl>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>Tip</FormControl.Label>
//       <Input
//         // w={wp(70)}
//         bg='white'
//         onChangeText={(x) => this.setState({ tip: x })}
//         value={tip}
//       />
//     </FormControl>

//     <FormControl
//       p={wp(3)}
//       mt={wp(2)}
//     >
//       <FormControl.Label pb='5'>End Date</FormControl.Label>
//       <Input
//         // w={wp(70)}
//         bg='white'
//         onFocus={() => this.setState({ showDatePicker: true })}
//         value={endDate}
//       />
//     </FormControl>

//     <Button
//       w='80%'
//       m={wp(5)}
//       onPress={() => console.log('Create Job')}
//       alignSelf='center'
//     >Create Job</Button>

//     {showDatePicker && (
//       <DateTimePicker
//         value={new Date()}
//         onChange={(event, date) => this.setState({ endDate: dFNS.format(date, 'yyyy-MM-dd'), showDatePicker: false })}
//       />
//     )}

//   </ScrollView>
// )