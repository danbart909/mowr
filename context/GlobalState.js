import React, { Component } from 'react'
// import { Alert, Animated, LayoutAnimation } from 'react-native';
import Context from './Context.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, setDoc, addDoc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { format, parseISO, parse, lightFormat, formatISO, addHours, isPast, addSeconds, addMinutes, compareAsc, toDate } from "date-fns";
import Geocoder from 'react-native-geocoding'
// import { getDistance } from 'geolib';
// import axios from 'react-native-axios'

const { civicAPIKey } = Constants.manifest.extra
Geocoder.init(civicAPIKey)

export default class GlobalState extends Component {
  constructor(props) {
    super(props)
    this.state = {
      introCheck: false,
      user: {},
      userJobs: [],
      jobSearchResults: [],
      jobWindow: {
        id: '',
        userId: '',
        userName: '',
        title: '',
        type: '',
        description: '',
        address: '',
        creationDate: new Date(),
        endDate: new Date(),
        email: '',
        latitude: 0,
        longitude: 0,
        tip: 0,
        phone: ''
      },
      job: {
        id: '',
        userId: '',
        userName: '',
        title: '',
        type: '',
        description: '',
        address: '',
        creationDate: new Date(),
        endDate: new Date(),
        email: '',
        latitude: 0,
        longitude: 0,
        tip: 0,
        phone: ''
      },
      zip: '',
      geo: {
        latitude: 0,
        longitude: 0
      },
      results: {
        lat: [],
        lng: []
      },
      pagination: {
        current: 0,
        visibleJobs: [],
        pages: []
      }
    }
  }

  componentDidMount() {
    SplashScreen.preventAutoHideAsync()

    let { auth } = this.props

    onAuthStateChanged(auth, (user) => {
      if (user && !this.state.introCheck) {
        this.refresh()
        this.props.setLoggedInStatus(true)
        SplashScreen.hideAsync()
        // this.props.navigation.navigate('Home')
      }
      else {
        console.log('onAuthStateChanged - user has signed out/user already set')
        SplashScreen.hideAsync()
        this.props.setLoggedInStatus(false)
        this.setState({ user: {}, userJobs: [] })
      }
    })
  }

  updateContext = (prop, val) => {
    let state = this.state
    state[prop] = val
    this.setState(state)
  }
  
  login = async (email, password) => {
    signInWithEmailAndPassword(this.props.auth, email, password)
      .then(x => this.refresh())
      .catch(e => console.log('logging in error', e))
  }

  logout = () => {
    signOut(this.props.auth)
      .then(() => {
        this.clearData()
        console.log('user signed out')
      })
      .catch(e => console.log('error signing out', e))
  }

  refresh = async () => {
    let { auth, fire } = this.props
    let { displayName, email, uid } = auth.currentUser
    let state = this.state

    let user = await getDoc(doc(fire, 'users', uid))

    let customUserObject = {
      name: displayName,
      email: email,
      address: user.data().address,
      latitude: user.data().latitude,
      longitude: user.data().longitude,
      phone: user.data().phone,
      uid: uid,
    }
    state.user = customUserObject
    this.setState(state)

    console.log('user refreshed', auth.currentUser, customUserObject)
  }

  refreshUserJobs = async () => {
    let { auth, fire } = this.props
    let user = auth.currentUser
    let { uid } = user
    let state = this.state
    let refreshedJob = {}
    let jobID = state.job.id

    console.log('refreshUserJobs')

    if (state.job.id !== '') {
      refreshedJob = await getDoc(doc(fire, 'jobs', state.job.id))
      state.job = refreshedJob.data()
      state.job.id = jobID
    }

    const rawUserJobs = await getDocs(query(collection(fire, 'jobs'), where('userId', '==', uid)))
    let userJobs = []

    rawUserJobs.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      userJobs.push(data)
    })

    userJobs.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1)
    state.userJobs = userJobs
    this.setState(state)
    console.log('userJobs refreshed', userJobs)
  }

  refreshJob = () => {
    console.log('refresh job')
  }

  clearData = async () => {
    try {
      // await AsyncStorage.removeItem('@state_Key')
      // await AsyncStorage.clear()
      this.setState({
        introCheck: false,
        user: {},
        userJobs: [],
        jobSearchResults: {},
        jobWindow: {
          id: '',
          userId: '',
          userName: '',
          title: '',
          type: '',
          description: '',
          address: '',
          creationDate: new Date(),
          endDate: new Date(),
          email: '',
          latitude: 0,
          longitude: 0,
          tip: 0,
          phone: ''
        },
        job: {
          id: '',
          userId: '',
          userName: '',
          title: '',
          type: '',
          description: '',
          address: '',
          creationDate: new Date(),
          endDate: new Date(),
          email: '',
          latitude: 0,
          longitude: 0,
          tip: 0,
          phone: ''
        },
        zip: '',
        geo: {
          latitude: 0,
          longitude: 0
        },
        results: {
          lat: [],
          lng: []
        },
        pagination: {
          current: 0,
          visibleJobs: [],
          pages: []
        }
      })
      console.log('memory cleared')
    } catch(e) { console.log('error clearing data', e) }
    // finally { this.storeData() }
  }

  test = async () => {
    let { app, auth, fire } = this.props
    let { user, jobSearchResults, geo, job } = this.state

    console.log(wp(3))
    this.props.navigation.navigate('Preface')
  }
  
  render() {
    return (
      <Context.Provider
        value={{
          app: this.props.app,
          auth: this.props.auth,
          db: this.props.db,
          fire: this.props.fire,
          navigation: this.props.navigation,
          isFocused: this.props.isFocused,
          user: this.state.user,
          userJobs: this.state.userJobs,
          jobSearchResults: this.state.jobSearchResults,
          jobWindow: this.state.jobWindow,
          job: this.state.job,
          zip: this.state.zip,
          geo: this.state.geo,
          results: this.state.results,
          pagination: this.state.pagination,
          updateContext: this.updateContext,
          login: this.login,
          logout: this.logout,
          refresh: this.refresh,
          refreshUserJobs: this.refreshUserJobs,
          refreshJob: this.refreshJob,
          clearData: this.clearData,
          test: this.test
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

    // if (user.email) { arr = Object.keys(this.state.user) }
    // if (arr.length) {
    //   if (user.email)
    //   this.navigate('Home')
    // }

      // storeData = async () => {
  //   try {
  //     let jsonState = JSON.stringify(this.state)
  //     await AsyncStorage.setItem('@state_Key', jsonState)
  //     console.log('data saved')
  //   } catch(e) { console.log('error storing data', e) }
  // }

  // getData = async () => {
  //   try {
  //     let jsonValue = await AsyncStorage.getItem('@state_Key')
  //     let value = JSON.parse(jsonValue)
  //     console.log({asyncStorage: value})
  //     if (value.user !== null) {
  //       this.setState({
  //         // stateProperty: value.stateProperty
  //       })
  //     }
  //   } catch(e) { console.log('getData error', e) }
  // }