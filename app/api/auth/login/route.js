import { NextResponse } from 'next/server';

// Backend API base URL (HTTP is fine for server-to-server communication)
const BACKEND_API = 'http://eduscribe.runasp.net/api';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Forward the request to the actual backend
    const response = await fetch(`${BACKEND_API}/User/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
    
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}