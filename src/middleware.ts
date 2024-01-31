import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token) {
      if (req.nextUrl.pathname.match("/(api)(.*)")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        const url = req.nextUrl.clone();
        url.pathname = "/api/auth/signin";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // 認可に関する処理。ロールが `admin` ならOK
      authorized: () => {
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/(api|motion|stage|users|room)(.*)", "/"],
};
