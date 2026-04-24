# Denmark API

🔗 **[Live Swagger Documentation](https://denmark-api-node-js.onrender.com/api-docs)**

## Key Features

- **Professional Auth:** Registration with avatar upload, email verification (Brevo), and secure password reset flow.
- **Document Management:** Personal checklists.
- **Language Study:** A learning system with progress tracking and "Repeat Mode".
- **Gallery Service:** Cloudinary cloud storage.
- **Interactive Map:** Hotspots management with coordinate mapping and automated weather data linking.
- **Advanced Security:** JWT authentication, Joi request validation, and comprehensive error handling with field-specific feedback.

## Tech Stack

- **Core:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT & Bcrypt
- **File Storage:** Cloudinary
- **Sendler email:** Brevo
- **Validation:** Joi
- **Documentation:** Swagger UI
- **Other:** Docker

## Getting Started

### 1. **Clone the repository:**

```bash
   git clone https://github.com/Dmytro1117/denmark-api_node.js.git
```

### 2. **Install dependencies:**

```bash
   npm install
```

### 3. **Configure Environment Variables:**

Create a `.env` file in the root directory:

```env
PORT_LOCAL=8080
BASE_FRONTEND_URL=your_deployed_frontend_or_localhost
DB_HOST=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
BREVO_KEY=your_brevo_key
CLOUDINARY_NAME=name
CLOUDINARY_KEY=key
CLOUDINARY_SECRET=secret
DEFAULT_AVATAR=url_to_default_icon
DEFAULT_ICON_MAP=url_to_default_icon
```

### 4. **Run the application:**

```bash
npm run start
```

The app will be available at http://localhost:8080
