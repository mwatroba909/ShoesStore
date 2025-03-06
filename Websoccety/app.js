const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Store likes for each photo
const photos = {
    1: 15,
    2: 23,
    3: 9,
    4: 32,
    5: 19,
    6: 27
};

// Handle connections
wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'like' && data.photoId) {
                // Increment the like count for this photo
                const photoId = data.photoId;
                photos[photoId] = (photos[photoId] || 0) + 1;
                
                // Broadcast the updated like count to all connected clients
                const response = {
                    type: 'like',
                    photoId: photoId,
                    likes: photos[photoId]
                };
                
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(response));
                    }
                });
                
                console.log(`Photo ${photoId} liked. New count: ${photos[photoId]}`);
            }
        } catch (err) {
            console.error('Error handling message', err);
        }
    });
    
    ws.on('close', function() {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on port 8080');