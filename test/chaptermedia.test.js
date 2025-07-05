const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.sendCommonValue = (status, message, data) => {
    res.status(status).json({
      status,
      message,
      data: data || null
    });
  };
  next();
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    error: err.message
  });
});

try {
  console.log('Loading chapter router...');
  const chapterRouter = require('../router/chapterRouter');
  app.use('/api/chapters', chapterRouter);
  console.log('✅ Chapter router loaded successfully');

  console.log('Loading media router...');
  const mediaRouter = require('../router/mediaRouter');
  app.use('/api/media', mediaRouter);
  console.log('✅ Media router loaded successfully');

} catch (error) {
  console.error('❌ Error loading routers:', error.message);
  console.log('Will continue with basic server...');
}

app.get('/', (req, res) => {
  res.json({
    message: 'Test server is running!',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /',
      'GET /test',
      'GET /api/chapters (if loaded)',
      'GET /api/media (if loaded)'
    ]
  });
});

app.get('/test', (req, res) => {
  res.json({
    status: 200,
    message: 'Test endpoint working!',
    data: { test: true }
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log('\n🚀 Test server started successfully!');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log('\n🧪 Test your endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/test`);
  console.log(`   GET  http://localhost:${PORT}/api/chapters`);
  console.log(`   GET  http://localhost:${PORT}/api/media`);
  console.log('\n💡 Press Ctrl+C to stop the server');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('❌ Server error:', err.message);
  }
});