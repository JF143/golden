import React from "react";

const Login = () => (
  <div dangerouslySetInnerHTML={{ __html: `
    <!DOCTYPE html>
    <html lang=\"en\">
    <head>
        <meta charSet=\"UTF-8\" />
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
        <title>Golden Bites - Sign In</title>
        <style>
        /* ...styles omitted for brevity... */
        </style>
    </head>
    <body>
        <div class=\"auth-container\">
            <div class=\"auth-form\">
                <h2 class=\"form-title\">Sign in</h2>
                <p class=\"form-subtitle\">Please sign in first to enjoy the service</p>
                <form id=\"loginForm\" method=\"POST\" action=\"#\">
                    <div class=\"form-group\">
                        <label class=\"form-label\" htmlFor=\"email\">Email</label>
                        <input type=\"email\" id=\"email\" name=\"email\" class=\"form-input\" placeholder=\"email\" required />
                        <div class=\"error-message\" id=\"email-error\"></div>
                    </div>
                    <div class=\"form-group\">
                        <label class=\"form-label\" htmlFor=\"password\">Password</label>
                        <input type=\"password\" id=\"password\" name=\"password\" class=\"form-input\" placeholder=\"password\" required />
                        <div class=\"error-message\" id=\"password-error\"></div>
                    </div>
                    <button type=\"submit\" class=\"btn\" id=\"login-btn\">Login</button>
                    <div class=\"form-footer\">
                        Not a member? <a href=\"#\" class=\"form-link\">Register now</a>
                    </div>
                    <div class=\"social-login\">
                        <button type=\"button\" class=\"w-full bg-white border py-2 rounded text-sm flex items-center justify-center\">
                            <img src=\"/img/google.png\" alt=\"G\" class=\"w-5 h-5 mr-2\" onError=\"this.src='https://placehold.co/20x20/E0E0E0/333333?text=G'\" /> Continue with ADNU GBOX
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <script>
        </script>
    </body>
    </html>
  `}} />
);

export default Login; 