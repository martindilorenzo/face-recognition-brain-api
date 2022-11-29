const handleSignIn = (database, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  database.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return database.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('No se puede obtener el usuario'))
      } else {
        res.status(400).json('Credenciales incorrectas')
      }
    })
    .catch(err => res.status(400).json('Credenciales incorrectaS'))
}

module.exports = {
  handleSignIn
}