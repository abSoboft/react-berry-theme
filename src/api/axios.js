import React from 'react'
import axios from "axios";

const instance = axios.create({
    baseURL : 'https://localhost:7028',
    headers: {
  //  Authorization: `<Your Auth Token>`, 
    }, 
    // .. other options
  });
  
  export default instance;