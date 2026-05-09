const router = require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// POST /api/messages — save a new message
router.post('/', auth, async (req, res) => {
  const { conversationId, text, image } = req.body;
  try {
    const newMessage = new Message({
      conversationId,
      sender: req.user, // req.user is the userId set by auth middleware
      text,
      image,
    });

    const saved = await newMessage.save();

    // Populate sender so frontend gets username/profilePicture immediately
    const populated = await Message.findById(saved._id).populate('sender', 'username profilePicture');

    res.status(201).json(populated);
  } catch (err) {
    console.error("Message save error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages/:conversationId — fetch all messages in a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Message fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;