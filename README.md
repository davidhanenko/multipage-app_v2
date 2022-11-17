
# Multipage web application

This is an SSR website with preseted Webpack to get live reloading while develop and splited, bundled code in production.

## Getting Started

### Prerequisites

To run this application you will need:

```
Git
Node.js
npm
```

- #### Cloudinary account for image uploading and storing: [Cloudinary](https://cloudinary.com/)
- #### Google maps API key to get map: [Google Cloud console](https://console.cloud.google.com/projectselector2/apis/credentials?pli=1&supportedpurview=project)
- #### Mailtrap account for email testing: [Mailtrap.io](https://mailtrap.io/)

Creare `.env` file with follow variables:

```
PORT=<localhost port>
DB_URL=<Mongo Atlas cluster url(with username and password) or local MongoDB connection string>
MONGO_STORE_SEC=<Mongo store secret(for session store)>
SESSION_NAME=<Name for your session>
SESSION_SEC=<Session secret>
CLOUDINARY_NAME=<Cloudinary account name - from Cloudinary account>
CLOUDINARY_API_KEY=<Cloudinary API key - from Cloudinary account>
CLOUDINARY_API_SECRET=<Cloudinary API secret - from Cloudinary account>
MAP_API=<Google maps API key - from Google Cloud console>
MAIL_USER=<User id from your Mailtrap account>
MAIL_PASS=<Mail password from your Mailtrap account>
MAIL_TO=<email for nodemailer  testing>
```

### Installiong

- `npm install` - install dependencies.

### Development

- `npm run dev` - start development server with live reloading.

### Production

- `npm run build` - to create `html/ejs`, `css` and `js` files in `dist/` directory. `dist` directory will be removed and recreate with a new build.
- `npm run start` - start production server.

## Usage

The website has an admin page for content management. To create a new Admin navigate to `/admin/register`. Enter 'Username', 'Password', and 'Permission code'. The last use for confirming before deleting important parts of the website.
