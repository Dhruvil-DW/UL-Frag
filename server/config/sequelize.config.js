const seqFindByPk = (Model, id, attrArr, includeData) => {
  return new Promise((resolve, reject) => {
    Model.findByPk(id, { attributes: attrArr, include: includeData })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500);
      });
  });
}

const seqFindOne = (Model, attrArr, whereCond, includeData) => {
  return new Promise((resolve, reject) => {
    Model.findOne({ attributes: attrArr, where: whereCond, include: includeData })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500)
      });
  });
}

const seqFindAndCountAll = (Model, attrArr, whereCond, includeData, orderData, limit, offset, groupBy) => {
  return new Promise((resolve, reject) => {
    Model.findAndCountAll({ attributes: attrArr, include: includeData, where: whereCond, order: orderData || [['id', 'DESC']], limit: limit, offset: offset, group: groupBy })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500);
      });
  });
}

const seqFindAll = (Model, attrArr, whereCond, includeData, orderData, limit, offset, groupBy) => {
  return new Promise((resolve, reject) => {
    Model.findAll({ attributes: attrArr, where: whereCond, include: includeData, order: orderData, limit: limit, offset: offset, group: groupBy })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500);
      });
  });
}

const seqCreate = (Model, storeData) => {
  return new Promise((resolve, reject) => {
    Model.create(storeData)
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500)
      });
  });
}

const seqBulkCreate = (Model, storeData, extra) => {
  return new Promise((resolve, reject) => {
    Model.bulkCreate(storeData, extra)
      .then(() => {
        resolve(200);
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500);
      });
  });
}

const seqUpdate = (Model, data, whereCond) => {
  return new Promise((resolve, reject) => {
    Model.update(data, { where: whereCond })
      .then(num => {
        num != 0 ? resolve(200) : resolve(400);
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500);
      });
  });
}

const seqDestroy = (Model, whereCond) => {
  return new Promise((resolve, reject) => {
    Model.destroy({ where: whereCond })
      .then(num => {
        num != 0 ? resolve(200) : resolve(400);
      })
      .catch(err => {
        console.log("ERROR: ", err?.original?.sqlMessage ?? "Unknown");
        resolve(500);
      });
  });
}

const seqCount = (Model, whereCond, includeData, groupBy, ) => {
  return Model.count({ where: whereCond, include: includeData, group: groupBy });
}

module.exports = {
  seqFindByPk, seqFindOne, seqFindAndCountAll, seqFindAll, seqCreate, seqBulkCreate, seqUpdate, seqDestroy, seqCount
}