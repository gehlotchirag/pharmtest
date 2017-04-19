'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Doctor Schema
 */
var DoctorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Doctor name',
		trim: true
	},
  email: {
    type: String,
    default: '',
    required: 'Please fill Doctor email',
    trim: true
  },
  profilePic: {
    type: String,
    default: 'https://cdn0.iconfinder.com/data/icons/customicondesign-office6-shadow/256/doctor.png'
  },
  homeVisit: {
    type: Boolean,
    default: false
  },
  location: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  qualification: [],
  speciality: {
    type: String,
    default: '',
    required: 'Please fill speciality',
    trim: true
  },
  timeZone: {
    type: String,
    default: '',
    required: 'Please fill description'
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill description'
  },
  created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Doctor', DoctorSchema);
