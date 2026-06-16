"use client";

import Script from "next/script";
import { useEffect } from "react";

const PAGE_ID = "666164833431419";

export default function FacebookMessenger() {
  useEffect(() => {
    const chatbox = document.getElementById("fb-customer-chat");
    if (chatbox) {
      chatbox.setAttribute("page_id", PAGE_ID);
      chatbox.setAttribute("attribution", "biz_inbox");
    }
  }, []);

  return (
    <>
      <div id="fb-root" />
      <div id="fb-customer-chat" className="fb-customerchat" />
      <Script
        id="facebook-messenger-sdk"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function() {
              FB.init({ xfbml: true, version: "v21.0" });
            };
            (function(d,s,id){
              var js,fjs=d.getElementsByTagName(s)[0];
              if(d.getElementById(id))return;
              js=d.createElement(s);js.id=id;
              js.src='https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js,fjs);
            }(document,'script','facebook-jssdk'));
          `,
        }}
      />
    </>
  );
}
