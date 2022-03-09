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
  jobWindow: {},
  job: {},
  zip: '',
  geo: {},
  results: {},
  pagination: {},
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