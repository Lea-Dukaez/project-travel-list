
// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // get data
    db.collection('destinations').get().then(snapshot=>{
      setupDestinations(snapshot.docs);
      setupUI(user);
    });
  } else {
    setupUI();
    setupDestinations([]);
  }
});

// singup
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', e => {
  e.preventDefault();
  //get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});


//logout
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
});


//login
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  //get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  // sign in the user
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    //close login modal and reset the form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

