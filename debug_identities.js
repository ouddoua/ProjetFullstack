const mongoose = require('mongoose');
const User = require('./models/User');
const Restau = require('./models/Restau');
const Reservation = require('./models/Reservation');

const uri = "mongodb://aya_ouddou:52406785@193.48.125.44:27017/aya_ouddou";

mongoose.connect(uri, { family: 4 })
    .then(async () => {
        const users = await User.find({}, 'nom email _id');
        console.log('USERS:', users.map(u => `${u.nom}(${u.email})=${u._id}`));

        const restaus = await Restau.find({}, 'nom owner _id');
        console.log('RESTS:', restaus.map(r => `${r.nom}(Owner:${r.owner})=${r._id}`));

        const resas = await Reservation.find({}, 'user restau _id');
        console.log('RESAS:', resas.map(r => `User:${r.user}->Restau:${r.restau}`));

        mongoose.disconnect();
    })
    .catch(err => { console.error(err); process.exit(1); });
