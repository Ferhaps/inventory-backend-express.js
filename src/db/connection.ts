import mongoose from 'mongoose';
import { setServers } from 'dns';

// Use public DNS to avoid router-level DNS-over-TCP blocks for SRV lookups
setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = () => {
	const MONGO_URL = process.env.CONNECTION_STRING;
	mongoose.Promise = Promise;

	mongoose
		.connect(MONGO_URL || '')
		.then(() => console.log('Connected to DB'))
		.catch((error) => console.error('DB connection error:', error));

	mongoose.connection.on('error', (error: Error) => {
		console.error('DB error', error);
	});
};
