import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: [
    '/adminDashboard', '/adminMessage', '/adminReports', 
    '/adminSettings', '/Auditlogs', '/ManageAcc'
  ],
  MANAGER: [
    '/managerDashboard', '/managerAttendance', '/managerEvaluation',
    '/managerMessage', '/managerProfile', '/managerReports', '/Approvals'
  ],
  HR: [
    '/hrDashboard', '/hrAttendance', '/hrApproval', '/hrEvaluate',
    '/hrMessage', '/hrPayroll', '/hrReports', '/Applicants'
  ],
  EMPLOYEE: [
    '/Dashboard', '/Attendance', '/Evaluation', '/LeaveReq',
    '/Message', '/Payroll', '/Profile', '/Reports'
  ],
};

const PUBLIC_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { role } = JSON.parse(session);
    const upperRole = role?.toUpperCase();
    const myRoutes = ROLE_ROUTES[upperRole] ?? [];

    const isForbidden = Object.entries(ROLE_ROUTES)
      .filter(([r]) => r !== upperRole)
      .some(([, routes]) => routes.some(route => pathname.startsWith(route)));

    if (isForbidden) {
      const home = myRoutes[0] ?? '/login';
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/adminDashboard/:path*', '/adminMessage/:path*', '/adminReports/:path*',
    '/adminSettings/:path*', '/Auditlogs/:path*', '/ManageAcc/:path*',
    '/managerDashboard/:path*', '/managerAttendance/:path*', '/managerEvaluation/:path*',
    '/managerMessage/:path*', '/managerProfile/:path*', '/managerReports/:path*',
    '/Approvals/:path*',
    '/hrDashboard/:path*', '/hrAttendance/:path*', '/hrApproval/:path*',
    '/hrEvaluate/:path*', '/hrMessage/:path*', '/hrPayroll/:path*',
    '/hrReports/:path*', '/Applicants/:path*',
    '/Dashboard/:path*', '/Attendance/:path*', '/Evaluation/:path*',
    '/LeaveReq/:path*', '/Message/:path*', '/Payroll/:path*',
    '/Profile/:path*', '/Reports/:path*',
  ],
};