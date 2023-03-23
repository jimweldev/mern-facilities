import React, { useEffect, useState } from 'react'

// libraries
import axios from 'axios'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'

// redux
import { LOGIN } from '../../features/authUserSlice'

const Login = () => {
  // redux
  const dispatch = useDispatch()

  // login states
  const [loginError, setLoginError] = useState(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // login function
  const handleLogin = async (values) => {
    setLoginError(null)
    setIsLoginLoading(true)

    axios
      .post('/api/auth/login', values)
      .then((response) => {
        dispatch(LOGIN(response.data))
      })
      .catch((error) => {
        setLoginError(error.response.data.error)
      })
      .finally(() => {
        setIsLoginLoading(false)
      })
  }

  // login form
  const formik = useFormik({
    initialValues: {
      emailAddress: '',
      password: '',
    },
    validate: loginValidate,
    onSubmit: handleLogin,
  })

  return (
    <form
      className="card mx-auto"
      onSubmit={formik.handleSubmit}
      style={{ maxWidth: '420px' }}
    >
      <div className="card-body">
        <h3>Login</h3>

        <div className={`alert alert-danger ${!loginError && 'd-none'}`}>
          {loginError}
        </div>

        <div className="mb-3">
          <label htmlFor="emailAddress">Email Address</label>
          <input
            className={`form-control form-control-lg ${
              formik.errors.emailAddress &&
              formik.touched.emailAddress &&
              'invalid'
            }`}
            id="emailAddress"
            type="text"
            {...formik.getFieldProps('emailAddress')}
          />
          {formik.errors.emailAddress && formik.touched.emailAddress && (
            <div className="form-text text-danger">
              {formik.errors.emailAddress}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            className={`form-control form-control-lg ${
              formik.errors.password && formik.touched.password && 'invalid'
            }`}
            id="password"
            type="password"
            {...formik.getFieldProps('password')}
          />
          {formik.errors.password && formik.touched.password && (
            <div className="form-text text-danger">
              {formik.errors.password}
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            className="btn btn-lg btn-dark"
            type="submit"
            disabled={isLoginLoading}
          >
            {isLoginLoading ? (
              <>
                <span className="spinner-grow spinner-grow-sm me-2"></span>
                Loading...
              </>
            ) : (
              <>Submit</>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Login

// login validation
const loginValidate = (values) => {
  const errors = {}

  // check if username is not empty
  if (!values.emailAddress) {
    errors.emailAddress = 'Required'
  }

  // check if password is not empty
  if (!values.password) {
    errors.password = 'Required'
  }

  return errors
}
