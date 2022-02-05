import React, { Component } from 'react'
import Context from '../context/Context.js'
import { Box, Button, Center, Heading, FlatList, Input, Text, Select, Stack, Row, Switch } from 'native-base'
import { ActivityIndicator, ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Constants from 'expo-constants'
import Geocoder from 'react-native-geocoding'
import MapView, { Marker } from 'react-native-maps'
import { getDistance } from 'geolib'
import * as dFNS from 'date-fns'
import { collection, doc, getDoc, getDocs, query, orderBy, where } from 'firebase/firestore'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class SearchJobs2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortBy: 'distance',
      sortDirection: 'desc',
      busy: false,
      error: false,
      inputZip: '',
    }
  }

  static contextType = Context

  search = async () => {
    let { fire, zip } = this.context
    let { sortBy, sortDirection, inputZip } = this.state

    if (zip === '') {
      alert('Please Enter a Zip Code')
    } else {
      this.setState({ busy: true, error: false }, async () => {
        let jobs = []
        let { geo } = this.context
        let lat = []
        let lng = []

        if (inputZip !== '') {
          Geocoder.from(zip)
            .then(x => {
              let lat = x.results[0].geometry.location.lat
              let lng = x.results[0].geometry.location.lng
              this.context.updateContext('geo', { latitude: lat, longitude: lng })
              console.log('GPS coordinates for calculating distances retrieved', x.results[0].geometry.location)
            })
            .catch(e => console.log('error', e))
        }

        if (sortBy === 'distance') {
          const rawJobs = await getDocs(collection(fire, 'jobs'))
          rawJobs.forEach((x) => jobs.push(x.data()))
          let newJobs = jobs.filter(value => Object.keys(value).length !== 0)
          jobs = newJobs
          if (sortDirection === 'desc') {
            jobs.sort((a, b) => (getDistance(geo, { lat: a.latitude, lng: a.longitude }) > getDistance(geo, { lat: b.latitude, lng: b.longitude})) ? -1 : 1)
          } else {
            jobs.sort((a, b) => (getDistance(geo, { lat: a.latitude, lng: a.longitude }) > getDistance(geo, { lat: b.latitude, lng: b.longitude})) ? 1 : -1)
          }
        } else {
          const rawJobs = await getDocs(query(collection(fire, 'jobs'), orderBy(sortBy, sortDirection)))
          rawJobs.forEach((x) => jobs.push(x.data()))
        }

        jobs.map(x => {
          lat.push(x.latitude)
          lng.push(x.longitude)
        })

        this.context.updateContext('jobSearchResults', jobs)
        this.context.updateContext('results', { lat: lat, lng: lng })
        this.setState({ busy: false, error: false })
      })
    }
  }

  switchOrder = () => {
    let { sortDirection } = this.state

    sortDirection === 'desc' ? this.setState({ sortDirection: 'asc' }) :
    sortDirection === 'asc' ? this.setState({ sortDirection: 'desc' }) : null
  }

  calcDistance = () => {
    let { geo, job } = this.context
    let geo1 = { lat: geo.latitude, lng: geo.longitude }
    let geo2 = { lat: job.latitude, lng: job.longitude }
    let meters = getDistance(geo1, geo2)
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

  renderMarkers = () => {
    let { lat, lng } = this.context.results
    let html = []

    if (lat.length !== 0) {
      for (let i = 0; i < lat.length; i++) {
        html.push(
          <Marker
            key={i}
            coordinate={{ latitude: lat[i], longitude: lng[i] }}
            onPress={() => this.context.updateContext('job', this.context.jobSearchResults[i])}
          />
        )
      }
    }

    return html
  }

  resultsView = () => {
    let { jobSearchResults, user, job } = this.context
    let { busy, error } = this.state

    if (busy) {
      return (
        <Center mt={hp(25)}>
          <ActivityIndicator size={wp(20)} color='white' />
        </Center>
      )
    }

    if (error) {
      return (
        <Center mt={hp(25)}>
          <Text color='white'>An error occurred, please try again.</Text>
        </Center>
      )
    }

    if (job.title !== '') {
      return (
        <Stack
          m={wp(5)}
          bg='white'
          borderRadius='40'
          // borderWidth='1'
        >
          <Row
            // justifyContent='space-between'
            alignItems='flex-start'
            p={wp(2)}
            // borderBottomWidth='1'
          >
            {/* <Center
              flex='2'
              py={wp(1)}
              // borderWidth='1'
            >
              <Text fontSize={wp(5)}>#{index+1}</Text>
            </Center> */}
            <Box
              flex='9'
              p={wp(1)}
              // borderWidth='1'
            >
              <Text fontSize={wp(3.5)}>{job.title}</Text>
            </Box>
            <Box
              flex='3'
              p={wp(1)}
            >
              <Text fontSize={wp(4)} textAlign='right'>${job.tip}</Text>
            </Box>
          </Row>

          <Row
            p={wp(2)}
            justifyContent='space-between'
          >
            <Box
              alignItems='flex-start'
            >
              <Text borderBottomWidth='1' pb='2'>Type</Text>
              <Text>{job.type}</Text>
            </Box>
            <Box
              alignItems='flex-end'
            >
              <Text borderBottomWidth='1' pb='2' textAlign='right'>Job Poster</Text>
              <Text>{job.userName}</Text>
            </Box>
          </Row>

          <Row
            justifyContent='space-between'
            px={wp(2)}
            mb={wp(2)}
          >
            <Text>{`${this.calcDistance()}`}</Text>
            <Text textAlign='right' lineHeight={wp(3.2)}>{job.address.replace(/([,][\s])/, `\n`)}</Text>
          </Row>

          <Row
            justifyContent='space-between'
            px={wp(2)}
            // borderWidth='1'
          >
            <Box
              flex='1'
              alignItems='flex-start'
              // borderWidth='1'
            >
              <Text borderBottomWidth='1' pb='2'>Creation Date</Text>
              <Text lineHeight={wp(3.2)}>{job.creationDate.replace(' at', '\nat')}</Text>
            </Box>
            <Box
              flex='1'
              alignItems='flex-end'
              // borderWidth='1'
            >
              <Text borderBottomWidth='1' pb='2'>Deadline</Text>
              <Text textAlign='right' lineHeight={wp(3.2)}>{job.endDate.replace(' at', '\nat')}</Text>
            </Box>
          </Row>

          <Center>
            <Button my={wp(1.5)} onPress={() => this.context.navigation.navigate('Job View')}>VIEW JOB</Button>
          </Center>
        
        </Stack>
      )
    } else {
      return (
        <Center
          flex='1'
          justifyContent='center'
        >
          <Text color='white'>Job View Goes Here</Text>
        </Center>
      )
    }
  }

  renderResultsSidebar = () => {
    let { jobSearchResults, user, job } = this.context
    let { busy, error } = this.state
    let selectedJob = (x) => { return x.title === job.title ? true : false }
    
    if (jobSearchResults.length) {
      // let jobSearchResults2 = []
      // jobSearchResults.map(x => {
      //   let random = String(Math.random())
      //   let key = random.slice(-10)
      //   x.key = key
      //   jobSearchResults2.push(x)
      // })
      return (
        <FlatList
          data={jobSearchResults}
          keyExtractor={item => item.title}
          ref={x => this.sideList = x}
          renderItem={({item, index}) => (
            <Stack>
              <Row
                p={wp(2)}
                borderBottomWidth='1'
                bg={selectedJob(item) ? 'primary.101' : 'white'}
              >
                <Text
                  color={selectedJob(item) ? 'white' : 'black'}
                  onPress={() => this.context.updateContext('job', item)}
                  pr={wp(1)}
                >#{index+1}</Text>
                <Text
                  flex='1'
                  color={selectedJob(item) ? 'white' : 'black'}
                  onPress={() => this.context.updateContext('job', item)}
                >{item.title}</Text>
              </Row>
            </Stack>
          )}
        />
      )
    } else {
      return (
        <Center
          flex='1'
          bg='white'
          justifyContent='center'
        >
          <Text>Job Results Go Here</Text>
        </Center>
      )
    }
  }

  render() {
    
    let { zip, geo, job } = this.context
    let { sortBy, sortDirection, busy, error } = this.state

    return (
      <>
        <Stack
          bg='coolGray.300'
          py={wp(2)}
          space={wp(2)}
          alignItems='center'
        >
          <Row
            justifyContent='space-evenly'
            w='90%'
            alignItems='center'
          >
            <Text>Zip Code:</Text>
            <Input
              placeholder='e.g. 30102'
              w='75%'
              // my={wp(2)}
              bg='white'
              // borderWidth='1'
              onChangeText={(x) => {
                this.setState({ inputZip: x })
                this.context.updateContext('zip', x)
              }}
              value={zip}
            />
          </Row>

          <Row
            justifyContent='space-evenly'
            w='90%'
            // borderWidth='1'
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
              <Box
                w='90%'
                my='auto'
                // borderWidth='1'
              >
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
                  <Select.Item p={wp(3)} label='Distance' value='distance'/>
                  <Select.Item p={wp(3)} label='Tip' value='tip'/>
                  <Select.Item p={wp(3)} label='Created Date' value='creationDate'/>
                  <Select.Item p={wp(3)} label='Ending Date' value='endDate'/>
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
              <Box
                w='90%'
              >
                <Row
                  justifyContent='space-evenly'
                  px={wp(5)}
                  // borderWidth='1'
                >
                  <Text alignSelf='center'>desc</Text>
                  <Switch
                    // size='sm'
                    marginLeft='0'
                    offTrackColor='green.700'
                    offThumbColor='green.300'
                    onChange={() => this.switchOrder()}
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

        <Row
          flex='1'
          borderTopWidth='1'
        >
          <Box
            flex='2'
            // bg='primary.1'
            // pb={wp(37)}
            borderRightWidth='1'
          >
            {this.renderResultsSidebar()}
          </Box>
          <Stack
            flex='5'
            bg='primary.1'
          >
            <Box
              flex='3'
            >
              {this.resultsView()}
            </Box>
            <Box flex='2'>
              <MapView
                style={{ height: '100%', width: '100%' }}
                scrollEnabled
                // loadingEnabled
                region={{
                  latitude: job.latitude === 0 ? geo.latitude : job.latitude,
                  longitude: job.longitude === 0 ? geo.longitude : job.longitude,
                  latitudeDelta: 0.2,
                  longitudeDelta: 0.2,
                }}
              >
                { this.renderMarkers() }
              </MapView>
            </Box>
          </Stack>
        </Row>

        {/* { this.context.jobSearchResults.length >= 3 && <Button
          position='absolute'
          justifyContent='center'
          alignItems='center'
          right={wp(5)}
          bottom={wp(5)}
          boxSize={wp(10)}
          bg='white'
          borderRadius='50'
          borderColor='primary.1'
          borderWidth='1'
          // onPress={() => console.log(this.list.getScrollResponder())}
          onPress={() => this.list.scrollToIndex({ index: 0 })}
        >
          <FontAwesomeIcon icon={faArrowUp} size={wp(4)}/>
        </Button> } */}
      </>
    )
  }
}