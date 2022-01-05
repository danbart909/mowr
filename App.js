import React, { Component } from "react"
// import 'react-native-gesture-handler'
import { LogBox } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer, useNavigation, useIsFocused, useFocusEffect, useScrollToTop } from '@react-navigation/native'
import { NativeBaseProvider, Text } from "native-base"
import firebase from './config/firebase'
import theme from './config/theme'
import * as author from 'firebase/auth'
import * as database from 'firebase/database'
import GlobalState from './context/GlobalState'
import Preface from './preface/Preface'
import Home from './components/Home'
import Settings from './components/Settings'
import SearchJobs from './components/SearchJobs'
import CreateJob from './components/CreateJob'
import JobView from './components/JobView'
import About from './components/About'
import Profile from './user/Profile'
import ManageJobs from './user/ManageJobs'
import UserJobView from './user/UserJobView'
import Location from './user/Location'

import Test1JobView from './test/test1/Test1JobView'
import Test1Profile from './test/test1/Test1Profile'
import Test1SearchJobs from './test/test1/Test1SearchJobs'
import Test1CreateJob from './test/test1/Test1CreateJob'
import Test2JobView from './test/test2/Test2JobView'
import Test2Profile from './test/test2/Test2Profile'
import Test2SearchJobs from './test/test2/Test2SearchJobs'
import Test3JobView from './test/test3/Test3JobView'
import Test3Profile from './test/test3/Test3Profile'
import Test3ManageJobs from './test/test3/Test3ManageJobs'


let Stack = createNativeStackNavigator()
let Drawer = createDrawerNavigator()
let auth = author.getAuth()
let db = database.getDatabase()

LogBox.ignoreLogs([
  'Setting a timer',
  'If you want to use Reanimated',
  'AsyncStorage has been extracted',
  'NativeBase: The contrast ratio of'
])

const BackButton = (props) => {
  let navigation = useNavigation()
  return (
    <Text
      onPress={() => navigation.navigate(props.screen)}
      color='white'
      fontSize='24'
      paddingLeft='20'
    >{`<-`}</Text>
  )
}

const ContextWithHooks = (props) => {
  let navigation = useNavigation()
  let isFocused = useIsFocused()
  return (
    <GlobalState
      {...props}
      auth={auth}
      db={db}
      navigation={navigation}
      isFocused={isFocused}
    />
  )
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  userMenuItems = () => {
    return (
      <>
        <Drawer.Screen
          name='Profile'
          component={Profile}
        />
        <Drawer.Screen
          name='Create Job'
          component={CreateJob}
        />
        <Drawer.Screen
          name='Manage Jobs'
          component={ManageJobs}
        />
        <Drawer.Screen
          name='Settings'
          component={Settings}
        />
        <Drawer.Screen
          name='About'
          component={About}
        />
        <Drawer.Screen
          name='User Job View'
          component={UserJobView}
          options={{
            drawerItemStyle: { height: 0, width: 0 },
            headerLeft: () => <BackButton screen={'Manage Jobs'} />
          }}
        />
        <Drawer.Screen
          name='Location'
          component={Location}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Profile'} />
          }}
        />
      </>
    )
  }
  
  loggedOutMenuItems = () => {
    return (
      <>
        <Drawer.Screen
          name='Settings'
          component={Settings}
        />
        <Drawer.Screen
          name='About'
          component={About}
        />
        <Drawer.Screen
          name='Preface'
          component={Preface}
          options={{
            title: 'Looking To Post a Job?',
            headerTitle: 'Login/Signup',
            // headerShown: false,
            // drawerItemStyle: { height: 0, width: 0 }
          }}
        />
      </>
    )
  }

  testMenuItems = () => {
    return (
      <>
        <Drawer.Screen
          name='Test1JobView'
          component={Test1JobView}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Test1Profile'
          component={Test1Profile}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Test1SearchJobs'
          component={Test1SearchJobs}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Test1CreateJob'
          component={Test1CreateJob}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />

        <Drawer.Screen
          name='Test2JobView'
          component={Test2JobView}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Test2Profile'
          component={Test2Profile}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Test2SearchJobs'
          component={Test2SearchJobs}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />

        <Drawer.Screen
          name='Test3JobView'
          component={Test3JobView}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Tes3tProfile'
          component={Test3Profile}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
        <Drawer.Screen
          name='Test3ManageJobs'
          component={Test3ManageJobs}
          options={{
            drawerItemStyle: { height: 0 },
            headerLeft: () => <BackButton screen={'Home'} />
          }}
        />
      </>
    )
  }

  render() {
    return (
      <NavigationContainer>
        <ContextWithHooks
          setLoggedInStatus={x => this.setState({ loggedIn: x })}
        >
          <NativeBaseProvider theme={theme}>
            <Drawer.Navigator
              initialRouteName='Home'
              screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#16a800',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                swipeEnabled: false,
                // unmountOnBlur: true
                // drawerPosition: 'right'
              }
            }>
              <Drawer.Screen
                name='Home'
                component={Home}
              />
              {this.state.loggedIn ? this.userMenuItems() : this.loggedOutMenuItems()}
              <Drawer.Screen
                name='Search Jobs'
                component={SearchJobs}
                options={{
                  drawerItemStyle: { height: 0, width: 0 },
                  // headerLeft: () => <BackButton screen={'SearchJobs'} />
                }}
              />
              <Drawer.Screen
                name='Job View'
                component={JobView}
                options={{
                  drawerItemStyle: { height: 0, width: 0 },
                  headerLeft: () => <BackButton screen={'Search Jobs'} />
                }}
              />
              {this.testMenuItems()}
            </Drawer.Navigator>
          </NativeBaseProvider>
        </ContextWithHooks>
      </NavigationContainer>
    )
  }
}