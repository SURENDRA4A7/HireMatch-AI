const pool = require("../config/db");

const createProfile = async (req, res) => {
  try {
    const {
      phone,
      location,
      bio,
      skills,
      experience,
    } = req.body;

    const userId = req.user.id;

    const [existingProfile] = await pool.query(
      "SELECT id FROM profiles WHERE user_id = ?",
      [userId]
    );

    if (existingProfile.length > 0) {
      return res.status(409).json({
        message: "Profile already exists",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO profiles
       (user_id, phone, location, bio, skills, experience)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        phone || null,
        location || null,
        bio || null,
        skills || null,
        experience || 0,
      ]
    );

    return res.status(201).json({
      message: "Profile created successfully",
      profileId: result.insertId,
    });
  } catch (error) {
    console.error("Create profile error:", error);

    return res.status(500).json({
      message: "Failed to create profile",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [profiles] = await pool.query(
      `SELECT
        p.id,
        p.user_id,
        p.phone,
        p.location,
        p.bio,
        p.skills,
        p.experience,
        p.created_at,
        u.name,
        u.email,
        u.role
       FROM profiles p
       INNER JOIN users u ON p.user_id = u.id
       WHERE p.user_id = ?`,
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile: profiles[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      phone,
      location,
      bio,
      skills,
      experience,
    } = req.body;

    const userId = req.user.id;

    const [existingProfile] = await pool.query(
      "SELECT id FROM profiles WHERE user_id = ?",
      [userId]
    );

    if (existingProfile.length === 0) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    await pool.query(
      `UPDATE profiles
       SET phone = ?,
           location = ?,
           bio = ?,
           skills = ?,
           experience = ?
       WHERE user_id = ?`,
      [
        phone || null,
        location || null,
        bio || null,
        skills || null,
        experience || 0,
        userId,
      ]
    );

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};