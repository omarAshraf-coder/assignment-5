const express = require('express');
const { sequelize } = require('./models');

const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});