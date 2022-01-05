import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, FlatList, Input, Text, Select, Stack, Row, Switch } from 'native-base'
import { ActivityIndicator, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import Geocoder from 'react-native-geocoding'
import { getDistance } from 'geolib'
import * as dFNS from 'date-fns'
import * as database from 'firebase/database'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class SearchJobs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortBy: 'Distance',
      sortDirection: 'desc',
      busy: false,
      error: false
    }
  }

  static contextType = Context

  search = async () => {
    let { db, user, zip } = this.context
    let { sortBy, sortDirection } = this.state
    let { ref, get } = database
    // child, update, push, query, limitToLast, equalTo, orderByKey, orderByChild, orderByValue = database

    if (sortBy === 'Distance' && !zip) {
      alert('Please Enter a Zip Code')
    } else {
      this.setState({ busy: true, error: false }, () => {
        get(ref(db, 'jobs/'))
        .then(x => {
          let data1 = Object.values(x.val())
          let data2 = data1.filter(x => x.completed === false)
          let data3 = []
          let geo = {}

          if (sortBy === 'Distance') {
            Geocoder.from(zip)
              .then(x => {
                // console.log('geoZip', x.results[0].geometry.location)
                geo = x.results[0].geometry.location
                sortDirection === 0 ?
                data3 = data2.sort((a, b) => (getDistance(geo, a.geo) > getDistance(geo, b.geo)) ? 1 : -1) :
                data3 = data2.sort((a, b) => (getDistance(geo, a.geo) > getDistance(geo, b.geo)) ? -1 : 1)
                // console.log('Distance', 'data3', data3)
                this.context.updateContext('jobSearchResults', data3)
                this.context.updateContext('geo', geo)
                this.setState({ busy: false, error: false })
              })
              .catch(e => console.log('Geocoder error', e))
          } else if (sortBy === 'Tip') {
            sortDirection === 0 ?
            data3 = data2.sort((a, b) => (a.tip > b.tip) ? 1 : -1) :
            data3 = data2.sort((a, b) => (a.tip > b.tip) ? -1 : 1)
            // console.log('Tip', 'data3', data3)
            this.context.updateContext('jobSearchResults', data3)
            this.setState({ busy: false, error: false })
          } else if (sortBy === 'Creation Date') {
            sortDirection === 0 ?
            data3 = data2.sort((a, b) => (new Date(a.creationDate) > new Date(b.creationDate)) ? 1 : -1) :
            data3 = data2.sort((a, b) => (new Date(a.creationDate) > new Date(b.creationDate)) ? -1 : 1)
            // console.log('Creation Date', 'data3', data3)
            this.context.updateContext('jobSearchResults', data3)
            this.setState({ busy: false, error: false })
          } else {
            sortDirection === 0 ?
            data3 = data2.sort((a, b) => (new Date(a.endDate) > new Date(b.endDate)) ? 1 : -1) :
            data3 = data2.sort((a, b) => (new Date(a.endDate) > new Date(b.endDate)) ? -1 : 1)
            // console.log('End Date', 'data3', data3)
            this.context.updateContext('jobSearchResults', data3)
            this.setState({ busy: false, error: false })
          }

          // console.log('data3', data3)
          // this.context.updateContext('jobSearchResults', data3)
        })
        .catch(e => this.setState({ busy: false, error: true }, () => console.log('job search error', e)))
      })
    }
  }

  viewJob = async (x) => {
    await this.context.updateContext('job', x)
    this.context.navigation.navigate('Job View')
  }

  calcDistance = (x, y) => {
    let meters = getDistance(x, y)
    let feetBig = meters*3.2808
    let feetRounded = Math.round(feetBig*100)/100
    let milesBig = feetBig/5280
    let milesRounded = Math.round(milesBig*100)/100
    let str = ``

    feetRounded < 2000 ?
    str = `${feetRounded} feet away` :
    str = `${milesRounded} miles away`

    return str
  }

  resultsView = () => {
    let { jobSearchResults, geo } = this.context
    let { busy, error } = this.state

    if (busy) {
      return (
        <Center mt='4'>
          <ActivityIndicator color='black' />
        </Center>
      )
    }

    if (error) {
      return (
        <Center mt='4'>
          <Text>An error occurred, please try again.</Text>
        </Center>
      )
    }
    
    if (jobSearchResults.length) {
      return (
        <FlatList
          data={jobSearchResults}
          keyExtractor={item => item.ID}
          renderItem={({item}) => (
            <Box
              mb={wp(10)}
              bg='white'
              borderWidth='1'
            >
              <Row
                justifyContent='space-between'
                alignItems='center'
                p={wp(2)}
                borderBottomWidth='1'
              >
                <Text fontSize='2xl'>{item.title}</Text>
                <Text fontSize='lg'>$ {item.tip}</Text>
              </Row>
              <Row
                justifyContent='space-between'
                alignItems='center'
                p={wp(2)}
                borderBottomWidth='1'
              >
                <Text fontSize='xs'>Type: {item.type}</Text>
                <Text>{item.name}</Text>
              </Row>
              <Box
                minH='2xs'
                maxH='xs'
                p={wp(2)}
                borderBottomWidth='1'
              >
                <Text fontSize='xs'>{item.description}</Text>
              </Box>
              <Row
                justifyContent='space-between'
                alignItems='center'
                p={wp(2)}
                borderBottomWidth='1'
              >
                <Text>{item.address.replace(/([,][\s])/, `\n`)}</Text>
                <Text>{`${this.calcDistance(item.geo, geo)}`}</Text>
              </Row>
              <Row
                justifyContent='space-between'
                alignItems='center'
                p={wp(2)}
                borderBottomWidth='1'
              >
                <Stack alignItems='flex-start'>
                  <Text fontSize='xs'>Created {dFNS.formatDistance(new Date(item.creationDate), new Date(), { addSuffix: true })}</Text>
                  <Text>{dFNS.format(new Date(item.creationDate), 'EEEE, PPP')}</Text>
                </Stack>
                <Stack alignItems='flex-end'>
                  <Text fontSize='xs'>Ending {dFNS.formatDistance(new Date(item.endDate), new Date(), { addSuffix: true })}</Text>
                  <Text>{dFNS.format(new Date(item.endDate), 'EEEE, PPP')}</Text>
                </Stack>
              </Row>
              <Center>
                <Button
                  my={wp(4)}
                  onPress={() => this.viewJob(item)}
                >
                  VIEW JOB
                </Button>
              </Center>
            </Box>
          )}
        />
      )
    }
  }

  render() {
    
    let { zip } = this.context
    let { sortBy, sortDirection, busy, error } = this.state

    return (
      <>
        <Stack
          bg='coolGray.300'
          py={wp(2.1)}
          space={wp(2.1)}
          alignItems='center'
        >
  
          <Input
            placeholder='Zip Code'
            w='75%'
            // my={wp(2)}
            bg='white'
            // borderWidth='1'
            onChangeText={(x) => this.context.updateContext('zip', x)}
            value={zip}
          />
  
          <Row
            justifyContent='space-evenly'
            w='90%'
            borderWidth='1'
          >
            <Stack
              alignItems='center'
              // justifyContent='space-between'
              w='50%'
              // borderWidth='1'
            >
              <Box>
                <Text>Sort By:</Text>
              </Box>
              <Box w='90%' my='auto' borderWidth='1'>
                <Select
                  selectedValue={sortBy}
                  accessibilityLabel='Sort By'
                  onValueChange={x => this.setState({ sortBy: x })}
                  w='100%'
                  // variant='underlined'
                  // borderColor='black'
                  bg='coolGray.100'
                  // borderWidth='1'
                >
                  <Select.Item p={wp(3)} label='Distance' value='Distance'/>
                  <Select.Item p={wp(3)} label='Tip' value='Tip'/>
                  <Select.Item p={wp(3)} label='Created Date' value='Created Date'/>
                  <Select.Item p={wp(3)} label='Ending Date' value='Ending Date'/>
                </Select>
              </Box>
            </Stack>
  
            <Stack
              alignItems='center'
              justifyContent='space-between'
              w='50%'
              // borderWidth='1'
            >
              <Box>
                <Text>Order By:</Text>
              </Box>
              <Box w='90%'>
                <Row justifyContent='space-evenly' borderWidth='1'>
                  <Text alignSelf='center'>desc</Text>
                  <Switch
                    // size='sm'
                    marginLeft='0'
                    offTrackColor='green.700'
                    offThumbColor='green.300'
                  />
                  <Text alignSelf='center'>asc</Text>
                </Row>
              </Box>
            </Stack>
  
          </Row>
  
          <Button
            onPress={() => this.search()}
            // my={wp(2)}
          >SEARCH</Button>
  
        </Stack>

        <Box bg='green.600'>
          {this.resultsView()}
        </Box>
      </>
    )
  }
}

{/* <Box
  bg='primary.500'
  p={wp(5)}
  boxSize='200'
></Box> */}