import React, { Component } from 'react'
import { Alert, Animated, LayoutAnimation } from 'react-native';
import Context from './Context.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import * as author from 'firebase/auth'
import * as database from 'firebase/database'
import * as dFNS from "date-fns";
import Geocoder from 'react-native-geocoding'
import { getDistance } from 'geolib';
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
      job: {
        ID: '',
        address: '',
        completed: false,
        creationDate: new Date(),
        description: '',
        email: '',
        endDate: new Date(),
        geo: {},
        key: '',
        name: '',
        phone: '',
        provider: '',
        tip: [],
        title: [],
        type: ''
      },
      zip: '30062',
      geo: {}
    }
  }

  componentDidMount() {
    SplashScreen.preventAutoHideAsync()

    let { auth, db } = this.props

    author.onAuthStateChanged(auth, (user) => {
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
    author.signInWithEmailAndPassword(this.props.auth, email, password)
      .then(x => this.refresh())
      .catch(e => console.log('logging in error', e))
  }

  logout = () => {
    author.signOut(this.props.auth)
      .then(() => {
        this.clearData()
        console.log('user signed out')
      })
      .catch(e => console.log('error signing out', e))
  }

  refresh = async () => {
    let user = this.props.auth.currentUser
    console.log('user signed in', user)
    let { job, introCheck } = this.state
    let { db } = this.props
    let { ref, get, child } = database
    
    get(child(ref(db), `users/${user.uid}`))
      .then(x => {
        let newState = this.state
        newState = {
          ...this.state,
          introCheck: true,
          user: { ...user, ...x.val() }
        }
        this.setState(newState)
        console.log('user loaded')
      })
      .catch(e => {
        console.log(e)
        SplashScreen.hideAsync()
      })

    user.email &&
    get(ref(db, 'jobs/'))
      .then(x => {
        let keys = Object.keys(x.val())
        let data = Object.values(x.val())
        for (let i = 0; i < data.length; i++) { data[i].key = keys[i] }
        let userJobs = data.filter(y => y.provider === user.uid)
        // let newjob = userJobs.filter(y => y.key === job.key)
        // console.log('x', x.val())
        console.log('userJobs', userJobs)
        // this.setState({ userJobs: userJobs, job: newjob, busy: false, error: false })
        if (job.ID) {
          if (job.ID !== '') {
            let newjob = userJobs.filter(y => y.key === job.key)
            console.log('job.ID !== ""', newjob)
            this.setState({ userJobs: userJobs, job: newjob[0], busy: false, error: false })
          } else {
            console.log('job.ID === ""')
            this.setState({ userJobs: userJobs, busy: false, error: false })
          }
        } else {
          console.log('no job.ID')
          this.setState({ userJobs: userJobs, busy: false, error: false })
        }
      })
      .catch(e => this.setState({ busy: false, error: true }, () => console.log(e)))
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
        job: {},
        zip: '',
        geo: {}
      })
      console.log('memory cleared')
    } catch(e) { console.log('error clearing data', e) }
    // finally { this.storeData() }
  }

  test = async () => {
    let { db, auth } = this.props
    let { user, jobSearchResults, geo, job } = this.state
    let { ref, get, child, update, push, query, limitToLast, equalTo, orderByKey, orderByChild, orderByValue } = database
    let { parseISO, formatISO, addHours, isPast, addSeconds, addMinutes, compareAsc } = dFNS
    let lat = ''
    let lng = ''
    let arr = []
    let geo1 = { lat: 33.9957883, lng: -84.46976629999999 }
    let geo2 = { lat: 34.9957883, lng: -85.46976629999999 }

    console.log('test')
    console.log(auth)
    console.log(author)
    console.log(author.AuthCredential)

    let providerID = 'google.com'
    let thisEmail = 'p@gmail.com'
    let method = 'password'
    let thisPassword = 'pppppppp'
    
    let credential = author.EmailAuthProvider.credential(user.email, thisPassword)

    author.reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => console.log('reauth success'))
      .catch(e => console.log('reauth failed', e))
  }
  
  render() {
    return (
      <Context.Provider
        value={{
          auth: this.props.auth,
          db: this.props.db,
          navigation: this.props.navigation,
          isFocused: this.props.isFocused,
          user: this.state.user,
          userJobs: this.state.userJobs,
          jobSearchResults: this.state.jobSearchResults,
          job: this.state.job,
          zip: this.state.zip,
          geo: this.state.geo,
          updateContext: this.updateContext,
          login: this.login,
          logout: this.logout,
          refresh: this.refresh,
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