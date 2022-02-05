import React from 'react';

export default React.createContext({
  app: {},
  auth: {},
  db: {},
  fire: {},
  navigation: {},
  isFocused: {},
  user: {},
  userJobs: [],
  jobSearchResults: [],
  job: {},
  zip: '',
  geo: {},
  results: {},
  updateContext: () => {},
  login: () => {},
  logout: () => {},
  refresh: () => {},
  refreshUserJobs: () => {},
  refreshJob: () => {},
  // storeData: () => {},
  // getData: () => {},
  clearData: () => {},
  test: () => {}
})