import React, { Component } from 'react'
import { Alert, Animated, LayoutAnimation } from 'react-native';
import Context from './Context.js'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { signOut, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { collection, doc, setDoc, addDoc, getDoc, getDocs, Timestamp, query, where } from 'firebase/firestore'
import { parseISO, formatISO, addHours, isPast, addSeconds, addMinutes, compareAsc } from "date-fns";
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
    let user = auth.currentUser
    console.log('user signed in', user)
    let state = this.state
    let { job, introCheck } = this.state
    let { displayName, email, phoneNumber, photoURL, uid } = user
    let addressArray = photoURL.split('|')
    let geo = { latitude: addressArray[1], longitude: addressArray[2] }
    let customUserObject = {
      displayName: displayName,
      email: email,
      address: addressArray[0],
      geo: geo,
      phoneNumber: phoneNumber,
      uid: uid,
    }
    state.user = customUserObject

    // const jobsRef = collection(fire, 'jobs')
    // const userJobsQuery = query(jobsRef, where('userId', '==', uid))
    // const userJobs = await getDocs(userJobsQuery)
    // let userJobs2 = []

    // userJobs.forEach((doc) => {
    //   let data = doc.data()
    //   data.uid = doc.id
    //   userJobs2.push(data)
    // })
    // state.userJobs = userJobs2

    // const docRef = doc(db, "jobs", "SF");
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }

    // save userJobs to userJobs

    // user.email &&
    // get(ref(db, 'jobs/'))
    //   .then(x => {
    //     let keys = Object.keys(x.val())
    //     let data = Object.values(x.val())
    //     for (let i = 0; i < data.length; i++) { data[i].key = keys[i] }
    //     let userJobs = data.filter(y => y.provider === user.uid)
    //     // let newjob = userJobs.filter(y => y.key === job.key)
    //     // console.log('x', x.val())
    //     console.log('userJobs', userJobs)
    //     // this.setState({ userJobs: userJobs, job: newjob, busy: false, error: false })
    //     if (job.title) {
    //       if (job.title !== '') {
    //         let newjob = userJobs.filter(y => y.key === job.key)
    //         console.log('job.title !== ""', newjob)
    //         this.setState({ userJobs: userJobs, job: newjob[0], busy: false, error: false })
    //       } else {
    //         console.log('job.title === ""')
    //         this.setState({ userJobs: userJobs, busy: false, error: false })
    //       }
    //     } else {
    //       console.log('no job.title')
    //       this.setState({ userJobs: userJobs, busy: false, error: false })
    //     }
    //   })
    //   .catch(e => this.setState({ busy: false, error: true }, () => console.log(e)))

    this.setState(state)

    console.log('state', state)
  }

  refreshUserJobs = async () => {
    let { auth, fire } = this.props
    let user = auth.currentUser
    let { uid } = user
    let state = this.state
    
    console.log('refreshing userJobs')

    const jobsRef = collection(fire, 'jobs')
    const userJobsQuery = query(jobsRef, where('userId', '==', uid))
    const userJobs = await getDocs(userJobsQuery)
    let userJobs2 = []

    userJobs.forEach((doc) => {
      let data = doc.data()
      data.uid = doc.id
      userJobs2.push(data)
    })
    state.userJobs = userJobs2

    this.setState(state)
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
    let { auth, fire } = this.props
    let { user, jobSearchResults, geo, job } = this.state
    let arr = []
    let geo1 = { lat: 33.9957883, lng: -84.46976629999999 }
    let geo2 = { lat: 34.9957883, lng: -85.46976629999999 }
    let uid = auth.currentUser.uid
    // let address = auth.currentUser.photoURL

    // let newAddress = address.split('|')
    // let justAddress = newAddress[0]
    // let justLat = newAddress[1]
    // let justLng = newAddress[2]
    // console.log(newAddress)
    // console.log(justAddress)
    // console.log(justLat)
    // console.log(justLng)

    // console.log(uid)

    // const docRef = doc(fire, 'jobs')
    // const docSnap = await getDoc(docRef)

    // console.log(docRef)

    // if (docSnap.exists()) {
    //   console.log('user data:', docSnap.data())
    // } else {
    //   console.log('Document does not exist!')
    // }

    const jobsRef = collection(fire, 'jobs')
    const userJobsQuery = query(jobsRef, where('userId', '==', uid))
    const userJobs = await getDocs(userJobsQuery)
    let userJobs2 = []

    userJobs.forEach((doc) => {
      let data = doc.data()
      data.uid = doc.id
      userJobs2.push(data)
    })

    console.log(userJobs2)

    // await addDoc(collection(fire, 'users'), {
    //   joinDate: Timestamp.fromDate(new Date()),
    //   email: 'b@gmail.com',
    //   name: 'batman',
    //   address: '',
    //   phone: '',
    // })
    //   .then(x => console.log('success', x))
    //   .catch(e => console.log('error', e))

    // await setDoc(doc(fire, 'users', 'XQb2ICAUlPNtAhw8jwv6'), {
    //   address: 'some address'
    // }, { merge: true })
    //   .then(x => console.log('success', x))
    //   .catch(e => console.log('error', e))

    // await setDoc(doc(fire, 'users', 'XQb2ICAUlPNtAhw8jwv6'), {
    //   phone: 'some number'
    // }, { merge: true })
    //   .then(x => console.log('success', x))
    //   .catch(e => console.log('error', e))
    
    // console.log('1', auth.currentUser)

    // updateProfile(auth.currentUser, { photoURL: 'this is an address 35345' })
    //   .then(x => console.log('success', x))
    //   .catch(e => console.log('fail', e))

    // updateProfile(auth.currentUser, { tenantId: 'geo object' })
    //   .then(x => console.log('success', x))
    //   .catch(e => console.log('fail', e))

    // console.log('2', auth.currentUser)
  }
  
  render() {
    return (
      <Context.Provider
        value={{
          auth: this.props.auth,
          db: this.props.db,
          fire: this.props.fire,
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