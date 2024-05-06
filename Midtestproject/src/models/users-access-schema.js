const usersAccessSchema = {
  email: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  firstAttempt: { type: Date, default: Date.now },
};

module.exports = usersAccessSchema;
