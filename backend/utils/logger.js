const Activity = require('../models/Activity');

const logActivity = async (data) => {
  try {
    const activity = new Activity(data);
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Activity logging error:', error);
  }
};

module.exports = { logActivity };