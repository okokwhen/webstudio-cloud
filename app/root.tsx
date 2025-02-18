/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Links, Meta, Outlet, useMatches } from "react-router";
import { CustomCode } from "./__generated__/_index";
import { SessionService } from './atlas/services/server';
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await SessionService.requireAuth(request);

  return Response.json({
    isAuthenticated: SessionService.getIsAuthenticated(session),
  });
}

const Root = () => {
  // Get language from matches
  const matches = useMatches();

  const lastMatchWithLanguage = matches.findLast((match) => {
    // @ts-ignore
    const language = match?.data?.pageMeta?.language;
    return language != null;
  });

  // @ts-ignore
  const lang = lastMatchWithLanguage?.data?.pageMeta?.language ?? "en";

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <CustomCode />
      </head>
      <Outlet />
    </html>
  );
};

export default Root;
