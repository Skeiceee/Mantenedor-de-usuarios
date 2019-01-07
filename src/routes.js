const bodyParser = require('body-parser');
const mysql = require('./dbconfig');
const email = require('email-validator')

function findUsuarios(connect){
  connect.query('select * from usuarios', (err, result) => {
    return result
  })
}

module.exports = function(path, app){
  const connect = mysql();

  app.use(bodyParser.urlencoded({ extended: true }));

  //GET
  app.get('/', function(req, res){
    res.render('index')
  })
  app.get('/agregar', function(req, res){
    res.render('agregar')
  })
  app.get('/eliminar', function(req, res){
    res.render('eliminar')
  })

  app.get('/mostrar', function(req,res){
    connect.query('select * from usuarios', (err, result) => {
      res.render('mostrar', {
        "usuarios": result
      })
    })
  })

  //POST
  app.post('/agregar', function(req, res){
    let usuario = req.body
    let errors = []
    console.log(errors.length)
    if(usuario.nombre === ""){
      errors.push('El campo nombre es obligatorio.')
    }
    if(usuario.apellidos === ""){
      errors.push('El campo apellidos es obligatorio.')
    }
    if(usuario.email === ""){
      errors.push('El campo correo electronico es obligatorio.')
    }else if(!email.validate(usuario.email)){
      errors.push('El correo electronico no es valido.')
    }
    if(usuario.password === ""){
      errors.push('El campo contraseña es obligatorio')
    }
    if(usuario.passwordConfirm === ""){
      errors.push('El campo confirmar contraseña es obligatorio')
    }
    if(usuario.password !== usuario.passwordConfirm){
      errors.push('Las contraseñas no coinciden')
    }
    if(errors.length === 0){
      let success = 'El usuario ' + usuario.nombre + ' ' + usuario.apellidos + ' ha sido creado exitosamente'
      connect.query('INSERT INTO usuarios SET ?', {nombre: usuario.nombre, apellidos: usuario.apellidos, email: usuario.email, password: usuario.password}, function (error, results, fields) {
        if (error) throw error
      })
      connect.query('select * from usuarios', (err, result) => {
        res.render('mostrar', {
          "usuarios": result,
          success: success
        })
      })
    }else{
      res.render('agregar', {
        "errors": errors
      })
    }

  })


}
