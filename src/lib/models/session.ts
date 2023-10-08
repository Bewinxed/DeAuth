
import mongodb from 'mongoose';
const Session = 
	new mongodb.Schema(
		{
			_id: {
				type: String,
				required: true
			},
			user_id: {
				type: String,
				required: true
			},
			active_expires: {
				type: Number,
				required: true
			},
			idle_expires: {
				type: Number,
				required: true
			},
			access_token: {
				type: String,
				required: true
			},
			refreshToken: {
				type: String,
				required: true
			},
			accessTokenExpiresIn: {
				type: Number,
				required: true
			}
		} as const,
		{ _id: false }
	)

export default mongodb.models.Session || mongodb.model('Session', Session);
