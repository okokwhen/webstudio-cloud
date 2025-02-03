/* eslint-disable */
      /* This is a auto generated file for building the project */ 


      import { Fragment, useState } from "react";
      import type { FontAsset, ImageAsset } from "@webstudio-is/sdk";
      import { useResource, useVariableState } from "@webstudio-is/react-sdk/runtime";
      import { Body as Body, RemixForm as RemixForm } from "@webstudio-is/sdk-components-react-router";
import { Box as Box, Heading as Heading, Paragraph as Paragraph, HtmlEmbed as HtmlEmbed, Input as Input, Button as Button } from "@webstudio-is/sdk-components-react";


      export const siteName = "MPLS Exclusives";

      export const favIconAsset: ImageAsset | undefined =
        {"id":"91f97a05fdd0a933a5048e94413d22c9cdece8a5b0bf87c771ec48a7c35e935f","name":"logo_K8oPhIZdT21u2JNqOVJST.jpg","description":null,"projectId":"415daee6-d649-4f55-a0a1-d276dd549867","size":519600,"type":"image","format":"png","createdAt":"2024-12-11T23:54:31.165+00:00","meta":{"width":1234,"height":1155}};

      // Font assets on current page (can be preloaded)
      export const pageFontAssets: FontAsset[] =
        []

      export const pageBackgroundImageAssets: ImageAsset[] =
        []

      

      

      const Page = ({ }: { system: any; }) => {
return <Body
className={`w-body cs1bwfe cdtpo18 c17oxavp c1jbq3j1 c1ivsz46 c1iw9sd4 c1mo3ffr`}>
<Box
className={`w-box c1ojcter c7ownnw`}>
<Heading
className={`w-heading c1ttuzxs c1dmgvcw`}>
{"Enter Your Phone Number"}
</Heading>
<Paragraph
className={`w-paragraph c1w2n47q c1dmgvcw`}>
{"We'll send you a one-time password (OTP) to verify your phone number"}
</Paragraph>
<HtmlEmbed
className={`w-html-embed`} />
</Box>
<RemixForm
className={`w-form`}>
<Input
className={`w-text-input`} />
<Button
className={`w-button`}>
{"Button text you can edit"}
</Button>
</RemixForm>
</Body>
}


      export { Page }
    