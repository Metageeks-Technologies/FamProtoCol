import mongoose from "mongoose";

const AuthStateSchema = new mongoose.Schema({
    codeVerifier: String,
    state: String,
});

export default mongoose.model('AuthState', AuthStateSchema);