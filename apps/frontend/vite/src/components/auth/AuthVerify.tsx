import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, } from '@mui/material';

// third party
import * as Yup from 'yup';
import { ErrorMessage, Formik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';

import { useAuth } from "contexts/authContext"

const AuthVerify = () => {
  const navigate = useNavigate()
  const { verifyCode } = useAuth()

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          code: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          code: Yup.string().required('Verification code required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setSubmitting(true);
            await verifyCode(values.email, values.code);
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/login')
          }
          catch (err: any) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, status }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    <ErrorMessage name={'email'} />
                  </FormHelperText>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="verify-code">Verify Code</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.code && errors.code)}
                    id="-verify-code"
                    type={'text'}
                    value={values.code}
                    name="code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter verification code"
                  />
                  <FormHelperText error id="standard-weight-helper-text-verify-password">
                    <ErrorMessage name={'code'} />
                  </FormHelperText>
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>
                    <ErrorMessage name={'submit'} />
                  </FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Verify
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthVerify;