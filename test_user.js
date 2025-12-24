const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
    try {
        await mongoose.connect("mongodb://aya_ouddou:52406785@193.48.125.44:27017/aya_ouddou?authSource=aya_ouddou", { serverSelectionTimeoutMS: 5000 });
        console.log("MongoDB connecté ✅");

        const u = new User({ name: "Test", email: "test@mail.com", password: "123456" });
        await u.save();
        console.log("Utilisateur créé ✅");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
