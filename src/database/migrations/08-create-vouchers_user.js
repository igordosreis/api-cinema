/* eslint-disable max-lines-per-function */
/* eslint-disable strict */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vouchers_user', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      voucher_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'establishments_products',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'orders',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expire_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sold_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      sold_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      underscored: true,
      timestamps: false,
      engine: 'InnoDB',
      charset: 'latin1',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vouchers_user');
  },
};

// Error: 
//     at Query.run (/cinema-backend/node_modules/sequelize/src/dialects/mysql/query.js:46:25)
//     at /cinema-backend/node_modules/sequelize/src/sequelize.js:650:28
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at MySQLQueryInterface.bulkInsert (/cinema-backend/node_modules/sequelize/src/dialects/abstract/query-interface.js:881:21)
//     at recursiveBulkCreate (/cinema-backend/node_modules/sequelize/src/model.js:2803:25)
//     at Function.bulkCreate (/cinema-backend/node_modules/sequelize/src/model.js:2929:12) {
//   name: 'SequelizeDatabaseError',
//   parent: Error: Lock wait timeout exceeded; try restarting transaction
//       at Packet.asError (/cinema-backend/node_modules/mysql2/lib/packets/packet.js:722:17)
//       at Query.execute (/cinema-backend/node_modules/mysql2/lib/commands/command.js:28:26)
//       at Connection.handlePacket (/cinema-backend/node_modules/mysql2/lib/connection.js:456:32)
//       at PacketParser.onPacket (/cinema-backend/node_modules/mysql2/lib/connection.js:85:12)
//       at PacketParser.executeStart (/cinema-backend/node_modules/mysql2/lib/packet_parser.js:75:16)
//       at Socket.<anonymous> (/cinema-backend/node_modules/mysql2/lib/connection.js:92:25)
//       at Socket.emit (node:events:526:28)
//       at addChunk (node:internal/streams/readable:315:12)
//       at readableAddChunk (node:internal/streams/readable:289:9)
//       at Socket.Readable.push (node:internal/streams/readable:228:10) {
//     code: 'ER_LOCK_WAIT_TIMEOUT',
//     errno: 1205,
//     sqlState: 'HY000',
//     sqlMessage: 'Lock wait timeout exceeded; try restarting transaction',
//     sql: "INSERT INTO `vouchers_user` (`id`,`voucher_code`,`product_id`,`order_id`,`active`,`expire_at`,`sold_at`,`sold_price`) VALUES (123,'SU56T4XB',48,1,true,'2024-03-03 17:12:57',NULL,'24.10'),(125,'M1STWW14',47,1,true,'2024-09-10 17:55:10',NULL,'49.84'),(167,'52EXWT1Y',49,1,true,'2024-10-13 19:17:11',NULL,'74.17'),(184,'5TV7WDIG',49,1,true,'2024-05-24 05:34:31',NULL,'74.17'),(185,'JRGCGYX4',47,1,true,'2024-08-05 09:00:28',NULL,'49.84'),(200,'LXE4KFI4',48,1,true,'2024-01-27 11:29:23',NULL,'24.10');",
//     parameters: undefined
//   },
//   original: Error: Lock wait timeout exceeded; try restarting transaction
//       at Packet.asError (/cinema-backend/node_modules/mysql2/lib/packets/packet.js:722:17)
//       at Query.execute (/cinema-backend/node_modules/mysql2/lib/commands/command.js:28:26)
//       at Connection.handlePacket (/cinema-backend/node_modules/mysql2/lib/connection.js:456:32)
//       at PacketParser.onPacket (/cinema-backend/node_modules/mysql2/lib/connection.js:85:12)
//       at PacketParser.executeStart (/cinema-backend/node_modules/mysql2/lib/packet_parser.js:75:16)
//       at Socket.<anonymous> (/cinema-backend/node_modules/mysql2/lib/connection.js:92:25)
//       at Socket.emit (node:events:526:28)
//       at addChunk (node:internal/streams/readable:315:12)
//       at readableAddChunk (node:internal/streams/readable:289:9)
//       at Socket.Readable.push (node:internal/streams/readable:228:10) {
//     code: 'ER_LOCK_WAIT_TIMEOUT',
//     errno: 1205,
//     sqlState: 'HY000',
//     sqlMessage: 'Lock wait timeout exceeded; try restarting transaction',
//     sql: "INSERT INTO `vouchers_user` (`id`,`voucher_code`,`product_id`,`order_id`,`active`,`expire_at`,`sold_at`,`sold_price`) VALUES (123,'SU56T4XB',48,1,true,'2024-03-03 17:12:57',NULL,'24.10'),(125,'M1STWW14',47,1,true,'2024-09-10 17:55:10',NULL,'49.84'),(167,'52EXWT1Y',49,1,true,'2024-10-13 19:17:11',NULL,'74.17'),(184,'5TV7WDIG',49,1,true,'2024-05-24 05:34:31',NULL,'74.17'),(185,'JRGCGYX4',47,1,true,'2024-08-05 09:00:28',NULL,'49.84'),(200,'LXE4KFI4',48,1,true,'2024-01-27 11:29:23',NULL,'24.10');",
//     parameters: undefined
//   },
//   sql: "INSERT INTO `vouchers_user` (`id`,`voucher_code`,`product_id`,`order_id`,`active`,`expire_at`,`sold_at`,`sold_price`) VALUES (123,'SU56T4XB',48,1,true,'2024-03-03 17:12:57',NULL,'24.10'),(125,'M1STWW14',47,1,true,'2024-09-10 17:55:10',NULL,'49.84'),(167,'52EXWT1Y',49,1,true,'2024-10-13 19:17:11',NULL,'74.17'),(184,'5TV7WDIG',49,1,true,'2024-05-24 05:34:31',NULL,'74.17'),(185,'JRGCGYX4',47,1,true,'2024-08-05 09:00:28',NULL,'49.84'),(200,'LXE4KFI4',48,1,true,'2024-01-27 11:29:23',NULL,'24.10');",
//   parameters: {}
// }
// Error:
//     at Function.<anonymous> (/cinema-backend/src/services/Admin.service.ts:59:13)
//     at Generator.throw (<anonymous>)
//     at rejected (/cinema-backend/src/services/Admin.service.ts:6:65)
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
// [ERROR] 20:11:50 Error