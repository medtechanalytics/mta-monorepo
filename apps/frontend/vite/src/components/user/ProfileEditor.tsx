import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Autocomplete, Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from "../MainCard"
import { useAuth } from "contexts/authContext"
import timezones from 'timezones-list'
import { DEFAULT_TIMEZONE } from "config"
import _ from "lodash"

const ProfileEditor = () => {
    const { user, setAttribute } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const timezoneLabels = useMemo( () => {
      return timezones.map(x => x.label)
    }, [])

    return (
      <>
        <MainCard title="User Profile">
          <Formik
            initialValues={{
              givenName: user?.given_name,
              familyName: user?.family_name,
              email: user?.email,
              zoneInfo: user?.zoneinfo || DEFAULT_TIMEZONE,
              submit: null
            }}
            validationSchema={Yup.object().shape({
              firstName: Yup.string().max(30, 'First name must be less than 30 characters.'),
              lastName: Yup.string().max(30, 'Last name must be less than 30 characters.'),
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              zoneInfo: Yup.string().oneOf(timezoneLabels).required("Time zone is a required field")
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                setSubmitting(true);
                await setAttribute([
                  {
                    Name: 'given_name',
                    Value: values.givenName
                  },
                  {
                    Name: 'family_name',
                    Value: values.familyName
                  },
                  {
                    Name: 'name',
                    Value: `${values.givenName} ${values.familyName}`
                  },
                  {
                    Name: 'zoneinfo',
                    Value: `${values.zoneInfo}` || DEFAULT_TIMEZONE
                  }
                ])
                setEditMode(false)
                setStatus({ success: false });
                setSubmitting(false);
              }
              catch (err: any) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2} justifyContent="flex-end">
                  {
                    editMode ?
                      <>
                        <Grid item xs={3}>
                          <AnimateButton>
                            <Button
                              disableElevation
                              disabled={isSubmitting}
                              fullWidth
                              size="small"
                              type="button"
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                resetForm();
                                setEditMode(false)
                              }}
                            >
                              Cancel
                            </Button>
                          </AnimateButton>
                        </Grid>
                        <Grid item xs={3}>
                          <AnimateButton>
                            <Button
                              disableElevation
                              fullWidth
                              size="small"
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={!_.isEmpty(errors) || isSubmitting}
                            >
                              Save
                            </Button>
                          </AnimateButton>
                        </Grid>
                      </>
                      :
                      <>
                        <Grid item xs={3}>
                          <AnimateButton>
                            <Button
                              disableElevation
                              // disabled={isSubmitting}
                              fullWidth
                              size="small"
                              type="button"
                              variant="contained"
                              color="primary"
                              onClick={() => setEditMode(true)}
                            >
                              Edit
                            </Button>
                          </AnimateButton>
                        </Grid>
                      </>
                  }
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-signup">Email Address</InputLabel>
                      <OutlinedInput
                        fullWidth
                        id="email"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        // onChange={handleChange}
                        inputProps={{}}
                        disabled={true}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="given-name">First Name</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.givenName && errors.givenName)}
                        id="given-name"
                        type={'text'}
                        value={values.givenName}
                        name="givenName"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        inputProps={{}}
                        disabled={!editMode}
                      />
                      {touched.givenName && errors.givenName && (
                        <FormHelperText error id="helper-text-first-name">
                          {errors.givenName as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="family-name">Last Name</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.familyName && errors.familyName)}
                        id="family-name"
                        type={'text'}
                        value={values.familyName}
                        name="familyName"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        disabled={!editMode}
                        inputProps={{}}
                      />
                      {touched.familyName && errors.familyName && (
                        <FormHelperText error id="helper-text-last-name">
                          {errors.familyName as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="time-zone">Time Zone</InputLabel>
                      <Autocomplete
                        options={timezoneLabels}
                        renderInput={(params) => <TextField {...params} />}
                        fullWidth
                        id="time-zone"
                        value={values.zoneInfo}
                        onBlur={handleBlur}
                        onChange={(e, value) => {
                          setFieldValue("zoneInfo", value);
                        }}
                        disabled={!editMode}
                      />
                      {touched.zoneInfo && errors.zoneInfo && (
                        <FormHelperText error id="helper-text-time-zone">
                          {errors.zoneInfo as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}

                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>

      </>
    );
  }
;

export default ProfileEditor;