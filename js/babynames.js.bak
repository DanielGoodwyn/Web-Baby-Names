Parse.initialize("bm6jT0Rj1lUCwutfFk1WUgXm4wLRpN1Jz4LKMLqw", "5efdGRCwsq00WEv7jCMrndhfmGPhLlhhqgQ9f2LU");

var loginForm;
var userLabel;
var example;
var startsWith;

var usernameInputText;
var passwordInputText;
var emailInputText;

var gender;
var limit;
var sort;

var startsWithValue;

var username;
var userId;
var password;
var email;

var output;

var currentPageValue;
var currentUser;

var namesArray = [];
var gendersArray = [];

var fakeSaveBool = false;
var exampleInnerHTML;

function currentPage(value) {
	currentPageValue = value;

  checkCurrentUser();
  if (currentUser!=null) {
    currentUser.save({
      lastPage: currentPageValue
    }, {
      success: function(currentUser) {
        checkCurrentUser();
      },
      error: function(currentUser, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
}

function show(target){
  document.getElementById(target).style.display = 'block';
}
function hide(target){
  document.getElementById(target).style.display = 'none';
}

function dlg() {
  window.location.href = "http://www.danielgoodwyn.com/";
}

function account() {
  window.location.href = "index.html";
}

function about() {
  window.location.href = "about.html";
}

function myNames() {
  window.location.href = "mynames.html";
}

function newNames() {
  window.location.href = "newnames.html";
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function setElementById(identification, string) {
  document.getElementById(identification).innerHTML = string;
}

function getLoginInput() {
  username = loginForm.elements[0].value.toLowerCase();
  password = loginForm.elements[1].value;
  email = loginForm.elements[2].value.toLowerCase();
}

function setOutput() {    
  document.getElementById("output").innerHTML = output;
}

function signUpWithButton() {
  var e = "click";
  signUp(e);
}

function logInWithButton() {
  var e = "click";
  logIn(e);
}

function logInWithFB() {
  output = "User logging in through Facebook...";
  setOutput();
  Parse.FacebookUtils.logIn(null, {
    success: function(user) {
      if (!user.existed()) {
        checkCurrentUser();
        output = capitaliseFirstLetter(currentUser.getUsername()) + " signed up and logged in through Facebook.";
        setOutput();
      } else {
        checkCurrentUser();        
        output = capitaliseFirstLetter(currentUser.getUsername()) + " logged in through Facebook.";
        setOutput();
      }
    },
    error: function(user, error) {
      alert("User cancelled the Facebook login or did not fully authorize.");
      console.log("user cancelled");
    }
  });
}

// use this?
function getNameFromFB() {
  console.log("getNameFromFB");
  FB.api('/me', function(response) {
    alert('Your name is ' + response.name);
  });
}

function linkWithFB() {
  currentUser = Parse.User.current();

  var query = new Parse.Query(Parse.User);
  query.equalTo("username", currentUser.getUsername());
  query.find({
    success: function(queryUser) {

      linkUser = queryUser[0];
      console.log(linkUser);

      if (!Parse.FacebookUtils.isLinked(linkUser)) {
        Parse.FacebookUtils.link(linkUser, null, {
          success: function(linkUser) {
            output = capitaliseFirstLetter(currentUser.getUsername()) + " is now linked to Facebook.";
            setOutput();
            checkCurrentUser();
          },
          error: function(linkUser, error) {
            output = "Facebook authorization failure:" + error.message;
            setOutput();
            checkCurrentUser();
          }
        });
      }

    }
  });
}

function setUsername() {
  getLoginInput();
  currentUser.save({
    username: username
  }, {
    success: function(currentUser) {
      output = "Username set to " + capitaliseFirstLetter(username) + ".";
      setOutput();
    },
    error: function(currentUser, error) {
      output = "Error: " + error.code + " " + error.message;
      setOutput();
    }
  });
}

function setEmail() {
  getLoginInput();
  currentUser.save({
    email: email
  }, {
    success: function(currentUser) {
      output = "Email set to " + email + ".";
      setOutput();
    },
    error: function(currentUser, error) {
      output = "Error: " + error.code + " " + error.message;
      setOutput();
    }
  });
}


function resetPassword() {
  getLoginInput();
  Parse.User.requestPasswordReset(email, {
    success: function() {
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function unlinkFromFB() {
  Parse.FacebookUtils.unlink(currentUser, {
    success: function(currentUser) {
      output = capitaliseFirstLetter(currentUser.getUsername()) + " is no longer associated with their Facebook account.";
      setOutput();
      checkCurrentUser();
    },
    error: function(currentUser, error) {
      output = "Facebook deauthorization failure:" + error.message;
      setOutput();
    }
  });
}

function loginInputValidate() {
  usernameInputText = loginForm.elements[0].value;
  passwordInputText = loginForm.elements[1].value;
  emailInputText = loginForm.elements[2].value;
  if (usernameInputText < 1 || passwordInputText < 1 || emailInputText < 1) {
    document.getElementById("signUp").style.display = "none";
  } else {
    document.getElementById("signUp").style.display = "inline-block";
  }
  if (usernameInputText < 1 || passwordInputText < 1) {
    document.getElementById("logIn").style.display = "none";
  } else {
    document.getElementById("logIn").style.display = "inline-block";
  }
  if (usernameInputText < 1 || !currentUser) {
    document.getElementById("setUsername").style.display = "none";
  } else {
    document.getElementById("setUsername").style.display = "inline-block";
  }
  if (emailInputText < 1 || !currentUser) {
    document.getElementById("setEmail").style.display = "none";
  } else {
    document.getElementById("setEmail").style.display = "inline-block";
  }
}

function signUp(e) {
  if (e.keyCode == 13 || e == "click") {
    getLoginInput();

    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);      
    user.set("limit", 25);
    user.set("letter", "A");
    user.set("name", "Adam");
    user.set("gender", "M");
    user.set("sort", "popular");
    user.set("lastPage", "Account");
     
    user.signUp(null, {
      success: function(user) {
        output = "Signed up as " + capitaliseFirstLetter(username) + ".";
        setOutput();
        checkCurrentUser();
      },
      error: function(user, error) {
        output = "Error: " + error.message;
        setOutput();
        checkCurrentUser();
        logIn("click");
      }
    });
  } else {
    loginInputValidate();
  }
}

function logIn(e) {
  if (e.keyCode == 13 || e == "click") {
    getLoginInput();
    output = "Logging in as " + capitaliseFirstLetter(username) + " with " + email + "...";
    setOutput();

    Parse.User.logIn(username, password, {
      success: function(user) {
        output = "Logged in as " + capitaliseFirstLetter(username) + ".";
        setOutput();
        checkCurrentUser();
      },
      error: function(user, error) {
        output = "Error: " + error.message;
        setOutput();
        checkCurrentUser();
        signUp("click");
      }
    });
  } else {
    loginInputValidate(e);
  }
}

function logOut() {
  output = "Logged out.";
  username = undefined;
  setOutput();

  Parse.User.logOut();
  account();
}

function checkCurrentUser() {
  currentUser = Parse.User.current();

  if (currentUser) {
    userId = currentUser.id;
    if (currentPageValue == "Account") {
      $('h2').html('My Account');
      document.getElementById("begin").style.display = "inline-block";
      document.getElementById("myNames").style.display = "inline-block";
      document.getElementById("newNames").style.display = "inline-block";
      document.getElementById("logOut").style.display = "inline-block";
      document.getElementById("logIn").style.display = "none";
      document.getElementById("logInWithFB").style.display = "none";      
      if (Parse.FacebookUtils.isLinked(currentUser)) {
        document.getElementById("unlinkFromFB").style.display = "inline-block";
        document.getElementById("linkWithFB").style.display = "none";
      } else {
        document.getElementById("linkWithFB").style.display = "inline-block";
        document.getElementById("unlinkFromFB").style.display = "none";
      }
      document.getElementById("resetPassword").style.display = "inline-block";
      document.getElementById("setEmail").style.display = "inline-block";
      document.getElementById("setUsername").style.display = "inline-block";
      username = currentUser.getUsername();
      email = currentUser.get("email");
      password = currentUser.get("password");
      document.getElementById("username").value = capitaliseFirstLetter(username);
      document.getElementById("email").value = email;
    }
    } else {
      if (currentPageValue == "Account") {
      $('h2').html('Log In / Sign Up');
      document.getElementById("myNames").style.display = "none";
      document.getElementById("newNames").style.display = "none";
      document.getElementById("logOut").style.display = "none";
      document.getElementById("logIn").style.display = "inline-block";
      document.getElementById("logInWithFB").style.display = "inline-block";
      document.getElementById("linkWithFB").style.display = "none";
      document.getElementById("unlinkFromFB").style.display = "none";
      document.getElementById("resetPassword").style.display = "none";
      setElementById("account","!current");
    } else {
      account();
    }
  }
  if (Parse.User.current() == null || Parse.User.current().getUsername() == "undefined") {
    setElementById("account","please log in.");
    currentUser = null;
  } else {
    setElementById("account",capitaliseFirstLetter(Parse.User.current().getUsername()));
  }  
  setDefaults();
  if (currentPageValue == "NewNames") {
    getNewNames();
  }
  if (currentPageValue == "MyNames") {
    getMyNames();
  }
}

function setDefaults() {
  var namesAtoZ = document.getElementById("namesAtoZ");
  if (currentPageValue == "NewNames") {
    document.getElementById("startsWith").value = currentUser.get("letter");
    sort = "popular";
    limit = 50;
    namesAtoZ.style.background='#eee';
    var namesPopular = document.getElementById("namesPopular");
    namesPopular.style.background='white';
    var namesUncommon = document.getElementById("namesUncommon");
    namesUncommon.style.background='#eee';
  } else if (currentPageValue == "MyNames") {
    document.getElementById("startsWith").value = currentUser.get("letter");
    sort = "namesAtoZ";
    limit = 1000;
    namesAtoZ.style.background='white';
    var namesNewest = document.getElementById("namesNewest");
    namesNewest.style.background='#eee';
    var namesOldest = document.getElementById("namesOldest");
    namesOldest.style.background='#eee';
  }
  if (currentPageValue == "MyNames" || currentPageValue == "NewNames") {
    var genderForm = document.getElementById("genderForm");
    genderForm.style.background='rgba(0,0,0,.1)';
    var maleNames = document.getElementById("maleNames");
    maleNames.style.background='#eee';
    var femaleNames = document.getElementById("femaleNames");
    femaleNames.style.background='#eee';
    var allNames = document.getElementById("allNames");
    allNames.style.background='#eee';
    gender = currentUser.get("gender");
    if (gender == "M") {
      maleNames.style.background='white';
      genderForm.style.background='#cdf';
    } else if (gender == "F") {
      femaleNames.style.background='white';
      genderForm.style.background='#fcd';
    } else {
      allNames.style.background='white';
    }
    var namesZtoA = document.getElementById("namesZtoA");
    namesZtoA.style.background='#eee';
  }
}

function resetDefaults() {
  window.location.hash = "babyNames";
  document.getElementById("startsWith").value = "";

  currentUser.save({
    letter: "",
    gender: "All",
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  setDefaults();
  if (currentPageValue == "NewNames") {
    getNewNames();
  } else if (currentPageValue == "MyNames") {
    getMyNames();
  }
}

function setLimit() {
  var limitSelect = document.getElementById("limitSelect");
  var limitValue = limitSelect.options[limitSelect.selectedIndex].value;
  if (limitValue != "unlimited") {
    limit = parseInt(limitValue);
  } else {
    limit = 1000;
  }
}

function newNamesPopular() {
  namesPopular();
  getNewNames();
}

function namesPopular() {
  sort = "popular";

  var namesAtoZ = document.getElementById("namesAtoZ");
  namesAtoZ.style.background='#eee';
  var namesZtoA = document.getElementById("namesZtoA");
  namesZtoA.style.background='#eee';
  var namesPopular = document.getElementById("namesPopular");
  namesPopular.style.background='white';
  var namesUncommon = document.getElementById("namesUncommon");
  namesUncommon.style.background='#eee';
}

function newNamesUncommon() {
  namesUncommon();
  getNewNames();
}

function namesUncommon() {
  sort = "uncommon";

  var namesAtoZ = document.getElementById("namesAtoZ");
  namesAtoZ.style.background='#eee';
  var namesZtoA = document.getElementById("namesZtoA");
  namesZtoA.style.background='#eee';
  var namesPopular = document.getElementById("namesPopular");
  namesPopular.style.background='#eee';
  var namesUncommon = document.getElementById("namesUncommon");
  namesUncommon.style.background='white';
}

function myNamesAtoZ() {
  namesAtoZ();
  getMyNames();
}

function newNamesAtoZ() {
  namesAtoZ();
  getNewNames();
}

function namesAtoZ() {
  sort = "namesAtoZ";

  var namesAtoZ = document.getElementById("namesAtoZ");
  namesAtoZ.style.background='white';
  var namesZtoA = document.getElementById("namesZtoA");
  namesZtoA.style.background='#eee';
  if (document.getElementById("namesNewest") != null) {
    var namesNewest = document.getElementById("namesNewest");
    namesNewest.style.background='#eee';
    var namesOldest = document.getElementById("namesOldest");
    namesOldest.style.background='#eee';
  } else {    
    var namesPopular = document.getElementById("namesPopular");
    namesPopular.style.background='#eee';
    var namesUncommon = document.getElementById("namesUncommon");
    namesUncommon.style.background='#eee';
  }
}

function myNamesZtoA() {
  namesZtoA();
  getMyNames();
}

function newNamesZtoA() {
  namesZtoA();
  getNewNames();
}

function namesZtoA() {
  sort = "namesZtoA";

  var namesAtoZ = document.getElementById("namesAtoZ");
  namesAtoZ.style.background='#eee';
  var namesZtoA = document.getElementById("namesZtoA");
  namesZtoA.style.background='white';
  if (document.getElementById("namesNewest") != null) {
    var namesNewest = document.getElementById("namesNewest");
    namesNewest.style.background='#eee';
    var namesOldest = document.getElementById("namesOldest");
    namesOldest.style.background='#eee';
  } else {    
    var namesPopular = document.getElementById("namesPopular");
    namesPopular.style.background='#eee';
    var namesUncommon = document.getElementById("namesUncommon");
    namesUncommon.style.background='#eee';
  }
}

function myNamesNewest() {
  namesNewest();
  getMyNames();
}

function newNamesNewest() {
  namesNewest();
  getNewNames();
}

function namesNewest() {
  sort = "newest";

  var namesAtoZ = document.getElementById("namesAtoZ");
  namesAtoZ.style.background='#eee';
  var namesZtoA = document.getElementById("namesZtoA");
  namesZtoA.style.background='#eee';
  var namesNewest = document.getElementById("namesNewest");
  namesNewest.style.background='white';
  var namesOldest = document.getElementById("namesOldest");
  namesOldest.style.background='#eee';
}

function myNamesOldest() {
  namesOldest();
  getMyNames();
}

function newNamesOldest() {
  namesOldest();
  getNewNames();
}

function namesOldest() {
  sort = "oldest";

  var namesAtoZ = document.getElementById("namesAtoZ");
  namesAtoZ.style.background='#eee';
  var namesZtoA = document.getElementById("namesZtoA");
  namesZtoA.style.background='#eee';
  var namesNewest = document.getElementById("namesNewest");
  namesNewest.style.background='#eee';
  var namesOldest = document.getElementById("namesOldest");
  namesOldest.style.background='white';
}

function myMaleNames() {
  maleNames();
  getMyNames();
}

function newMaleNames() {
  maleNames();
  getNewNames();
}

function maleNames() {
  gender = "M";

  var genderForm = document.getElementById("genderForm");
  genderForm.style.background='#cdf';

  var maleNames = document.getElementById("maleNames");
  maleNames.style.background='white';
  var femaleNames = document.getElementById("femaleNames");
  femaleNames.style.background='#eee';
  var allNames = document.getElementById("allNames");
  allNames.style.background='#eee';
}

function myFemaleNames() {
  femaleNames();
  getMyNames();
}

function newFemaleNames() {
  femaleNames();
  getNewNames();
}

function femaleNames() {
  gender = "F";

  var genderForm = document.getElementById("genderForm");
  genderForm.style.background='#fcd';

  var maleNames = document.getElementById("maleNames");
  maleNames.style.background='#eee';
  var femaleNames = document.getElementById("femaleNames");
  femaleNames.style.background='white';
  var allNames = document.getElementById("allNames");
  allNames.style.background='#eee';
}

function allMyNames() {
  allNames();
  getMyNames();
}

function allNewNames() {
  allNames();
  getNewNames();
}

function allNames() {
  gender = "All";

  var genderForm = document.getElementById("genderForm");
  genderForm.style.background='rgba(0,0,0,.1)';
  
  var maleNames = document.getElementById("maleNames");
  maleNames.style.background='#eee';
  var femaleNames = document.getElementById("femaleNames");
  femaleNames.style.background='#eee';
  var allNames = document.getElementById("allNames");
  allNames.style.background='white';
}

function randomName() {
  window.location.hash = "form";
  var number;
  number = Math.round(randomNumber(0,namesArray.length-1));
  var randomName = namesArray[number];
  var genderClass;
  if (gendersArray[number]=="F"){
    genderClass = "girl";
  } else {
    genderClass = "boy";
  }
  var randomOutput = "";

  randomOutput = randomOutput + "<div id='" + randomName + "' class='listItem " + genderClass + "'>";
  randomOutput = randomOutput + "<span class='rowTitle' onclick='getInfo(this.parentNode.id)' id='" + randomName + "Label'>";
  randomOutput = randomOutput + randomName + "</span>";
  randomOutput = randomOutput + "<span class='detail' id='" + randomName + "Detail'>";
  randomOutput = randomOutput + "</span></div>";

  setElementById("randomName", randomOutput);

}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getMyNames() {
  currentUser = Parse.User.current();
  username = currentUser.getUsername();
  startsWithValue = startsWith.value;
  namesArray = [];
  gendersArray = [];
  var genderClass;
  var BabyName = Parse.Object.extend("names");

  currentUser.save({
    limit: limit,
    gender: gender,
    lastPage: currentPageValue,
    sort: sort
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  var query = new Parse.Query(BabyName);
  if (gender != "All") {
    query.equalTo("gender", gender);
  }
  query.equalTo("userId", userId);

  if (startsWithValue != null || startsWithValue != "") {
    query.matches("name", capitaliseFirstLetter(startsWithValue.toLowerCase() + ".*"));
    currentUser.save({
    letter: capitaliseFirstLetter(startsWithValue.substring(0,1))
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  }

  if (sort=="newest") {
    query.descending("createdAt");
  } else if (sort=="oldest") {
    query.ascending("createdAt");
  } else if (sort=="namesAtoZ") {
    query.ascending("name");
  } else if (sort=="namesZtoA") {
    query.descending("name");
  } else {
    query.ascending("name");
  }
  query.limit(limit);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];       
        namesArray.push(object.get('name'));
        gendersArray.push(object.get('gender'));
        setOutput();        
      }      
      output = "<div class='orderedList'>"
      for (var j = 0; j < namesArray.length; j++) {
        var listItemName = namesArray[j];
        if (gendersArray[j]=="F"){
          genderClass = "girl";
        } else {
          genderClass = "boy";
        }
        output = output + "<div id='" + listItemName + "' class='listItem " + genderClass + "'>";
        output = output + "<span class='rowTitle' onclick='getInfo(this.parentNode.id)' id='" + listItemName + "Label'>";
        output = output + listItemName + "</span>";
        output = output + "<span class='detail' onclick='deleteRow(this.parentNode.id)' id='" + listItemName + "Detail'>";
        output = output + "×</span></div>";
      }
      output = output.substring(0, output.length - 6) + "</div>";
      setOutput();
      if (startsWithValue != "" && results.length == 0) {
        startsWithValue = "";
        $('#startsWith').val("");
        getMyNames();
      } else if (results.length == 0) {
        output = "Save a name from <a href='newnames.html'><u>New</u> Names</a>, and it will show up here."
        setOutput();
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }    
  });

  output = "Getting names...";
  setOutput();
}

function getNewNames() {
  currentUser = Parse.User.current();
  username = currentUser.getUsername();
  startsWithValue = startsWith.value;

  namesArray = [];
  gendersArray = [];
  var genderClass;
  var BabyName = Parse.Object.extend("name");

  currentUser.save({
    limit: limit,
    gender: gender,
    lastPage: currentPageValue,
    sort: sort
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  var query = new Parse.Query(BabyName);
  if (gender!="All"){
    query.equalTo("gender", gender);
  }
  if (sort=="uncommon") {
    query.descending("rank");
  } else if (sort=="popular") {
    query.ascending("rank");
  } else if (sort=="namesAtoZ") {
    query.ascending("name");
  } else if (sort=="namesZtoA") {
    query.descending("name");
  } else {
    query.ascending("name");
  }

  if (startsWithValue != null || startsWithValue != "") {
    query.matches("name", capitaliseFirstLetter(startsWithValue.toLowerCase() + ".*"));
    currentUser.save({
    letter: capitaliseFirstLetter(startsWithValue.substring(0,1))
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
  } 

  query.limit(limit);
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var object = results[i];       
        namesArray.push(object.get('name'));
        gendersArray.push(object.get('gender'));
      }      
      output = "<div class='orderedList'>";
      for (var j = 0; j < namesArray.length; j++) {
        var listItemName = namesArray[j];
        if (gendersArray[j]=="F"){
          genderClass = "girl";
        } else {
          genderClass = "boy";
        }
        output = output + "<div id='" + listItemName + "' class='listItem " + genderClass + "'>";
        output = output + "<span class='rowTitle' onclick='getInfo(this.parentNode.id)' id='" + listItemName + "Label'>";
        output = output + "<div class='orderedListNumber' id='" + (j+1) + "'> " + (j+1) + ". </div>";
        output = output + listItemName + "</span>";
        output = output + "<span class='detail' onclick='saveRow(this.parentNode.id, \"" + gendersArray[j] + "\")' id='" + listItemName + "Detail'>";
        output = output + "★</span></div>";
      }

      output = output.substring(0, output.length - 6) + "</div>";
      setOutput();
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  output = "Getting names...";
  setOutput();
}

function deleteRow(rowName) {
  output = output + "Deleted " + rowName + ".<br>";
  setOutput();

  var BabyName = Parse.Object.extend("names");
  var query = new Parse.Query(BabyName);
  query.equalTo("name", rowName);
  query.limit(1);
  query.find({
    success: function(results) {
      var object = results[0];
      object.destroy({
      });

      var item = document.getElementById(rowName);
      item.parentNode.removeChild(item);
      var outputDiv = document.getElementById("output");
      output = outputDiv.innerHTML;
      setOutput();

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }    
  });
}

function saveRow(rowName, rowGender) {
  currentUser = Parse.User.current();
  username = currentUser.getUsername();

    currentUser.save({
    name: rowName,
    letter: capitaliseFirstLetter(rowName.substring(0,1))
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });

  var item = document.getElementById(rowName);
  var label = document.getElementById(rowName + "Label");
  var detail = document.getElementById(rowName + "Detail");
  label.style.color='rgba(0,0,0,.5)';
  label.style.textShadow='-1px -1px 1px rgba(255,255,255,.25)';
  detail.style.color='white';
  detail.style.textShadow='1px -1px 1px rgba(0,0,0,.25)';
  if (rowGender == "F") {
    item.style.background='#c9a';
  } else {
    item.style.background='#9ac';
  }
  var outputDiv = document.getElementById("output");
  output = outputDiv.innerHTML;
  setOutput();

  var BabyName = Parse.Object.extend("names");
  var query = new Parse.Query(BabyName);
  query.equalTo("name", rowName);
  query.equalTo("userId", userId);
  query.limit(1);
  query.find({
    success: function(results) {
      var object = results[0];      

      if (results.length < 1) {

        var NameObject = Parse.Object.extend("names");
        var nameObject = new NameObject();
         
        nameObject.set("userId", userId);
        nameObject.set("name", rowName);
        nameObject.set("gender", rowGender);
         
        nameObject.save(null, {
          success: function(nameObject) {
          },
          error: function(nameObject, error) {
          }
        });        
  
        output = output + "Saved " + rowName + ".<br>";
        setOutput();

      } else {

        output = output + rowName + " is already saved.<br>";
        setOutput();

      }

    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }    
  });
}

function getInfo(rowName) {
  window.open("http://www.behindthename.com/name/" + rowName, '_blank');

  currentUser.save({
    name: rowName,
    letter: capitaliseFirstLetter(rowName.substring(0,1))
  }, {
    success: function(currentUser) {
    },
    error: function(currentUser, error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function fakeDelete(rowName) {
  output = "Deleted " + rowName + ".<br><br><a style='cursor:pointer;' onclick='refreshExample()'>refresh example</a>";
  setOutput();

  var item = document.getElementById(rowName);
  item.parentNode.removeChild(item);
}

function fakeSave(rowName, rowGender) {  

  var item = document.getElementById(rowName);
  var label = document.getElementById(rowName + "Label");
  var detail = document.getElementById(rowName + "Detail");
  label.style.color='rgba(0,0,0,.5)';
  label.style.textShadow='-1px -1px 1px rgba(255,255,255,.25)';
  detail.style.color='white';
  detail.style.textShadow='1px -1px 1px rgba(0,0,0,.25)';
  if (rowGender == "F") {
    item.style.background='#c9a';
  } else {
    item.style.background='#9ac';
  }
  var outputDiv = document.getElementById("output");
  output = outputDiv.innerHTML;
  if (!fakeSaveBool) {
    output = rowName + " saved.<br><br><a style='cursor:pointer;' onclick='refreshExample()'>refresh example</a>";
  } else {
    output = rowName + " already saved.<br><br><a style='cursor:pointer;' onclick='refreshExample()'>refresh example</a>";
  }
  setOutput();

  if (!fakeSaveBool) {
    fakeSaveBool = true;
  }
}

function saveExample() {  
  example = document.getElementById("example");
  exampleInnerHTML = example.innerHTML;
}

function refreshExample() {
  var newExample = document.getElementById("example");
  newExample.innerHTML = exampleInnerHTML;
  fakeSaveBool = false;
  output = "";
  setOutput();
}
