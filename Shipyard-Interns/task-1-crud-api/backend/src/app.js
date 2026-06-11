const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/projects', projectRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
  });
}

module.exports = app;
