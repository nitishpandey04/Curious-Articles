import { NextResponse } from 'next/server';

export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function badRequestResponse(message = 'Bad request') {
  return errorResponse(message, 400);
}
