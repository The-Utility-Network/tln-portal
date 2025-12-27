import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

/**
 * Image Upload API Route for TLN
 * 
 * Setup Instructions:
 * 1. Create a Google Cloud Storage bucket named 'tgl_cdn'
 * 2. Create a service account with Storage Admin permissions
 * 3. Download the service account key file
 * 4. Add to .env.local:
 *    GOOGLE_CLOUD_PROJECT_ID=your-project-id
 *    GOOGLE_CLOUD_KEY_FILE=./path/to/service-account-key.json
 * 
 * Alternative: Use credentials as JSON string:
 *    GOOGLE_CLOUD_CREDENTIALS={"type":"service_account",...}
 */

// Initialize Google Cloud Storage
let storage: Storage | null = null;
let bucket: any = null;

try {
  // Check if credentials are configured
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    console.warn('GOOGLE_CLOUD_PROJECT_ID not configured - image upload will be disabled');
  } else {
    const storageConfig: any = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    };

    // Use either key file or credentials JSON
    if (process.env.GOOGLE_CLOUD_KEY_FILE) {
      storageConfig.keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE;
    } else if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
      storageConfig.credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    } else {
      console.warn('No Google Cloud credentials configured - image upload will be disabled');
    }

    if (storageConfig.keyFilename || storageConfig.credentials) {
      storage = new Storage(storageConfig);
      const bucketName = 'tgl_cdn';
      bucket = storage.bucket(bucketName);
    }
  }
} catch (error) {
  console.error('Google Cloud Storage initialization failed:', error);
  storage = null;
  bucket = null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Google Cloud Storage is properly initialized
    if (!storage || !bucket) {
      return NextResponse.json({ 
        success: false,
        error: 'Image upload service not configured. Please contact administrator to set up Google Cloud Storage.' 
      }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `tln-signatures/${timestamp}_${originalName}`;

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create file in bucket
    const gcsFile = bucket.file(fileName);
    
    // Upload file
    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Try to make the file public, but handle uniform bucket-level access gracefully
    try {
      await gcsFile.makePublic();
    } catch (makePublicError: any) {
      // If uniform bucket-level access is enabled, this will fail
      // Log the warning but continue - the file is uploaded successfully
      console.warn('Could not make file public (likely due to uniform bucket-level access):', makePublicError.message);
      // This is okay if bucket has public read permissions configured at bucket level
    }
    
    // Generate public URL  
    const bucketName = 'tgl_cdn';
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' }, 
      { status: 500 }
    );
  }
} 