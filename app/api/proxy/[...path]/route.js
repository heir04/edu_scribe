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

export async function OPTIONS(request, { params }) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function handleRequest(request, method, params) {
  try {
    const { searchParams } = new URL(request.url);
    const path = params.path ? params.path.join('/') : '';
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    const contentType = request.headers.get('content-type');
    
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
      
      // Check if it's JSON data
      if (contentType?.includes('application/json')) {
        config.body = JSON.stringify(await request.json());
      } 
      // Check if it's multipart/form-data OR if no content-type is set (likely FormData)
      else if (contentType?.includes('multipart/form-data') || !contentType) {
        // For file uploads, don't set Content-Type header, let fetch handle it
        delete headers['Content-Type'];
        try {
          const formData = await request.formData();
          config.body = formData;
        } catch (error) {
          // If FormData parsing fails, try as text
          config.body = await request.text();
        }
      } 
      else {
        config.body = await request.text();
      }
    }

    // Make request to backend
    const response = await fetch(backendUrl, config);
    
    // Handle different response types
    let data;
    const responseContentType = response.headers.get('content-type');
    
    try {
      if (responseContentType?.includes('application/json')) {
        data = await response.json();
      } else {
        // If response is not JSON, get the text content
        const text = await response.text();
        
        // Try to parse as JSON first (in case content-type header is wrong)
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          // If not JSON, wrap the text response in a standard format
          data = {
            status: response.ok,
            message: response.ok ? 'Success' : `Server error: ${response.status} - ${text.substring(0, 200)}...`,
            data: text,
            responseContentType,
            httpStatus: response.status
          };
        }
      }
    } catch (jsonError) {
      // Fallback if any JSON parsing fails
      const text = await response.text();
      data = {
        status: false,
        message: `Response parsing error: ${jsonError.message}. Response: ${text.substring(0, 200)}...`,
        data: text,
        error: 'JSON_PARSE_ERROR'
      };
    }

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
      { 
        status: false, 
        message: `Server error: ${error.message}`,
        data: null 
      },
      { status: 500 }
    );
  }
}