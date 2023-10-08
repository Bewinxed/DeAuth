import mongoose, { type ConnectOptions } from 'mongoose';

import { env } from '$env/dynamic/private';
import { MONGODB_URI } from '$env/static/private';

export const connectMongo = async () => {
	// Connect with existing connection.
	if (Number(mongoose?.connection?.readyState) === 1) {
		return mongoose.connection;
	}

	const connection = mongoose.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	} as ConnectOptions);

	return connection;
};
