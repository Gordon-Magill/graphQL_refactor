const jwt = require('jsonwebtoken');
// require('dotenv').config();

// Don't store your secrets in some garbage js! Use environment variables!
const secret = 'mysecretsshhhhh';
// const secret = process.env.project_secret


const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({req, res}){
    console.log('authMiddleware started')
    // allows token to be sent via  req.query or headers (NEW: or with token in the body, even if nonstand it's good to have)
    let token = req.query.token || req.headers.authorization || req.body.token;

    console.log('Auth token:', token)
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      // return res.status(400).json({ message: 'You have no token!' });
      // return res.status(400)
      console.log('Auth middleware returning request w/o token')

      return req
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Auth middleware added token!')
    } catch {
      console.log('Invalid token');
      // return res.status(400).json({ message: 'invalid token!' });
    }

    // OLD: next() would be relevant if this were being used in Express, but this is 
    // send to next endpoint
    // next();

    // Return the modified request (now with data extracted from the verification of the token)
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
