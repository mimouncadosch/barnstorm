var ids = {
	facebook: {
		clientID: '275906602563835',
		clientSecret: '53c41a965a55a0cd6af662ad94f5e193',
		callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
	},
	twitter: {
		consumerKey: 'yxDatKN48oYTeKqOft5ciA',
		consumerSecret: '9xwrzRwL2D53iXTxNQ8hSQ95TydiJo2n5dGzkBHYXBI',
		callbackURL: "http://mysterious-reaches-6748.herokuapp.com/auth/twitter/callback"
	},
	github: {
		clientID: 'get_your_own',
		clientSecret: 'get_your_own',
		callbackURL: "http://127.0.0.1:1337/auth/github/callback"
	},
	google: {
		returnURL: 'http://127.0.0.1:1337/auth/google/callback',
		realm: 'http://127.0.0.1:1337'
	}
}

module.exports = ids;