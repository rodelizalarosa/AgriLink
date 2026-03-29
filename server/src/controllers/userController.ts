import { Request, Response } from 'express';
import { db } from '../database/database';

export const updateOnboardingStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { phone, address, city, province, zip_code, latitude, longitude } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await db.execute(
      `UPDATE users_table 
       SET phone = ?, address = ?, city = ?, province = ?, zip_code = ?, latitude = ?, longitude = ?, onboarding_completed = 1 
       WHERE id = ?`,
      [phone, address, city, province, zip_code, latitude, longitude, userId]
    );

    return res.status(200).json({ message: 'Onboarding completed successfully' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating onboarding status' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const [users]: any = await db.execute(
      'SELECT * FROM users_table WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(users[0]);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching user profile' });
  }
};
