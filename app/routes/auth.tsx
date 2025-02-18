import css from "../__generated__/index.css?url";
import { redirect, useActionData } from "react-router";
import { AuthOTP, formatPhoneNumber, isValidE164 } from "../atlas";
import { SessionService } from "../atlas/services/server";
import type {
  ActionFunctionArgs,
  LinkDescriptor,
  LinksFunction,
  LoaderFunctionArgs,
} from "react-router";
import type { ActionData } from "../atlas/types";

const isProduction = process.env.NODE_ENV === "production";

export const links: LinksFunction = () => {
  const result: LinkDescriptor[] = [];

  result.push({
    rel: "stylesheet",
    href: css,
  });

  return result;
};

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();
  const phone = formData.get("phone");
  const otp = formData.get("otp");

  if (!phone) {
    return Response.json({
      success: false,
      message: "Phone number is required",
    }, { status: 400 });
  }

  const formattedPhone = formatPhoneNumber(phone as string);

  if (!formattedPhone) {
    return Response.json({ success: false, message: "Invalid phone number" }, {
      status: 400,
    });
  }

  if (!isValidE164(formattedPhone)) {
    return Response.json({ success: false, message: "Invalid phone number" }, {
      status: 400,
    });
  }

  try {
    console.log("[AUTH]: Client connecting to relay");

    const res = await fetch(`${url.origin}/auth/relay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: formattedPhone, otp }),
    });

    const data = await res.json();

    if (data.sessionId) {
      // Successfully authenticated
      const headers = new Headers();
      const cookie = await SessionService.SESSION_COOKIE.serialize(
        data.sessionId,
        {
          sameSite: "lax",
          secure: isProduction,
          httpOnly: true,
          path: "/",
        },
      );

      headers.append("Set-Cookie", cookie);

      return redirect("/", { headers });
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Authentication failed, please try again later.",
      },
      { status: 400 },
    );
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await SessionService.SESSION_COOKIE.parse(cookieHeader);

  if (session) {
    return redirect("/");
  }

  return Response.json({});
}

export default function Page() {
  const actionData = useActionData<ActionData>();

  return <AuthOTP actionData={actionData} />;
}
