// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// const PUBLIC_ROUTES = ["/login"];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const supabaseResponse = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => request.cookies.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value),
//           );
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options),
//           );
//         },
//       },
//     },
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
//   const isRootPath = pathname === "/";

//   if (user) {
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("id, email, full_name, avatar_url, is_admin")
//       .eq("id", user.id)
//       .single();

//     if (!profile?.is_admin) {
//       await supabase.auth.signOut();
//       return NextResponse.redirect(
//         new URL("/login?error=unauthorized", request.url),
//       );
//     }

//     if (profile?.is_admin) {
//       if (isPublicRoute || isRootPath) {
//         return NextResponse.redirect(new URL("/overview", request.url));
//       }
//     }

//     supabaseResponse.cookies.set("profile", JSON.stringify(profile), {
//       path: "/",
//       httpOnly: true,
//     });
//     return supabaseResponse;
//   }

//   if (!user && !isPublicRoute && !isRootPath) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return supabaseResponse;
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response object first
  const response = NextResponse.next();

  // Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url),
      );
    }

    if (isPublic || pathname === "/") {
      return NextResponse.redirect(new URL("/overview", request.url));
    }

    response.cookies.set("profile", JSON.stringify(profile), {
      path: "/",
      httpOnly: true,
    });

    return response;
  }

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
