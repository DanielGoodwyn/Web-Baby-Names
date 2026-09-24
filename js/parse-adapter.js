const Parse = {
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
          Parse.User._currentUser = new Parse.UserClass(u, d.data() || {});
          if (!authResolved) {
            authResolved = true;
            if (typeof checkCurrentUser === 'function') checkCurrentUser();
          }
        });
      } else {
        Parse.User._currentUser = null;
        if (!authResolved) {
          authResolved = true;
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
          Parse.User._currentUser = new Parse.UserClass(cred.user, d.data() || {});
          if (cb && cb.success) cb.success(Parse.User._currentUser);
        });
      }).catch(e => {
        if (cb && cb.error) cb.error(null, e);
      });
    },
    logOut: function() { auth.signOut(); Parse.User._currentUser = null; },
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
        let res = snap.docs.map(d => new Parse.ObjectClass(this.className, d.id, d.data()));
        if (cb && cb.success) cb.success(res);
      }).catch(e => {
        if (cb && cb.error) cb.error(e);
      });
    }
  }
};

Parse.ObjectClass = function(className, id, data) {
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

Parse.Object = {
  extend: function(className) {
    let constructor = function(id, data) {
      return new Parse.ObjectClass(className, id, data);
    };
    constructor.className = className;
    return constructor;
  }
};

Parse.UserClass = function(user, data) {
  Parse.ObjectClass.call(this, 'users', user ? user.uid : null, data);
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
      Parse.User._currentUser = this;
      if (cb && cb.success) cb.success(this);
    }).catch(e => {
      if (cb && cb.error) cb.error(this, e);
    });
  };
};

// Make Parse.User a constructor that returns a new UserClass
Parse.User = Object.assign(function() {
  return new Parse.UserClass();
}, Parse.User);
