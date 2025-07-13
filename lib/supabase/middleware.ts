import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _request: NextRequest,
): Promise<NextResponse> {
  // Placeholder middleware - just pass through for now
  return NextResponse.next();
}
