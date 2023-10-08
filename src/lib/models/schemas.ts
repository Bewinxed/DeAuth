// IMPORTANT
// Be sure to register new schemas in src/models
import mongoose from 'mongoose';

const { Schema } = mongoose;

export const AuthRequest = new Schema(
	{
		public_key: {
			type: String,
			required: true
		},
		uuid: {
			type: String,
			required: true
		},
		uri: {
			type: String,
			required: true
		},
		state: {
			type: String,
			required: false
		},
		nonce: {
			type: String,
			required: true
		},
		signature: {
			type: String,
			required: false
		},
		accessToken: {
			type: String,
			required: false
		},
		refreshToken: {
			type: String,
			required: false
		},
		accessTokenExpiresIn: {
			type: Number,
			required: false
		}
	},
	{ timestamps: true }
);