import { mongoose } from '@lucia-auth/adapter-mongoose';
import mongodb from 'mongoose';
const User = 
	new mongodb.Schema(
		{
			_id: {
				type: String,
				required: true
			},
			username: {
				type: String,
				required: false
			},
			// memberId: {
			// 	type: String,
			// 	required: true
			// },
			// discriminator: {
			// 	type: String,
			// 	required: true
			// },
			avatar: {
				type: String,
				required: false
			},
			public_key: {
				type: String,
				required: true
			}
		} as const,
		{ _id: false }
	)

export default mongodb.models.User || mongodb.model('User', User);
