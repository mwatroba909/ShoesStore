
// const WebSocket = require('ws');
// const { v4: uuidv4 } = require('uuid');
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('votes.db');
// const url = require('url');

// // Inicjalizacja bazy danych
// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS votes (
//       shoe_id TEXT PRIMARY KEY,
//       count INTEGER DEFAULT 0,
//       users TEXT DEFAULT '[]'
//     )
//   `);

//   db.run(`
//     CREATE TABLE IF NOT EXISTS comments (
//       id TEXT PRIMARY KEY,
//       shoe_id TEXT,
//       user TEXT,
//       text TEXT,
//       date TEXT
//     )
//   `);
// });

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', (ws, req) => {
//   const query = url.parse(req.url, true).query;
//   let userId = query.userId || uuidv4();

//   // Wysłanie stanu początkowego
//   db.all('SELECT * FROM votes', (err, rows) => {
//     const votes = {};
//     rows.forEach(row => {
//       votes[row.shoe_id] = {
//         count: row.count,
//         users: JSON.parse(row.users)
//       };
//     });
//     ws.send(JSON.stringify({ type: 'INIT', userId, votes }));
//   });

//   db.all('SELECT * FROM comments', (err, rows) => {
//     ws.send(JSON.stringify({ type: 'COMMENTS_INIT', comments: rows }));
//   });

//   ws.on('message', (message) => {
//     const data = JSON.parse(message);
    
//     if (data.type === 'VOTE') {
//       const shoeId = data.shoeId;
      
//       db.serialize(() => {
//         db.get(
//           'SELECT users FROM votes WHERE shoe_id = ?',
//           [shoeId],
//           (err, row) => {
//             let users = row ? JSON.parse(row.users) : [];
//             if (!users.includes(userId)) {
//               users.push(userId);
//               const count = users.length;
              
//               db.run(
//                 'INSERT OR REPLACE INTO votes (shoe_id, count, users) VALUES (?, ?, ?)',
//                 [shoeId, count, JSON.stringify(users)]
//               );
              
//               wss.clients.forEach(client => {
//                 if (client.readyState === WebSocket.OPEN) {
//                   client.send(JSON.stringify({ type: 'UPDATE', shoeId, count, users }));
//                 }
//               });
//             }
//           }
//         );
//       });
//     }

//     if (data.type === 'COMMENT') {
//       const commentId = uuidv4();
//       const { shoeId, user, text, date } = data;
      
//       db.run(
//         'INSERT INTO comments (id, shoe_id, user, text, date) VALUES (?, ?, ?, ?, ?)',
//         [commentId, shoeId, user, text, date],
//         () => {
//           const newComment = { id: commentId, shoeId, user, text, date };
//           wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//               client.send(JSON.stringify({ type: 'NEW_COMMENT', comment: newComment }));
//             }
//           });
//         }
//       );
//     }
//   });
// });

// console.log('Server running on ws://localhost:8080');

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('votes.db');
const url = require('url');

// Inicjalizacja bazy danych
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      shoe_id TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0,
      users TEXT DEFAULT '[]'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      shoe_id TEXT,
      user TEXT,
      text TEXT,
      date TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      user TEXT,
      text TEXT,
      date TEXT
    )
  `);
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  const query = url.parse(req.url, true).query;
  let userId = query.userId || uuidv4();

  // Wysłanie stanu początkowego
  db.all('SELECT * FROM votes', (err, rows) => {
    const votes = {};
    rows.forEach(row => {
      votes[row.shoe_id] = {
        count: row.count,
        users: JSON.parse(row.users)
      };
    });
    ws.send(JSON.stringify({ type: 'INIT', userId, votes }));
  });

  db.all('SELECT * FROM comments', (err, rows) => {
    ws.send(JSON.stringify({ type: 'COMMENTS_INIT', comments: rows }));
  });

  db.all('SELECT * FROM chat_messages', (err, rows) => {
    ws.send(JSON.stringify({ type: 'CHAT_INIT', messages: rows }));
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'VOTE') {
      const shoeId = data.shoeId;
      
      db.serialize(() => {
        db.get(
          'SELECT users FROM votes WHERE shoe_id = ?',
          [shoeId],
          (err, row) => {
            let users = row ? JSON.parse(row.users) : [];
            if (!users.includes(userId)) {
              users.push(userId);
              const count = users.length;
              
              db.run(
                'INSERT OR REPLACE INTO votes (shoe_id, count, users) VALUES (?, ?, ?)',
                [shoeId, count, JSON.stringify(users)]
              );
              
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({ type: 'UPDATE', shoeId, count, users }));
                }
              });
            }
          }
        );
      });
    }

    if (data.type === 'COMMENT') {
      const commentId = uuidv4();
      const { shoeId, user, text, date } = data;
      
      db.run(
        'INSERT INTO comments (id, shoe_id, user, text, date) VALUES (?, ?, ?, ?, ?)',
        [commentId, shoeId, user, text, date],
        () => {
          const newComment = { id: commentId, shoeId, user, text, date };
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'NEW_COMMENT', comment: newComment }));
            }
          });
        }
      );
    }

    if (data.type === 'MESSAGE') {
      const messageId = uuidv4();
      const { user, text } = data;
      const date = new Date().toISOString();
      
      db.run(
        'INSERT INTO chat_messages (id, user, text, date) VALUES (?, ?, ?, ?)',
        [messageId, user, text, date],
        () => {
          const newMessage = { id: messageId, user, text, date };
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'NEW_MESSAGE', ...newMessage }));
            }
          });
        }
      );
    }
  });
});

console.log('Server running on ws://localhost:8080');
