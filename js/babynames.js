Database.initialize("bm6jT0Rj1lUCwutfFk1WUgXm4wLRpN1Jz4LKMLqw", "5efdGRCwsq00WEv7jCMrndhfmGPhLlhhqgQ9f2LU");

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

  if (Database.authResolved) {
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
  var emailElement = document.getElementById("email");
  var passwordElement = document.getElementById("password");
  
  email = emailElement ? emailElement.value.toLowerCase() : "";
  username = email;
  password = passwordElement ? passwordElement.value : "";
}

function setOutput() {    
  document.getElementById("output").innerHTML = output;
}

function beginWithButton() {
  var e = "click";
  begin(e);
}

function beginWithGoogle() {
  output = "Signing in with Google...";
  setOutput();
  Database.User.logInWithGoogle({
    success: function(user) {
      output = "Welcome, " + capitaliseFirstLetter(user.getUsername()) + "!";
      setOutput();
      checkCurrentUser();
    },
    error: function(user, error) {
      output = "Google Sign-In: " + (error ? (error.message || error) : "Failed to sign in.");
      setOutput();
      checkCurrentUser();
    }
  });
}

function begin(e) {
  if (e.keyCode == 13 || e == "click") {
    getLoginInput();
    if (!email || email.length < 3 || !email.includes('@')) {
      output = "Please enter a valid email address.";
      setOutput();
      return;
    }
    if (!password || password.length < 6) {
      output = "Please enter a password with at least 6 characters.";
      setOutput();
      return;
    }

    output = "Beginning...";
    setOutput();

    Database.User.begin(email, password, {
      success: function(user, action) {
        if (action === 'signup') {
          output = "Account created! Welcome, " + capitaliseFirstLetter(user.getUsername()) + ".";
        } else {
          output = "Logged in as " + capitaliseFirstLetter(user.getUsername()) + ".";
        }
        setOutput();
        checkCurrentUser();
      },
      error: function(user, error) {
        if (error && (error.code === 'auth/wrong-password' || error.message.includes('wrong-password'))) {
          output = "Incorrect password. If you forgot your password, please click Forgot Password.";
        } else {
          output = "Error: " + (error ? (error.message || error) : "Authentication failed.");
        }
        setOutput();
        checkCurrentUser();
      }
    });
  }
}

function signUpWithButton() {
  beginWithButton();
}

function logInWithButton() {
  beginWithButton();
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
  if (!email || email.length < 3) {
    output = "Please enter your email address to reset password.";
    setOutput();
    return;
  }
  output = "Sending password reset email...";
  setOutput();
  Database.User.requestPasswordReset(email, {
    success: function() {
      output = "Password reset email sent to " + email;
      setOutput();
    },
    error: function(error) {
      output = "Error: " + error.message;
      setOutput();
    }
  });
}

function logOut() {
  output = "Logged out.";
  username = undefined;
  setOutput();

  Database.User.logOut();
  account();
}

function checkCurrentUser() {
  if (currentPageValue === undefined) {
    if (window.location.href.includes("mynames.html")) currentPageValue = "MyNames";
    else if (window.location.href.includes("newnames.html")) currentPageValue = "NewNames";
    else if (window.location.href.includes("about.html")) currentPageValue = "About";
    else currentPageValue = "Account";
  }

  currentUser = Database.User.current();

  if (currentUser) {
    userId = currentUser.id;
    if (currentPageValue == "Account") {
      $('h2').html('My Account');
      if (document.getElementById("begin")) document.getElementById("begin").style.display = "inline-block";
      if (document.getElementById("myNames")) document.getElementById("myNames").style.display = "inline-block";
      if (document.getElementById("newNames")) document.getElementById("newNames").style.display = "inline-block";
      if (document.getElementById("logOut")) document.getElementById("logOut").style.display = "inline-block";
      if (document.getElementById("authActions")) document.getElementById("authActions").style.display = "none";
      if (document.getElementById("resetPassword")) document.getElementById("resetPassword").style.display = "none";
      if (document.getElementById("password")) document.getElementById("password").style.display = "none";
      username = currentUser.getUsername();
      email = currentUser.get("email");
      if (document.getElementById("email")) {
        document.getElementById("email").value = email || "";
        document.getElementById("email").disabled = true;
      }
    }
  } else {
    if (currentPageValue == "Account") {
      $('h2').html('Begin');
      if (document.getElementById("myNames")) document.getElementById("myNames").style.display = "none";
      if (document.getElementById("newNames")) document.getElementById("newNames").style.display = "none";
      if (document.getElementById("logOut")) document.getElementById("logOut").style.display = "none";
      if (document.getElementById("begin")) document.getElementById("begin").style.display = "none";
      if (document.getElementById("authActions")) document.getElementById("authActions").style.display = "block";
      if (document.getElementById("resetPassword")) document.getElementById("resetPassword").style.display = "inline-block";
      if (document.getElementById("password")) document.getElementById("password").style.display = "inline-block";
      if (document.getElementById("email")) document.getElementById("email").disabled = false;
      setElementById("account","!current");
    } else {
      account();
    }
  }
  if (Database.User.current() == null || Database.User.current().getUsername() == "undefined") {
    setElementById("account","please log in.");
    currentUser = null;
  } else {
    setElementById("account",capitaliseFirstLetter(Database.User.current().getUsername()));
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
  currentUser = Database.User.current();
  username = currentUser.getUsername();
  var startsWithEl = document.getElementById("startsWith");
  startsWithValue = startsWithEl ? startsWithEl.value : "";
  namesArray = [];
  gendersArray = [];
  var genderClass;
  var BabyName = Database.Object.extend("names");

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

  var query = new Database.Query(BabyName);
  query.equalTo("userId", userId);

  if (startsWithValue != null && startsWithValue != "") {
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

  query.limit(1000); // Fetch all to process locally
  query.find({
    success: function(results) {
      if (gender != "All") {
        results = results.filter(function(r) { return r.get("gender") == gender; });
      }
      
      if (startsWithValue && startsWithValue != "") {
        var prefix = startsWithValue.toLowerCase();
        results = results.filter(function(r) { 
          var n = r.get("name");
          return n && n.toLowerCase().indexOf(prefix) === 0; 
        });
      }

      if (sort=="newest") {
        results.sort(function(a,b) { return b.createdAt - a.createdAt; });
      } else if (sort=="oldest") {
        results.sort(function(a,b) { return a.createdAt - b.createdAt; });
      } else if (sort=="namesAtoZ") {
        results.sort(function(a,b) { return a.get("name").localeCompare(b.get("name")); });
      } else if (sort=="namesZtoA") {
        results.sort(function(a,b) { return b.get("name").localeCompare(a.get("name")); });
      } else {
        results.sort(function(a,b) { return a.get("name").localeCompare(b.get("name")); });
      }
      
      results = results.slice(0, limit);

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
  currentUser = Database.User.current();
  username = currentUser.getUsername();
  var startsWithEl = document.getElementById("startsWith");
  startsWithValue = startsWithEl ? startsWithEl.value : "";

  namesArray = [];
  gendersArray = [];
  var genderClass;
  var BabyName = Database.Object.extend("Name");

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

  var query = new Database.Query(BabyName);
  // We will filter by gender locally after fetching to avoid Firestore index errors
  // if (gender!="All"){
  //   query.equalTo("gender", gender);
  // }
  if (startsWithValue != null && startsWithValue != "") {
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

  // We fetch without limit to ensure local gender filtering doesn't run out of names
  // query.limit(limit);
  query.find({
    success: function(results) {
      if (gender != "All") {
        results = results.filter(function(r) { return r.get("gender") == gender; });
      }
      
      if (startsWithValue && startsWithValue != "") {
        var prefix = startsWithValue.toLowerCase();
        results = results.filter(function(r) { 
          var n = r.get("name");
          return n && n.toLowerCase().indexOf(prefix) === 0; 
        });
      }

      if (sort=="uncommon") {
        results.sort(function(a,b) { return b.get("rank") - a.get("rank"); });
      } else if (sort=="popular") {
        results.sort(function(a,b) { return a.get("rank") - b.get("rank"); });
      } else if (sort=="namesAtoZ") {
        results.sort(function(a,b) { return a.get("name").localeCompare(b.get("name")); });
      } else if (sort=="namesZtoA") {
        results.sort(function(a,b) { return b.get("name").localeCompare(a.get("name")); });
      } else {
        results.sort(function(a,b) { return a.get("name").localeCompare(b.get("name")); });
      }

      results = results.slice(0, limit);

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

  var BabyName = Database.Object.extend("names");
  var query = new Database.Query(BabyName);
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
  currentUser = Database.User.current();
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

  var BabyName = Database.Object.extend("names");
  var query = new Database.Query(BabyName);
  query.equalTo("name", rowName);
  query.equalTo("userId", userId);
  query.limit(1);
  query.find({
    success: function(results) {
      var object = results[0];      

      if (results.length < 1) {

        var NameObject = Database.Object.extend("names");
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
