const express = require('express');
const { User, Post, Comment } = require('./models');
const { Op } = require('sequelize');

const router = express.Router();

// 1. Get posts that have more than a specific number of comments (e.g., 2 comments)
router.get('/posts-popular', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: Comment,
        required: true
      }],
      group: ['Post.id'],
      having: require('sequelize').where(
        require('sequelize').fn('COUNT', require('sequelize').col('Comments.id')),
        '>',
        1
      )
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Advanced search for posts by title/content and filter by user
router.get('/search-posts', async (req, res) => {
  try {
    const { keyword, userId } = req.query;
    const whereClause = {};
    
    if (keyword) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    if (userId) {
      whereClause.userId = userId;
    }

    const posts = await Post.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['id', 'name'] }]
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;