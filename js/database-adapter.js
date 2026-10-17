const Database = {
  initialize: function() {
    firebase.initializeApp({
      projectId: "goodwyn-babynames",
      appId: "1:486710219401:web:88ee959f71896878962c58",
      apiKey: "AIzaSyCzUEuK46_qHYzxSS07GAprhtupTYsBNbs",
      authDomain: "goodwyn-babynames.firebaseapp.com"
    });
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    
    // load user data - only call checkCurrentUser once after initial auth resolution
    let authResolved = false;
    auth.onAuthStateChanged(u => {
      if (u) {
        db.collection('users').doc(u.uid).get().then(d => {
          Database.User._currentUser = new Database.UserClass(u, d.data() || {});
          if (!authResolved) {
            authResolved = true;
            Database.authResolved = true;
            if (typeof checkCurrentUser === 'function') checkCurrentUser();
          }
        });
      } else {
        Database.User._currentUser = null;
        if (!authResolved) {
          authResolved = true;
          Database.authResolved = true;
          if (typeof checkCurrentUser === 'function') checkCurrentUser();
        }
      }
    });
  },
  FacebookUtils: {
    init: function() {},
    logIn: function(n, cb) { if (cb && cb.error) cb.error(null, {message: 'Facebook login disabled in Firebase migration'}); },
    isLinked: function() { return false; },
    link: function(u, n, cb) { if (cb && cb.error) cb.error(u, {message: 'Disabled'}); },
    unlink: function(u, cb) { if (cb && cb.error) cb.error(u, {message: 'Disabled'}); }
  },
  User: {
    _currentUser: null,
    current: function() { return this._currentUser; },
    logIn: function(u, p, cb) {
      let email = u.includes('@') ? u : u + '@babynames.com';
      auth.signInWithEmailAndPassword(email, p).then(cred => {
        db.collection('users').doc(cred.user.uid).get().then(d => {
          Database.User._currentUser = new Database.UserClass(cred.user, d.data() || {});
          if (cb && cb.success) cb.success(Database.User._currentUser);
        });
      }).catch(e => {
        if (cb && cb.error) cb.error(null, e);
      });
    },
    begin: function(email, password, cb) {
      email = (email || '').trim().toLowerCase();
      auth.signInWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).get().then(d => {
          let userData = d.data() || { email: email, username: email.split('@')[0] };
          Database.User._currentUser = new Database.UserClass(cred.user, userData);
          if (cb && cb.success) cb.success(Database.User._currentUser, 'login');
        });
      }).catch(err => {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-login-credentials' || err.code === 'auth/invalid-credential') {
          auth.createUserWithEmailAndPassword(email, password).then(cred => {
            let initialData = {
              email: email,
              username: email.split('@')[0],
              limit: 25,
              letter: "",
              name: "Adam",
              gender: "All",
              sort: "popular",
              lastPage: "Account"
            };
            return db.collection('users').doc(cred.user.uid).set(initialData, {merge: true}).then(() => {
              Database.User._currentUser = new Database.UserClass(cred.user, initialData);
              if (cb && cb.success) cb.success(Database.User._currentUser, 'signup');
            });
          }).catch(signUpErr => {
            if (signUpErr.code === 'auth/email-already-in-use') {
              if (cb && cb.error) cb.error(null, { code: 'auth/wrong-password', message: 'Incorrect password. If you forgot your password, click Forgot Password.' });
            } else {
              if (cb && cb.error) cb.error(null, signUpErr);
            }
          });
        } else if (err.code === 'auth/wrong-password') {
          if (cb && cb.error) cb.error(null, { code: 'auth/wrong-password', message: 'Incorrect password. If you forgot your password, click Forgot Password.' });
        } else {
          if (cb && cb.error) cb.error(null, err);
        }
      });
    },
    logInWithGoogle: function(cb) {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        auth.signInWithRedirect(provider);
        return;
      }
      auth.signInWithPopup(provider).then(cred => {
        let u = cred.user;
        return db.collection('users').doc(u.uid).get().then(d => {
          let existingData = d.exists ? (d.data() || {}) : {};
          let displayName = u.displayName || u.email.split('@')[0];
          let mergedData = Object.assign({
            email: u.email,
            username: displayName,
            limit: 25,
            letter: "",
            name: "Adam",
            gender: "All",
            sort: "popular",
            lastPage: "Account"
          }, existingData, {
            email: u.email,
            username: existingData.username || displayName,
            photoURL: u.photoURL || existingData.photoURL || null
          });
          return db.collection('users').doc(u.uid).set(mergedData, { merge: true }).then(() => {
            Database.User._currentUser = new Database.UserClass(u, mergedData);
            if (cb && cb.success) cb.success(Database.User._currentUser);
          });
        });
      }).catch(err => {
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          auth.signInWithRedirect(provider);
        } else {
          if (cb && cb.error) cb.error(null, err);
        }
      });
    },
    logOut: function() { auth.signOut(); Database.User._currentUser = null; },
    requestPasswordReset: function(e, cb) {
      auth.sendPasswordResetEmail(e).then(() => {
        if (cb && cb.success) cb.success();
      }).catch(err => {
        if (cb && cb.error) cb.error(err);
      });
    }
  },
  Query: function(className) {
    this.className = className.className || className;
    this._where = [];
    this._limit = 1000;
    this._order = [];
    this.equalTo = function(k, v) { this._where.push(['==', k, v]); };
    this.matches = function(k, v) { 
      let prefix = v.replace('.*', '');
      this._where.push(['>=', k, prefix]);
      this._where.push(['<', k, prefix + '\\uf8ff']);
    };
    this.ascending = function(k) { this._order.push([k, 'asc']); };
    this.descending = function(k) { this._order.push([k, 'desc']); };
    this.limit = function(l) { this._limit = l; };
    this.find = function(cb) {
      let ref = db.collection(this.className);
      this._where.forEach(w => {
        if (w[0] == '==') ref = ref.where(w[1], '==', w[2]);
        if (w[0] == '>=') ref = ref.where(w[1], '>=', w[2]);
        if (w[0] == '<') ref = ref.where(w[1], '<', w[2]);
      });
      ref.limit(this._limit).get().then(snap => {
        let res = snap.docs.map(d => new Database.ObjectClass(this.className, d.id, d.data()));
        if (cb && cb.success) cb.success(res);
      }).catch(e => {
        if (cb && cb.error) cb.error(e);
      });
    };
    this.subscribe = function(cb) {
      let ref = db.collection(this.className);
      this._where.forEach(w => {
        if (w[0] == '==') ref = ref.where(w[1], '==', w[2]);
        if (w[0] == '>=') ref = ref.where(w[1], '>=', w[2]);
        if (w[0] == '<') ref = ref.where(w[1], '<', w[2]);
      });
      return ref.limit(this._limit).onSnapshot(snap => {
        let res = snap.docs.map(d => new Database.ObjectClass(this.className, d.id, d.data()));
        if (cb && cb.success) cb.success(res);
      }, e => {
        if (cb && cb.error) cb.error(e);
      });
    };
  }
};

Database.ObjectClass = function(className, id, data) {
  this.className = className;
  this.id = id;
  this.data = data || {};
  this.get = function(k) { return this.data[k]; };
  this.set = function(k, v) { this.data[k] = v; };
  this.existed = function() { return !!this.id; };
  this.save = function(data, cb) {
    if (data) {
      for (let k in data) this.data[k] = data[k];
    }
    if (!this.id) {
      db.collection(this.className).add(this.data).then(ref => {
        this.id = ref.id;
        if (cb && cb.success) cb.success(this);
      }).catch(e => { if (cb && cb.error) cb.error(this, e); });
    } else {
      db.collection(this.className).doc(this.id).set(this.data, {merge:true}).then(() => {
        if (cb && cb.success) cb.success(this);
      }).catch(e => { if (cb && cb.error) cb.error(this, e); });
    }
  };
  this.destroy = function(cb) {
    if (this.id) {
      db.collection(this.className).doc(this.id).delete().then(() => {
        if (cb && cb.success) cb.success();
      });
    }
  };
};

Database.Object = {
  extend: function(className) {
    let constructor = function(id, data) {
      return new Database.ObjectClass(className, id, data);
    };
    constructor.className = className;
    return constructor;
  }
};

Database.UserClass = function(user, data) {
  Database.ObjectClass.call(this, 'users', user ? user.uid : null, data);
  this.user = user;
  this.getUsername = function() { return this.data.username || (this.user ? this.user.email : 'unknown'); };
  this.signUp = function(nullVar, cb) {
    let email = this.data.email || this.data.username + '@babynames.com';
    let password = this.data.password;
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      this.id = cred.user.uid;
      this.user = cred.user;
      delete this.data.password;
      return db.collection('users').doc(this.id).set(this.data);
    }).then(() => {
      Database.User._currentUser = this;
      if (cb && cb.success) cb.success(this);
    }).catch(e => {
      if (cb && cb.error) cb.error(this, e);
    });
  };
};

// Make Database.User a constructor that returns a new UserClass
Database.User = Object.assign(function() {
  return new Database.UserClass();
}, Database.User);
