import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'padharo_india_db';

// Create database if it does not exist, then create a pool to it and ensure schema.
let pool;

async function ensureDatabaseExists() {
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database ensured: ${DB_NAME}`);
  } finally {
    await conn.end();
  }
}

async function initializeSchema() {
  // Users
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(100) NOT NULL,
      lastName VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      mobile VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'Customer',
      businessType VARCHAR(20) NULL,
      isVerified BOOLEAN NOT NULL DEFAULT TRUE,
      profileImageUrl VARCHAR(255) NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Hotels
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS hotels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      owner_user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT,
      star_rating INT DEFAULT 0,
      amenities_json TEXT,
      image_url VARCHAR(255),
      gallery_urls_json TEXT,
      CONSTRAINT fk_hotels_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Rooms
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hotel_id INT NOT NULL,
      type VARCHAR(100) NOT NULL,
      details TEXT,
      price DECIMAL(10,2) NOT NULL,
      taxes DECIMAL(10,2) NOT NULL DEFAULT 0,
      cancellation_policy TEXT,
      perks_json TEXT,
      image_url VARCHAR(255),
      number_of_rooms INT NOT NULL DEFAULT 1,
      CONSTRAINT fk_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Cabs
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS cabs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      driver_user_id INT NOT NULL,
      model VARCHAR(100) NOT NULL,
      plate_number VARCHAR(50) NOT NULL UNIQUE,
      type VARCHAR(50) NOT NULL,
      seats INT NOT NULL,
      transmission VARCHAR(50),
      fuel_type VARCHAR(50),
      year INT,
      base_rate_km DECIMAL(10,2) DEFAULT 0,
      base_rate_hour DECIMAL(10,2) DEFAULT 0,
      image_url VARCHAR(255),
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      CONSTRAINT fk_cabs_driver FOREIGN KEY (driver_user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Guides
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS guides (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guide_user_id INT NOT NULL,
      location VARCHAR(255) NOT NULL,
      description_short VARCHAR(255),
      description_long TEXT,
      languages_json TEXT,
      specialties_json TEXT,
      price_per_hour DECIMAL(10,2) NOT NULL DEFAULT 0,
      experience_years INT DEFAULT 0,
      tours_completed INT DEFAULT 0,
      image_url VARCHAR(255),
      is_verified BOOLEAN NOT NULL DEFAULT FALSE,
      CONSTRAINT fk_guides_user FOREIGN KEY (guide_user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Packages
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      places_json TEXT,
      nights INT,
      description TEXT,
      included_json TEXT,
      price DECIMAL(10,2),
      image_url VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Bookings
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      service_type ENUM('Cab','Hotel','Guide','Package') NOT NULL,
      service_id INT NOT NULL,
      room_id INT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME NULL,
      pickup_location VARCHAR(255),
      dropoff_location VARCHAR(255),
      num_guests INT DEFAULT 1,
      num_hours INT,
      distance_km DECIMAL(10,2),
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('Pending','Confirmed','Cancelled') NOT NULL DEFAULT 'Confirmed',
      booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Reviews
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      service_type ENUM('Cab','Hotel','Guide','Package') NOT NULL,
      service_id INT NOT NULL,
      booking_id INT NULL,
      rating INT NOT NULL,
      comment TEXT,
      review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Support
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS support_queries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      status ENUM('Open','Closed') NOT NULL DEFAULT 'Open',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_support_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS query_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      query_id INT NOT NULL,
      sender_id INT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_query_messages_query FOREIGN KEY (query_id) REFERENCES support_queries(id) ON DELETE CASCADE,
      CONSTRAINT fk_query_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Helpful indexes for performance (ignore if already exist)
  const addIndex = async (sql) => {
    try { await pool.execute(sql); } catch (e) { /* ignore duplicate index errors */ }
  };
  await addIndex(`ALTER TABLE rooms ADD INDEX idx_rooms_hotel (hotel_id)`);
  await addIndex(`ALTER TABLE bookings ADD INDEX idx_booking_service (service_type, service_id, start_date, status)`);
  await addIndex(`ALTER TABLE bookings ADD INDEX idx_booking_room_dates (room_id, start_date, end_date, status)`);
  await addIndex(`ALTER TABLE reviews ADD INDEX idx_reviews_service (service_type, service_id)`);

  console.log('✅ Database tables ensured.');
}

// Bootstrap: ensure DB and schema then create pool and test connection
async function bootstrap() {
  try {
    await ensureDatabaseExists();
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await initializeSchema();

    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('❌ Database bootstrap failed:', err.message || err);
    process.exit(1);
  }
}

await bootstrap();

export default pool;