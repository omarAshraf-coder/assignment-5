const express = require('express');
const router = express.Router();
const { Comment, User, Post } = require('../models');
const { Op } = require('sequelize');

router.post('/', async (req, res) => {
  try {
    const { comments } = req.body;
    await Comment.bulkCreate(comments);
    res.status(201).json({ message: "comments created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found." });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this comment" });
    }
    await comment.update({ content });
    res.status(200).json({ message: "Comment updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/find-or-create', async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content }
    });
    res.status(200).json({ comment, created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { word } = req.query;
    const { count, rows: comments } = await Comment.findAndCountAll({
      where: {
        content: { [Op.like]: `%${word}%` }
      }
    });
    if (count === 0) {
      return res.status(404).json({ message: "no comments found." });
    }
    res.status(200).json({ count, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/newest/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']],
      limit: 3
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id, {
      attributes: ['id', 'content'],
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Post, attributes: ['id', 'title', 'content'] }
      ]
    });
    if (!comment) {
      return res.status(404).json({ message: "no comment found." });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;