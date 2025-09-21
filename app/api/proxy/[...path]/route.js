import { NextResponse } from 'next/server';

const BACKEND_API = 'http://eduscribe.runasp.net/api';

export async function GET(request, { params }) {
  return handleRequest(request, 'GET', params);
}

export async function POST(request, { params }) {
  return handleRequest(request, 'POST', params);
}

export async function PUT(request, { params }) {
  return handleRequest(request, 'PUT', params);
}

export async function DELETE(request, { params }) {
  return handleRequest(request, 'DELETE', params);
}

async function handleRequest(request, method, params) {
  try {
    const { searchParams } = new URL(request.url);
    const path = params.path ? params.path.join('/') : '';
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    // Prepare headers for backend request
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Prepare the backend URL
    let backendUrl = `${BACKEND_API}/${path}`;
    if (searchParams.toString()) {
      backendUrl += `?${searchParams.toString()}`;
    }

    // Prepare request config
    const config = {
      method,
      headers,
    };

    // Add body for POST, PUT requests
    if (method === 'POST' || method === 'PUT') {
      const contentType = request.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        config.body = JSON.stringify(await request.json());
      } else if (contentType?.includes('multipart/form-data')) {
        // For file uploads, don't set Content-Type header, let fetch handle it
        delete headers['Content-Type'];
        config.body = await request.formData();
      } else {
        config.body = await request.text();
      }
    }

    // Make request to backend
    const response = await fetch(backendUrl, config);
    const data = await response.json();

    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}