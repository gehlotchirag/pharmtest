'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pharmacy Schema
 */
var PharmacySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pharmacy name',
		trim: true
	},
    profilePic: {
        type: String,
        default: 'http://download.seaicons.com/icons/custom-icon-design/flatastic-11/512/Shop-icon.png'
    },
    address: {
        type: String,
        default: 'Mumbai, Maharashtra. India'
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

mongoose.model('Pharmacy', PharmacySchema);
