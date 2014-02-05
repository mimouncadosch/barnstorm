var ids = {
	facebook: {
		clientID: 'get_your_own',
		clientSecret: 'get_your_own',
		callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
	},
	twitter: {
		consumerKey: 'yxDatKN48oYTeKqOft5ciA',
		consumerSecret: '9xwrzRwL2D53iXTxNQ8hSQ95TydiJo2n5dGzkBHYXBI',
		callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
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

module.exports = ids