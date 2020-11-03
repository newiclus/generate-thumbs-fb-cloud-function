const firebase = require('firebase-admin')
const functions = require('firebase-functions')
const { services, core, env } = require('@aeyrium/lib')
firebase.initializeApp()
env.setup(firebase)


const onUploadMedia = require('./onUploadMedia');

require('dotenv').config()


exports.uploadmedia = functions.https.onCall(onUploadMedia.onUploadMedia);
