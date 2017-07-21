
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
import { reset } from 'redux-form';

import api from 'utils/api';
import { types as sessionTypes } from 'actions/session';

function setCurrentUser(response) {
  localStorage.setItem('token', JSON.stringify(response.meta.token));
}


// Login

function login(data) {
  return api.post('/sessions', data);
}

function* callLogin({ data }) {
  const result = yield call(login, data);

  if (result.data.data) {
    yield put({ type: sessionTypes.AUTHENTICATION_SUCCESS, response: result.data });
    setCurrentUser(result.data);
    yield put(reset('signup'));
  } else {
    localStorage.removeItem('token');
  }
}

function* loginSaga() {
  yield* takeEvery(sessionTypes.LOGIN_REQUEST, callLogin);
}

// Signup

function signup(data) {
  return api.post('/users', data);
}

function* callSignup({ data }) {
  const result = yield call(signup, data);
  if (result.data) {
    yield put({ type: sessionTypes.AUTHENTICATION_SUCCESS, response: result.data });
    setCurrentUser(result.data);
    yield put(reset('signup'));
    // yield put(push('/'));
  } else {
    localStorage.removeItem('token');
    // yield put(push('/login'));
  }
}


function* signupSaga() {
  yield* takeEvery(sessionTypes.SIGNUP_REQUEST, callSignup);
}

// Logout

function logout() {
  return api.delete('/sessions');
}

function* callLogout() {
  yield call(logout);
  yield call(localStorage.removeItem('token'));
}

function* logoutSaga() {
  yield* takeEvery(sessionTypes.LOGOUT, callLogout);
}

// Authenticate

function authenticate() {
  return api.post('/sessions/refresh');
}

function* callAuthenticate() {
  const result = yield call(authenticate);
  if (result.data.data) {
    yield put({ type: sessionTypes.AUTHENTICATION_SUCCESS, response: result.data });
    setCurrentUser(result.data);
  } else {
    localStorage.removeItem('token');
    window.location = '/login';
  }
}

function* authenticateSaga() {
  yield* takeEvery(sessionTypes.AUTHENTICATION_REQUEST, callAuthenticate);
}

export default [loginSaga, signupSaga, logoutSaga, authenticateSaga];