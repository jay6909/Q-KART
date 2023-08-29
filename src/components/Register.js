import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link  } from "react-router-dom";

import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: "",
    confirmPassword: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    const validStaus = validateInput(formData);
    if (validStaus) {
      setLoading(true);

      const result = await register(formData);
      // console.log(result);
      setLoading(false);

      if (result && result.status === 201) {
        enqueueSnackbar("Registered successfully", { variant: "success" });
        history.push("/login");
      } else if (result && result.status === 400) {
        // console.log(result)
        enqueueSnackbar(result.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          `Something went wrong. Check that the backend is running, reachable and returns valid JSON`,
          { variant: "error" }
        );
      }
    }
  };
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
    const { username, password } = { ...formData };
    return await axios
      .post(`${config.endpoint}/auth/register`, { username, password })
      .catch((err) => {
        return err.response;
      }).finally(()=>{
        setLoading(false);
      });
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
    if (!data.username) {
      enqueueSnackbar("username required", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("password required", { variant: "warning" });
      return false;
    }
    //checkPass
    if (data.username.length < 6) {
      enqueueSnackbar("username must be at least 6 characters long", {
        variant: "warning",
      });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("password must be at least 6 characters long", {
        variant: "warning",
      });
      return false;
    }
    if (data.confirmPassword !== data.password) {

      enqueueSnackbar("passwords do not match", { variant: "warning" });
      return false;
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
            onChange={handleOnChange}
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
            onChange={handleOnChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleOnChange}
            type="password"
            fullWidth
          />

          {loading ? (
             <Stack justifyContent="center" alignItems="center">
             <CircularProgress />
           </Stack>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={()=>{handleSubmit()}}
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
