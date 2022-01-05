import React from 'react';

export default React.createContext({
  auth: {},
  db: {},
  navigation: {},
  isFocused: {},
  user: {},
  userJobs: [],
  jobSearchResults: [],
  job: {},
  zip: '',
  geo: {},
  updateContext: () => {},
  login: () => {},
  logout: () => {},
  refresh: () => {},
  refreshJob: () => {},
  // storeData: () => {},
  // getData: () => {},
  clearData: () => {},
  test: () => {}
})