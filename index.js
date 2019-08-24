const send = (res, status, data) => (res.statusCode = status, res.end(data));

const authenticate = mongoose => {
  const { Team } = require('mm-schemas')(mongoose)
  return fn => async (req, res) => {
    const header = req.headers.authorization
    if(!header) {
      return send(res, 401, 'Unauthorized')
    }
    const [type, token] = header.split(' ')
    switch(type) {
      case 'Bearer':
        const team = await Team.findOne({token}).exec()
        if(!team) {
          return send(res, 401, 'Unauthorized')
        }
        req.user = team
        return await fn(req, res)
      default:
        return send(res, 401, 'Unauthorized')
    }
  }
}

module.exports = authenticate