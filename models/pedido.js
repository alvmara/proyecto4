"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.pelicula, {
        foreignKey: "peliculaId",
      });
      this.belongsTo(models.usuario, {
        foreignKey: "usuarioId",
      });
    }
  }
  pedido.init(
    {
      peliculasid: DataTypes.STRING,
      usuarioid: DataTypes.STRING,
      fecha: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "pedido",
    }
  );
  return pedido;
};
