import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUsernameChange=(e)=>{
    const value=e.target.value
      setUsername(value)
  }
  const handlePasswordChange=(e)=>{
    const value=e.target.value
    setPassword(value)
  }
  const handleConfirmPasswordChange=(e)=>{
    const value=e.target.value
    setConfirmPassword(value)
  }
  const handleSubmit=async()=>{
    setLoading(true)
    const formData={username,password,confirmPassword}
    const validStaus=validateInput(formData);
   if(validStaus){
    const result=await register(formData)
    console.log(result)

   } 

  }
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    const {username, password}={...formData}
    return axios.post(`${config.endpoint}/auth/register`,{username,password}).then((res)=>{
      
      setLoading(false)

      enqueueSnackbar('Success',{variant:'success'})

      return res
    }).catch((err)=>{
      setLoading(false)

      enqueueSnackbar('Username is already taken' ,{variant:'error'})
      return err})
    
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {

    // console.log(data)
    //checkUsername
    if(!data.username || !data.password) {
      
      setLoading(false)

      enqueueSnackbar('required',{variant:'warning'})

      return false}


    //checkPass 
    if( data.username.length<6||data.password.length<6) {
      setLoading(false)

      enqueueSnackbar('6',{variant:'warning'})
      return false}

    if(data.confirmPassword!==data.password){
      setLoading(false)
      
      enqueueSnackbar('do not match',{variant:'warning'})
      return false
    }

    return true;

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={handleUsernameChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handlePasswordChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleConfirmPasswordChange}
            type="password"
            fullWidth
          />
             
            {loading ? 
            <Button variant="text"><CircularProgress /></Button>

             :  <Button className="button" variant="contained" onClick={handleSubmit}>
            Register Now
           </Button> }

        
          <p className="secondary-action">
            Already have an account?{" "}
             <a className="link" href="#">
              Login here
             </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
