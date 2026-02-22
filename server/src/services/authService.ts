import { hashPassword, comparedPassword } from '../utils/hash';
import { db } from '../database/database';


export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role_name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}


export const registerUser = async (data: RegisterInput) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check if email exists in auth_table
    const [existingUser] = await connection.execute(
      'SELECT id FROM auth_table WHERE email = ?',
      [data.email]
    );

    if ((existingUser as any[]).length > 0) {
      throw new Error('Email already registered');
    }

    // 2. Lookup role_id from role_table
    const [roles] = await connection.execute(
      'SELECT id FROM role_table WHERE role_name = ?',
      [data.role_name]
    );

    if ((roles as any[]).length === 0) {
      throw new Error(`Invalid role specified: ${data.role_name}`);
    }
    const roleId = (roles as any[])[0].id;

    // 3. Hash the password
    const password_hash = await hashPassword(data.password);

    // 4. Insert into auth_table
    const [authResult] = await connection.execute(
      'INSERT INTO auth_table (email, password_hash, role_id) VALUES (?, ?, ?)',
      [data.email, password_hash, roleId]
    );

    const authId = (authResult as any).insertId;

    // 5. Insert into users_table
    await connection.execute(
      'INSERT INTO users_table (auth_id, first_name, last_name) VALUES (?, ?, ?)',
      [authId, data.firstName || '', data.lastName || '']
    );

    await connection.commit();
    return { authId, email: data.email };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const loginUser = async (data: LoginInput) => {
  const [users]: any = await db.execute(
    `SELECT a.id, a.password_hash, r.role_name 
     FROM auth_table a 
     JOIN role_table r ON a.role_id = r.id 
     WHERE a.email = ?`,
    [data.email]
  );

  if (users.length === 0) {
    throw new Error('User not found');
  }

  const user = users[0];
  const isPasswordValid = await comparedPassword(data.password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return {
    id: user.id,
    email: data.email,
    role_name: user.role_name
  };
};
