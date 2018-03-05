var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '800990545369-din7qjuc6uh22vri6f9dtu7q2mio9qch.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('customBtn'));
  });
};
var options = new gapi.auth2.SigninOptionsBuilder(
  {'scope': 'email https://www.googleapis.com/auth/drive'});

googleUser = auth2.currentUser.get();
googleUser.grant(options).then(
  function(success){
    console.log(JSON.stringify({message: "success", value: success}));
  },
  function(fail){
    alert(JSON.stringify({message: "fail", value: fail}));
  });
function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
    function(googleUser) {
      document.getElementById('name').innerText = "Signed in: " +
      googleUser.getBasicProfile().getName();
    }, function(error) {
      alert(JSON.stringify(error, undefined, 2));
  });
}
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSignIn,
    'onfailure': onFailure
  });
}
