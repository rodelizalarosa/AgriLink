import { Request, Response } from 'express';
import { db } from '../database/database';

export const updateOnboardingStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { 
      phone, address, city, province, zip_code, latitude, longitude,
      farm_address, farm_city, farm_province, farm_zip_code,
      farm_latitude, farm_longitude, farm_address_same_as_home
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // 1️⃣ Update core user profile
    await db.execute(
      `UPDATE users_table 
       SET phone = ?, address = ?, city = ?, province = ?, zip_code = ?, 
           latitude = ?, longitude = ?, onboarding_completed = 1 
       WHERE id = ?`,
      [phone, address, city, province, zip_code, latitude, longitude, userId]
    );

    // 2️⃣ Determine is_same_as_home logic
    const isSameAsHome = farm_address_same_as_home !== false;
    const finalFarmAddress = isSameAsHome ? address : (farm_address || null);
    const finalFarmCity = isSameAsHome ? city : (farm_city || null);
    const finalFarmProvince = isSameAsHome ? province : (farm_province || null);
    const finalFarmZipCode = isSameAsHome ? zip_code : (farm_zip_code || null);
    const finalFarmLatitude = isSameAsHome ? latitude : (farm_latitude || null);
    const finalFarmLongitude = isSameAsHome ? longitude : (farm_longitude || null);

    // 3️⃣ Upsert farm details in farms_table
    await db.execute(
      `INSERT INTO farms_table (
         user_id, farm_address, farm_city, farm_province, 
         farm_zip_code, farm_latitude, farm_longitude, is_same_as_home
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         farm_address = VALUES(farm_address),
         farm_city = VALUES(farm_city),
         farm_province = VALUES(farm_province),
         farm_zip_code = VALUES(farm_zip_code),
         farm_latitude = VALUES(farm_latitude),
         farm_longitude = VALUES(farm_longitude),
         is_same_as_home = VALUES(is_same_as_home)`,
      [
        userId, finalFarmAddress, finalFarmCity, finalFarmProvince, 
        finalFarmZipCode, finalFarmLatitude, finalFarmLongitude, isSameAsHome ? 1 : 0
      ]
    );

    return res.status(200).json({ message: 'Normalized onboarding completed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating onboarding status in farms_table' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const [users]: any = await db.execute(
      `SELECT u.*, 
              f.farm_name, f.farm_address, f.farm_city, f.farm_province, 
              f.farm_zip_code, f.farm_latitude, f.farm_longitude, f.is_same_as_home as farm_address_same_as_home
       FROM users_table u
       LEFT JOIN farms_table f ON u.id = f.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found in normalized view' });
    }

    return res.status(200).json(users[0]);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching user profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      first_name, last_name, phone, address, city, province, zip_code,
      latitude, longitude,
      farm_address, farm_city, farm_province, farm_zip_code,
      farm_latitude, farm_longitude, farm_address_same_as_home
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Update core table
    await db.execute(
      `UPDATE users_table 
       SET first_name = ?, last_name = ?, phone = ?, 
           address = ?, city = ?, province = ?, zip_code = ?,
           latitude = ?, longitude = ?
       WHERE id = ?`,
      [
        first_name, last_name, phone,
        address, city, province, zip_code,
        latitude, longitude, userId
      ]
    );

    // Update farm detail in separate table
    const isSameAsHome = farm_address_same_as_home !== false;
    const finalFarmAddress = isSameAsHome ? address : (farm_address || null);
    const finalFarmCity = isSameAsHome ? city : (farm_city || null);
    const finalFarmProvince = isSameAsHome ? province : (farm_province || null);
    const finalFarmZipCode = isSameAsHome ? zip_code : (farm_zip_code || null);
    const finalFarmLatitude = isSameAsHome ? latitude : (farm_latitude || null);
    const finalFarmLongitude = isSameAsHome ? longitude : (farm_longitude || null);

    await db.execute(
      `INSERT INTO farms_table (
          user_id, farm_address, farm_city, farm_province, 
          farm_zip_code, farm_latitude, farm_longitude, is_same_as_home
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
          farm_address = VALUES(farm_address),
          farm_city = VALUES(farm_city),
          farm_province = VALUES(farm_province),
          farm_zip_code = VALUES(farm_zip_code),
          farm_latitude = VALUES(farm_latitude),
          farm_longitude = VALUES(farm_longitude),
          is_same_as_home = VALUES(is_same_as_home)`,
      [
        userId, finalFarmAddress, finalFarmCity, finalFarmProvince,
        finalFarmZipCode, finalFarmLatitude, finalFarmLongitude, isSameAsHome ? 1 : 0
      ]
    );

    return res.status(200).json({ message: 'Normalized profile updated successfully' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating normalized profile' });
  }
};

export const getAllFarmers = async (req: Request, res: Response) => {
  try {
    const [farmers]: any = await db.execute(
      `SELECT u.id, u.first_name, u.last_name, 
              u.address, u.city, u.province,
              u.latitude, u.longitude,
              u.phone,
              f.farm_address, f.farm_city, f.farm_province,
              f.farm_latitude, f.farm_longitude,
              f.is_same_as_home as farm_address_same_as_home
       FROM users_table u
       JOIN farms_table f ON u.id = f.user_id
       WHERE u.role = 'farmer'
         AND u.onboarding_completed = 1`
    );

    // Map to return the effective farm location
    const mapped = farmers.map((f: any) => {
      // Prioritize farm_latitude/longitude, fallback to home coords if not available or same_as_home
      const lat = f.farm_latitude || f.latitude;
      const lng = f.farm_longitude || f.longitude;

      return {
        id: f.id,
        name: `${f.first_name} ${f.last_name}`,
        farm_address: f.farm_address || f.address,
        farm_city: f.farm_city || f.city,
        farm_province: f.farm_province || f.province,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        phone: f.phone,
      };
    });

    return res.status(200).json(mapped);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching farmers' });
  }
};
