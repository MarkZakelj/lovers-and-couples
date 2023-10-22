import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const supabase = createRouteHandlerClient({ cookies });

  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     options: {
  //       emailRedirectTo: `${requestUrl.origin}/auth/callback`,
  //     },
  //   })
  console.log("EMAIL: ", email)
  const { error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: `${requestUrl.origin}/auth/callback?next=/account/update-password`});

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not find the email ${email}`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to reset your password`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  );
}

