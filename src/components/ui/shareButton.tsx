import React, { useState } from "react";

export function ShareButton({ to }: { to: string }) {
  const [linkText, setLinkText] = useState("🔗");
  function confirm(text: string) {
    setLinkText(text);
    setTimeout(() => {
      setLinkText("🔗");
    }, 5000);
  }
  const url = window.location.origin + "#" + to;
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        text: "MDGs partiprogram",
        url,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      confirm("Lenke kopiert");
    } else {
      location.href = url;
    }
  }
  return (
    <a className={"share"} onClick={handleClick} href={"#"} tabIndex={-1}>
      {linkText}
    </a>
  );
}
