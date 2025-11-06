import mongoose from 'mongoose';

     const logSchema = new mongoose.Schema({
       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       action: String,
       details: String,
       createdAt: { type: Date, default: Date.now },
     });

     const Log = mongoose.model('Log', logSchema);
     export default Log;