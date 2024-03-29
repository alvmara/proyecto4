const { Usuario } = require("../models/index");
const bcrypt = require("bcrypt");
const authConfig = require("../config/auth");
const jwt = require("jsonwebtoken");

const UsuarioController = {};

//Funciones del controlador

UsuarioController.traeUsuarios = (req, res) => {
  //Búsqueda trayendo a todos los usuarios
  Usuario.findAll().then((data) => {
    res.send(data);
  });
};

UsuarioController.traerUsuarioId = (req, res) => {
  //Búsqueda buscando una Id
  Usuario.findByPk(req.params.id).then((data) => {
    res.send(data);
  });
};

UsuarioController.traerUsuarioEmail = (req, res) => {
  //Búsqueda comparando un campo
  Usuario.findOne({ where: { email: req.params.email } }).then((data) => {
    res.send(data);
  });
};

UsuarioController.registraUsuario = async (req, res) => {
  //Registrando un usuario

  try {
    let name = req.body.name;
    let age = req.body.age;
    let surname = req.body.surname;
    let nickname = req.body.nickname;
    let email = req.body.email;
    console.log("antes de encriptar", req.body.password);
    let password = bcrypt.hashSync(
      req.body.password,
      Number.parseInt(authConfig.rounds)
    );

    console.log("este es el password", password);
    //Comprobación de errores.....

    //Guardamos en sequelize el usuario

    Usuario.create({
      name: name,
      age: age,
      surname: surname,
      email: email,
      password: password,
      nickname: nickname,
    }).then((usuario) => {
      res.send(`${usuario.name}, bienvenida a este infierno`);
    });
  } catch (error) {
    res.send(error);
  }
};

UsuarioController.updateProfile = async (req, res) => {
  let datos = req.body;

  let id = req.params.id;

  try {
    Usuario.update(datos, {
      where: { id: id },
    }).then((actualizado) => {
      res.send(actualizado);
    });
  } catch (error) {}
};

UsuarioController.deleteAll = async (req, res) => {
  try {
    Usuario.destroy({
      where: {},
      truncate: false,
    }).then((usuariosEliminados) => {
      res.send(`Se han eliminado ${usuariosEliminados} usuarios`);
    });
  } catch (error) {
    res.send(error);
  }
};

UsuarioController.deleteById = async (req, res) => {
  let id = req.params.id;

  try {
    Usuario.destroy({
      where: { id: id },
      truncate: false,
    }).then((usuarioEliminado) => {
      console.log(usuarioEliminado);
      res.send(`El usuario con la id ${id} ha sido eliminado`);
    });
  } catch (error) {
    res.send(error);
  }
};

UsuarioController.logUsuario = (req, res) => {
  let correo = req.body.email;
  let password = req.body.password;

  Usuario.findOne({
    where: { email: correo },
  })
    .then((Usuario) => {
      if (!Usuario) {
        res.send("Usuario o contraseña inválido");
      } else {
        //el usuario existe, por lo tanto, vamos a comprobar
        //si el password es correcto

        if (bcrypt.compareSync(password, Usuario.password)) {
          //COMPARA CONTRASEÑA INTRODUCIDA CON CONTRASEÑA GUARDADA, TRAS DESENCRIPTAR

          console.log(Usuario.password);

          let token = jwt.sign({ usuario: Usuario }, authConfig.secret, {
            expiresIn: authConfig.expires,
          });

          res.json({
            usuario: Usuario,
            token: token,
          });
        } else {
          res.status(401).json({ msg: "Usuario o contraseña inválidos" });
        }
      }
    })
    .catch((error) => {
      res.send(error);
    });
};

module.exports = UsuarioController;
