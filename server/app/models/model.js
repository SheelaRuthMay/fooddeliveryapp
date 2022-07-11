module.exports = (sequelize, Sequelize) => {
  
  // model for 'users' table
  const usersTable = sequelize.define(
    "users",
    {
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
      }
    },
    {
      createdAt: false, // if true adds additional column to db
      updatedAt: false, // if true adds additional column to db
      freezeTableName: true, // if false it takes plural name adding 's' at the end
    }
  );

  // model for 'menu_item' table
  const menuItemTable = sequelize.define(
    "menu_item",
    {
      menu_item_name: {
        type: Sequelize.STRING,
      },
      menu_item_type: {
        type: Sequelize.STRING,
      },
      cuisine: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      created_on: {
        type: Sequelize.DATE,
      }
    },
    {
      createdAt: false, // if true adds additional column to db
      updatedAt: false, // if true adds additional column to db
      freezeTableName: true, // if false it takes plural name adding 's' at the end
    }
  );

  // model for 'orders' table
  const ordersTable = sequelize.define(
    "orders",
    {
      user_id: {
        type: Sequelize.INTEGER,
      },
      order_date: {
        type: Sequelize.DATEONLY,
      },
      order_time: {
        type: Sequelize.STRING,
      }
    },
    {
      createdAt: false, // if true adds additional column to db
      updatedAt: false, // if true adds additional column to db
      freezeTableName: true, // if false it takes plural name adding 's' at the end
    }
  );

  // model for 'orders' table
  const ordersMenuItemTable = sequelize.define(
    "orders_menu_item",
    {
      order_id: {
        type: Sequelize.INTEGER,
      },
      menu_item_id: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
    },
    {
      createdAt: false, // if true adds additional column to db
      updatedAt: false, // if true adds additional column to db
      freezeTableName: true, // if false it takes plural name adding 's' at the end
    }
  );

  // model for 'availability' table
  const availabilityTable = sequelize.define(
    "availability",
    {
      name: {
        type: Sequelize.STRING,
      }
    },
    {
      createdAt: false, // if true adds additional column to db
      updatedAt: false, // if true adds additional column to db
      freezeTableName: true, // if false it takes plural name adding 's' at the end
    }
  );

  // model for 'menu_item_availability' table
  const menuItemAvailabilityTable = sequelize.define(
    "menu_item_availability",
    {
      menu_item_id: {
        type: Sequelize.INTEGER,
      },
      availability_id: {
        type: Sequelize.INTEGER,
      }
    },
    {
      createdAt: false, // if true adds additional column to db
      updatedAt: false, // if true adds additional column to db
      freezeTableName: true, // if false it takes plural name adding 's' at the end
    }
  );

 
  // Join table codes
  usersTable.hasMany(ordersTable, { foreignKey: 'user_id' })
  ordersTable.belongsTo(usersTable, { foreignKey: 'user_id' })

  ordersTable.hasMany(ordersMenuItemTable, { foreignKey: 'order_id' })
  ordersMenuItemTable.belongsTo(ordersTable, { foreignKey: 'order_id' })

  menuItemTable.hasMany(ordersMenuItemTable, { foreignKey: 'menu_item_id' })
  ordersMenuItemTable.belongsTo(menuItemTable, { foreignKey: 'menu_item_id' })

  menuItemTable.hasMany(menuItemAvailabilityTable, { foreignKey: 'menu_item_id' })
  menuItemAvailabilityTable.belongsTo(menuItemTable, { foreignKey: 'menu_item_id' })

  availabilityTable.hasMany(menuItemAvailabilityTable, { foreignKey: 'availability_id' })
  menuItemAvailabilityTable.belongsTo(availabilityTable, { foreignKey: 'availability_id' })

  

  // export
  const all = {
    usersTable: usersTable,
    ordersTable: ordersTable,
    menuItemTable: menuItemTable,
    ordersMenuItemTable: ordersMenuItemTable,
    availabilityTable: availabilityTable,
    menuItemAvailabilityTable: menuItemAvailabilityTable
  };

  return all;
};
