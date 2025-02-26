import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const newPassword = 'Test123!';
const saltRounds = 10;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bon_photo'
};

async function resetAllPasswords() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Generate the hashed password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update all users with the new password
    const [result] = await connection.query(
      'UPDATE users SET password = ?',
      [hashedPassword]
    );
    
    console.log(`Successfully updated ${result.affectedRows} users`);
    console.log('New password for all users is: Test123!');
  } catch (error) {
    console.error('Error resetting passwords:', error);
  } finally {
    // Always close the connection
    await connection.end();
  }
}

resetAllPasswords();
