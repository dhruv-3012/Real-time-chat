const router = require('express').Router();
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { receiverId } = req.body;
  try {
    let conversation = await Conversation.findOne({
      members: { $all: [req.user, receiverId] }
    }).populate('members', '-password');
    
    if (!conversation) {
      conversation = new Conversation({ members: [req.user, receiverId] });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id).populate('members', '-password');
    }
    res.json(conversation);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get user's conversations
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user] }
    }).populate('members', '-password').sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;