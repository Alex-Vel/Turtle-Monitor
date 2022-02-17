import './firebaseconfig.js';
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {getAuth, onAuthStateChanged, signOut, EmailAuthProvider, GoogleAuthProvider} from 'firebase/auth'
import TemperatureCurrent from "./temperature/TemperatureCurrent.js";
import { AppBar, Toolbar, IconButton, Avatar, Tooltip, Menu, MenuItem, Typography} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import './App.css';
import logo from './logo.png'


//Created with FirebaseUI Example Code
// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Email as auth providers.
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};
const auth = getAuth();
function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth ,(user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  if (!isSignedIn) {
    return (
      <div>
        <AppBar position="sticky" color="primary">
        <Toolbar>
          <img id="Logged-out" src={logo} alt="logo" sx={{width: '100px', height: '50px' }}/>      
        </Toolbar>
        </AppBar>
        <p id="p3">Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
  return (
    <div id="root">
      <AppBar position="sticky" color="primary">
        <Toolbar>
        <img id="Logged-in" src={logo} alt="logo" sx={{width: '100%', height: '50%' }}/>
          <Typography id="p1">Welcome {auth.currentUser.displayName}</Typography>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {auth.currentUser.photoURL?
              <Avatar alt="Logout" src={auth.currentUser.photoURL} sx={{ width: '100%', height: '100%' }} />
              :
              <Avatar  src={PersonIcon} sx={{ width: '150px', height: '150px' }} />
              }
            </IconButton>
          </Tooltip>
          <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              
                <MenuItem key={""} onClick={() => signOut(auth)}>
                  <Typography textAlign="center">Sign-out</Typography>
                </MenuItem>
              
            </Menu>
        </Toolbar>
        </AppBar>
      <div id="body">
        <div class="row">
          <div class="column_1">
            <div id="Temperature-readings">
              <div id="p5">
                <p>
                  Current turtle temperature:
                </p>
              </div>
              <TemperatureCurrent />
            </div>
            </div>
             
            </div>
          
  
      </div>
      </div>
      
  );
}

export default App;
