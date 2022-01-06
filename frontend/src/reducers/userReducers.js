import {
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  LIST_USERS_FAIL,
  LIST_USERS_REQUEST,
  LIST_USERS_RESET,
  LIST_USERS_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_RESET,
  UPDATE_USER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
} from '../constants/userConstants'

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { loading: true }
    case LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case LOGIN_FAIL:
      return { loading: false, error: action.payload }
    case LOGOUT:
        return {}
    default:
      return state
  }
}

export const registerReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
      return { loading: true}
    case REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case REGISTER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload }
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER_DETAILS_RESET:
        return { user: {} }
    default:
      return state
  }
}

export const userUpdateProfileReducer = (state = { }, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, user: action.payload }
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const listUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case LIST_USERS_REQUEST:
      return { loading: true }
    case LIST_USERS_SUCCESS:
      return { loading: false, users: action.payload }
    case LIST_USERS_FAIL:
      return { loading: false, error: action.payload }
    case LIST_USERS_RESET:
      return { users: [] }
    default:
      return state
  }
}

export const deleteUserReducer = (state = { }, action) => {
  switch (action.type) {
    case DELETE_USER_REQUEST:
      return { loading: true }
    case DELETE_USER_SUCCESS:
      return { loading: false, success: true }
    case DELETE_USER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const updateUserReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case UPDATE_USER_REQUEST:
      return { loading: true }
    case UPDATE_USER_SUCCESS:
      return { loading: false, success: true }
    case UPDATE_USER_FAIL:
      return { loading: false, error: action.payload }
    case UPDATE_USER_RESET:
      return { user: {} }
    default:
      return state
  }
}