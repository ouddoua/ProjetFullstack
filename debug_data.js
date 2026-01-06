const mongoose = require('mongoose');
const User = require('./models/User');
const Restau = require('./models/Restau');
const Reservation = require('./models/Reservation');

// Manually connect to avoid env var issues if needed, or use string directly
const uri = "mongodb://aya_ouddou:52406785@193.48.125.44:27017/aya_ouddou";

mongoose.connect(uri, { family: 4 })
    .then(async () => {
        const reservations = await Reservation.find();
        console.log('RESERVATIONS:', JSON.stringify(reservations.map(r => ({ id: r._id, user: r.user, restau: r.restau, date: r.dateTime })), null, 2));

        const restaus = await Restau.find();
        console.log('RESTAU_OWNERS:', JSON.stringify(restaus.map(r => ({ id: r._id, nom: r.nom, owner: r.owner })), null, 2));

        const users = await User.find();
        console.log('USERS:', JSON.stringify(users.map(u => ({ id: u._id, email: u.email, role: u.role })), null, 2));

        mongoose.disconnect();
    })
    .catch(err => { console.error(err); process.exit(1); });
