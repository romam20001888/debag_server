const { Sequelize,DataTypes } = require('sequelize');

var sequelize = new Sequelize("deb", "root","Q02021999q", {
    host: "localhost",
    dialect: 'mysql'
});
const Progect = sequelize.define('Progect', {
    "ID": {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    "NAME": {
      type: DataTypes.STRING,
      allowNull: false,
    },
    "CONTACT_PHONE": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "CONTACT_EMAIL": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "INN": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "KPP": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "BIK": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "COMPANY_ADRESS": {
      type: DataTypes.STRING,
      allowNull: true,
    },
});
const ProgectSite = sequelize.define('ProgectSite', {
    "ID": {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    "NAME": {
      type: DataTypes.STRING,
      allowNull: false,
    },
    "PROGECT_ID": {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    "URL": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "ADMIN_LOGIN": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "ADMIN_PASSWORD": {
      type: DataTypes.STRING,
      allowNull: true,
    },
});
const SiteMap = sequelize.define('SiteMap', {
    "ID": {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    "NAME": {
      type: DataTypes.STRING,
      allowNull: false,
    },
    "DESCRIPTION": {
      type: DataTypes.STRING,
      allowNull: true,
    },
    "SITE_ID": {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    "URL": {
      type: DataTypes.STRING,
      allowNull: true,
    },
});
const MapFileUpdate = sequelize.define('MapFileUpdate', {
    "ID": {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    "DESCRIPTION": {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    "FILE_ID": {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    "ROW_ID": {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    "OLD_CODE": {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    "NEW_CODE": {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
});
const ErrolList = sequelize.define('ErrolList', {
    "ID": {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    "NAME": {
      type: DataTypes.STRING,
      allowNull: false,
    },
    "DESCRIPTION_ERROR": {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    "DESCRIPTION": {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
});
Progect.hasMany(ProgectSite, { as: 'SITES',foreignKey: 'PROGECT_ID' });
ProgectSite.hasMany(SiteMap, { as: 'MAP',foreignKey: 'SITE_ID' });
SiteMap.hasMany(MapFileUpdate, { as: 'ROW_UPDATE',foreignKey: 'FILE_ID' });

// ErrolList.sync({force:true});
// (async () => {
//     await sequelize.sync({force:true});
//     await Progect.create({
//         "NAME":"MyRezerv",
//     });
//     await ProgectSite.create({
//         "NAME":"myrezerv.com",
//         "URL":"https://myrezerv.com/",
//         "PROGECT_ID":1,
//         "ADMIN_LOGIN":"admin",
//         "ADMIN_PASSWORD":"ENLFr3zMla",
//     });
//     await ProgectSite.create({
//         "NAME":"Шина-резина.рф",
//         "URL":"https://xn----7sbbtkce9af0a7f.xn--p1ai/",
//         "PROGECT_ID":1,
//         "ADMIN_LOGIN":"rostimport5@gmail.com",
//         "ADMIN_PASSWORD":"bWai3wtRLK",
//     });
//     await SiteMap.create({
//         "NAME":"Главный файл",
//         "DESCRIPTION":"индексная страница",
//         "SITE_ID":1,
//         "URL":"/",
//     });
//     await SiteMap.create({
//         "NAME":"Главный файл1",
//         "DESCRIPTION":"индексная страница1",
//         "SITE_ID":1,
//         "URL":"/",
//     });
//     await MapFileUpdate.create({
//         "DESCRIPTION":"ED",
//         "FILE_ID":1,
//         "ROW_ID":1235423,
//         "OLD_CODE":"/SD",
//         "NEW_CODE":"/SD2",
//     });
// })();
module.exports.Progect = Progect
module.exports.ProgectSite = ProgectSite
module.exports.SiteMap = SiteMap
module.exports.MapFileUpdate = MapFileUpdate
module.exports.ErrolList = ErrolList


