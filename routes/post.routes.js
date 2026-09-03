const express = require('express');
const router = express.Router();
const { Post, User, Comment, sequelize } = require('../models');

router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json({ message: "post created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }
    await post.destroy();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/details', async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title'],
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Comment, attributes: ['id', 'content'] }
      ]
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/comment-count', async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        'id',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount']
      ],
      include: [{ model: Comment, attributes: [] }],
      group: ['Post.id']
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;