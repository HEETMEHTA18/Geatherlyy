# Cloudinary Setup Instructions

This guide will help you set up Cloudinary for photo storage in your Gatherly application.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Credentials

1. After logging in, go to your Dashboard
2. You'll see your credentials in the "Account Details" section:
   - **Cloud Name**: Your unique Cloudinary cloud name
   - **API Key**: Your API key for authentication
   - **API Secret**: Your API secret (keep this private!)

## Step 3: Update Backend Environment Variables

1. Open `backend/.env` file
2. Replace the placeholder values with your actual Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=gatherly-prod
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Step 4: Restart Your Backend Server

After updating the `.env` file, restart your backend server:

```bash
cd backend
npm run start:dev
```

## Step 5: Test the Upload

You can test the upload functionality by:

1. Login to your Gatherly application
2. Go to "Create Club" page
3. Try uploading a club photo or event photos
4. The photos will be uploaded to your Cloudinary account

## Available Upload Endpoints

The backend now has the following upload endpoints:

### 1. Single Image Upload
- **Endpoint**: `POST /api/upload/single`
- **Body**: `multipart/form-data` with `file` field
- **Max Size**: 10MB
- **Formats**: JPG, JPEG, PNG, GIF, WEBP
- **Response**:
```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/gatherly/clubs/abc123.jpg",
  "publicId": "gatherly/clubs/abc123",
  "width": 1200,
  "height": 800
}
```

### 2. Multiple Images Upload
- **Endpoint**: `POST /api/upload/multiple`
- **Body**: `multipart/form-data` with `files[]` field
- **Max Files**: 10
- **Max Size per file**: 10MB
- **Formats**: JPG, JPEG, PNG, GIF, WEBP
- **Response**: Array of image objects

## Frontend Integration Example

The Create Club page already has the frontend code to handle file uploads. When you submit the form, it will:

1. Upload club photo to `/api/upload/single`
2. Upload old events photos to `/api/upload/multiple`
3. Get back the Cloudinary URLs
4. Save those URLs to the database with the club data

## Folder Structure in Cloudinary

Images are organized in the following folders:
- `gatherly/clubs/` - Club profile photos
- `gatherly/events/` - Event photos

## Security Features

✅ JWT authentication required for all uploads
✅ File type validation (only images allowed)
✅ File size limits (10MB per file)
✅ Automatic image optimization (quality: auto, format: auto)
✅ Automatic resizing (max 1200x1200px)

## Troubleshooting

### Issue: "Invalid credentials"
- Double-check your Cloud Name, API Key, and API Secret
- Make sure there are no extra spaces or quotes in the `.env` file

### Issue: "Upload failed"
- Check your internet connection
- Verify the file size is under 10MB
- Make sure the file is an image (JPG, PNG, GIF, WEBP)

### Issue: "Backend not using Cloudinary"
- Make sure you restarted the backend server after updating `.env`
- Check the backend console for any error messages

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month
- This is more than enough for testing and small to medium applications!

## Next Steps

After setting up Cloudinary:
1. ✅ Test uploading a club photo
2. ✅ Test uploading multiple event photos
3. ✅ Verify photos appear correctly in your Cloudinary dashboard
4. ✅ Check that the URLs are saved correctly in your database

---

**Need Help?**
- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Cloudinary Support: [https://support.cloudinary.com](https://support.cloudinary.com)
