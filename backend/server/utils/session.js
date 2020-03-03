const Session = require('../models/session');

createSession = async (store, session) => {
	try {
		const existingSession = await Session.find({ store: store._id });
		if (existingSession.length > 0) {
			return false;
			/* Do stuff */
		} else {
			const newSession = new Session({
				store: store._id,
				session: session
			});
			await newSession.save();
			return true;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
};

destroySession = async (session) => {
	try {
		const deletedSession = await Session.remove({ session: session });
	} catch (err) {
		console.log(err);
	}
};

module.exports = { createSession, destroySession };
