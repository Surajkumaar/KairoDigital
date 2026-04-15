# Admin Dashboard Setup Guide

## How to Use the Admin Dashboard

### Accessing the Admin Dashboard
1. Click the **Kairo Digital logo** in the top-left corner **3 times quickly** (within 2 seconds)
2. The Admin Dashboard modal will open

### Uploading Portfolio Data

The admin dashboard allows you to upload an Excel file containing your portfolio items (posters, videos, and websites).

#### Excel File Format

Create an Excel (.xlsx) file with the following columns:

| Column Name | Required | Type | Description |
|---|---|---|---|
| Title | ✅ Yes | Text | Name of the portfolio item |
| Description | ❌ No | Text | Brief description of the item |
| Type | ✅ Yes | Text | Either "poster" or "video" |
| Image URL | ❌ No | URL | For posters - the image URL or Google Drive image link |
| Video URL | ❌ No | URL | For videos - YouTube URL or Google Drive preview link |
| Video Thumbnail | ❌ No | URL | For videos - custom thumbnail image URL |
| Website URL | ❌ No | URL | Link to the website (optional for any type) |

#### Example Data

```
Title | Description | Type | Image URL | Video URL | Video Thumbnail | Website URL
------|-------------|------|-----------|-----------|------------------|-------------
Blacmelo | Minimal streetwear platform | poster | https://... | | | https://blacmelo.com
Ep Release | Behind the scenes | video | | https://youtu.be/yOCeuRVwP74 | https://... |
```

### Important Notes

- **Items sync by Title and Type** - If you upload an item with the same Title and Type as an existing item, it will be updated
- **New items are added** - Items not found in the database are created fresh
- **No data loss** - You can update individual items without affecting others
- The file will be processed automatically
- After successful upload, the page will refresh to show the new items

### Supported Video Sources

- **YouTube**: `https://youtu.be/VIDEO_ID` or `https://www.youtube.com/watch?v=VIDEO_ID`
- **Google Drive**: `https://drive.google.com/file/d/FILE_ID/preview` (with or without /preview)

### Supported Image Sources

- Direct image URLs
- Google Drive image links
- Image service URLs (like weserv.nl)

### Tips for Success

1. **Use consistent formatting** - Ensure all URLs are properly formatted
2. **Test with a small file first** - Upload 2-3 items to verify the format works
3. **Keep descriptions concise** - Long descriptions may be truncated in UI
4. **Validate URLs** - Test image and video URLs before uploading
5. **Backup your data** - Keep a copy of your Excel file in case you need to re-upload

---

**Version**: 1.0  
**Last Updated**: April 15, 2026
