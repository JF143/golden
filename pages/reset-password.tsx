import React from "react";

const ResetPassword = () => (
  <div dangerouslySetInnerHTML={{ __html: `
    <!DOCTYPE html>
    <html lang=\"en\">
    <head>
      <meta charSet=\"UTF-8\" />
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
      <title>Reset Password - Golden Bites</title>
      <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />
      <style>
        /* ...styles omitted for brevity... */
      </style>
    </head>
    <body>
      {/* ...body content from reset-password.html, Django tags commented out... */}
    </body>
    </html>
  `}} />
);

export default ResetPassword; 