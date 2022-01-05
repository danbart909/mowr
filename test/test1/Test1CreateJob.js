import React, { Component } from 'react'
import Context from '../../context/Context.js'
import { Box, Button, Center, FormControl, Heading, Input, Row, ScrollView, Select, Stack, Spinner, TextArea, Text } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'
import * as dFNS from 'date-fns'

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
    let { address, latitude, longitude, phoneNumber } = this.context.user
    let state = this.state
    state.address = address
    state.latitude = latitude
    state.longitude = longitude
    state.phone = phoneNumber
    this.setState({ state })
    console.log('CreateJob - setAddressAndPhoneOnMount() - sets address, latitude, longitude, and phone for the form')
  }

  submit = () => {
    console.log('submit')
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
            onChange={(event, date) => this.setState({ endDate: dFNS.format(date, 'yyyy-MM-dd'), showDatePicker: false })}
          />
        )}

      </ScrollView>
    )
  }
}