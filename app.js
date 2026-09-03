app.delete('/users/:id', async (req, res) => {
    try {
        const { User } = require('./models');
        const deleted = await User.destroy({ where: { id: req.params.id } });
        if (deleted === 0) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});