import React from "react";

const ShopProducts = () => (
  <div dangerouslySetInnerHTML={{ __html: `
    <!DOCTYPE html>
    <html lang=\"en\">
    <head>
      <meta charSet=\"UTF-8\" />
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
      <title>Shop Products - Golden Bites</title>
      <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css\" />
      <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />
      <style>
        /* ...styles omitted for brevity... */
      </style>
    </head>
    <body>
      {/* ...body content from shop_products.html, Django tags commented out... */}
    </body>
    </html>
  `}} />
);

export default ShopProducts; 