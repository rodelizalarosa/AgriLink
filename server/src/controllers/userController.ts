import { Request, Response } from 'express';
import { db } from '../database/database';

const tableColumnsCache = new Map<string, Set<string>>();

const getTableColumns = async (tableName: string): Promise<Set<string>> => {
  const cached = tableColumnsCache.get(tableName);
  if (cached) return cached;

  try {
    const [rows]: any = await db.execute(`SHOW COLUMNS FROM ${tableName}`);
    const cols = new Set<string>((rows || []).map((row: any) => String(row.Field)));
    tableColumnsCache.set(tableName, cols);
    return cols;
  } catch {
    const empty = new Set<string>();
    tableColumnsCache.set(tableName, empty);
    return empty;
  }
};

const hasColumn = async (tableName: string, columnName: string): Promise<boolean> => {
  const cols = await getTableColumns(tableName);
  return cols.has(columnName);
};

const normalizeBoolean = (value: unknown, defaultValue = true): boolean => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  const lowered = String(value).trim().toLowerCase();
  if (lowered === 'false' || lowered === '0' || lowered === 'no') return false;
  return true;
};

const asNullable = (value: unknown): string | number | null => {
  if (value === undefined || value === null || value === '') return null;
  return value as string | number;
};

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
    const includeFarmImage = await hasColumn('farms_table', 'farm_image');
    const includeBio = await hasColumn('users_table', 'bio');
    const includeRole = await hasColumn('users_table', 'role');

    const [users]: any = await db.execute(
      `SELECT 
              u.*,
              a.email,
              ${includeRole ? 'u.role' : 'r.role_name AS role'},
              f.farm_name, f.farm_address, f.farm_city, f.farm_province, 
              f.farm_zip_code, f.farm_latitude, f.farm_longitude, f.is_same_as_home as farm_address_same_as_home
              ${includeBio ? ', u.bio' : ''}
              ${includeFarmImage ? ', f.farm_image' : ''}
       FROM users_table u
       LEFT JOIN auth_table a ON u.auth_id = a.id
       LEFT JOIN role_table r ON a.role_id = r.id
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
      farm_name,
      farm_address, farm_city, farm_province, farm_zip_code,
      farm_latitude, farm_longitude, farm_address_same_as_home
    } = req.body;
    const userColumns = await getTableColumns('users_table');
    const farmColumnsInDb = await getTableColumns('farms_table');
    const hasFarmsTable = farmColumnsInDb.size > 0;
    const files = (req.files || {}) as Record<string, Express.Multer.File[]>;
    const farmImageFile = files?.farm_image?.[0];
    const profileImageFile = files?.profile_image?.[0];
    const farmImagePath = farmImageFile ? `/uploads/${farmImageFile.filename}` : undefined;
    const profileImagePath = profileImageFile ? `/uploads/${profileImageFile.filename}` : undefined;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const userIdValue = String(userId);

    // Update core table
    const safeFirstName = asNullable(first_name);
    const safeLastName = asNullable(last_name);
    const safePhone = asNullable(phone);
    const safeAddress = asNullable(address);
    const safeCity = asNullable(city);
    const safeProvince = asNullable(province);
    const safeZipCode = asNullable(zip_code);
    const safeLatitude = asNullable(latitude);
    const safeLongitude = asNullable(longitude);
    const safeBio = asNullable((req.body as any).bio);

    if (safeFirstName === null || safeLastName === null) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const userUpdates: Array<{ column: string; value: string | number | null }> = [
      { column: 'first_name', value: safeFirstName },
      { column: 'last_name', value: safeLastName },
      { column: 'phone', value: safePhone },
      { column: 'address', value: safeAddress },
      { column: 'city', value: safeCity },
      { column: 'province', value: safeProvince },
      { column: 'zip_code', value: safeZipCode },
      { column: 'latitude', value: safeLatitude },
      { column: 'longitude', value: safeLongitude },
      { column: 'bio', value: safeBio },
    ].filter(({ column }) => userColumns.has(column));

    if (profileImagePath) {
      if (userColumns.has('profile_image')) {
        userUpdates.push({ column: 'profile_image', value: profileImagePath });
      } else if (userColumns.has('image_path')) {
        userUpdates.push({ column: 'image_path', value: profileImagePath });
      }
    }

    if (userUpdates.length > 0) {
      await db.execute(
        `UPDATE users_table 
         SET ${userUpdates.map((u) => `${u.column} = ?`).join(', ')}
         WHERE id = ?`,
        [...userUpdates.map((u) => u.value), userIdValue]
      );
    }

    // Update farm detail in separate table
    const isSameAsHome = normalizeBoolean(farm_address_same_as_home, true);
    const safeFarmName = asNullable(farm_name);
    const finalFarmAddress = isSameAsHome ? safeAddress : asNullable(farm_address);
    const finalFarmCity = isSameAsHome ? safeCity : asNullable(farm_city);
    const finalFarmProvince = isSameAsHome ? safeProvince : asNullable(farm_province);
    const finalFarmZipCode = isSameAsHome ? safeZipCode : asNullable(farm_zip_code);
    const finalFarmLatitude = isSameAsHome ? safeLatitude : asNullable(farm_latitude);
    const finalFarmLongitude = isSameAsHome ? safeLongitude : asNullable(farm_longitude);

    let userRole = '';
    if (userColumns.has('role')) {
      const [roleRows]: any = await db.execute(
        'SELECT role FROM users_table WHERE id = ? LIMIT 1',
        [userIdValue]
      );
      userRole = String(roleRows?.[0]?.role || '').toLowerCase();
    } else {
      const [roleRows]: any = await db.execute(
        `SELECT r.role_name
         FROM users_table u
         JOIN auth_table a ON u.auth_id = a.id
         JOIN role_table r ON a.role_id = r.id
         WHERE u.id = ?
         LIMIT 1`,
        [userIdValue]
      );
      userRole = String(roleRows?.[0]?.role_name || '').toLowerCase();
    }

    const hasFarmInput =
      safeFarmName !== null ||
      asNullable(farm_address) !== null ||
      asNullable(farm_city) !== null ||
      asNullable(farm_province) !== null ||
      asNullable(farm_zip_code) !== null ||
      asNullable(farm_latitude) !== null ||
      asNullable(farm_longitude) !== null ||
      farmImagePath !== undefined;

    // Buyers commonly do not have a farms_table row. Skip farm upsert unless farmer or farm data is being provided.
    // Support both schemas:
    // 1) normalized farm data in farms_table
    // 2) legacy farm columns in users_table
    if (hasFarmsTable && (userRole === 'farmer' || hasFarmInput)) {
      const farmEntries: Array<{ column: string; value: string | number | null }> = [
        { column: 'farm_name', value: safeFarmName },
        { column: 'farm_address', value: finalFarmAddress },
        { column: 'farm_city', value: finalFarmCity },
        { column: 'farm_province', value: finalFarmProvince },
        { column: 'farm_zip_code', value: finalFarmZipCode },
        { column: 'farm_latitude', value: finalFarmLatitude },
        { column: 'farm_longitude', value: finalFarmLongitude },
        { column: 'is_same_as_home', value: isSameAsHome ? 1 : 0 },
        ...(farmImagePath ? [{ column: 'farm_image', value: farmImagePath }] : []),
      ].filter(({ column }) => farmColumnsInDb.has(column));

      const farmColumns = ['user_id', ...farmEntries.map((entry) => entry.column)];
      const farmValues: Array<string | number | null> = [userIdValue, ...farmEntries.map((entry) => entry.value)];
      const farmUpdates =
        farmEntries.length > 0
          ? farmEntries.map((entry) => `${entry.column} = VALUES(${entry.column})`)
          : ['user_id = user_id'];

      await db.execute(
        `INSERT INTO farms_table (${farmColumns.join(', ')})
         VALUES (${farmColumns.map(() => '?').join(', ')})
         ON DUPLICATE KEY UPDATE ${farmUpdates.join(', ')}`,
        farmValues
      );
    } else if (!hasFarmsTable && (userRole === 'farmer' || hasFarmInput)) {
      const legacyFarmUpdates: Array<{ column: string; value: string | number | null }> = [
        { column: 'farm_name', value: safeFarmName },
        { column: 'farm_address', value: finalFarmAddress },
        { column: 'farm_city', value: finalFarmCity },
        { column: 'farm_province', value: finalFarmProvince },
        { column: 'farm_zip_code', value: finalFarmZipCode },
        { column: 'farm_latitude', value: finalFarmLatitude },
        { column: 'farm_longitude', value: finalFarmLongitude },
        { column: 'farm_address_same_as_home', value: isSameAsHome ? 1 : 0 },
      ].filter(({ column }) => userColumns.has(column));

      if (legacyFarmUpdates.length > 0) {
        await db.execute(
          `UPDATE users_table
           SET ${legacyFarmUpdates.map((entry) => `${entry.column} = ?`).join(', ')}
           WHERE id = ?`,
          [...legacyFarmUpdates.map((entry) => entry.value), userIdValue]
        );
      }
    }

    return res.status(200).json({
      message: 'Normalized profile updated successfully',
      ...(farmImagePath ? { farm_image: farmImagePath } : {}),
      ...(profileImagePath ? { profile_image: profileImagePath } : {})
    });
  } catch (err: any) {
    // mysql2 errors often include `code` + `sqlMessage` (more useful than a generic message)
    console.error('[updateUserProfile] failed', err);
    const message =
      err?.sqlMessage ||
      err?.message ||
      (typeof err === 'string' ? err : undefined) ||
      'Error updating normalized profile';
    return res.status(500).json({ message });
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
