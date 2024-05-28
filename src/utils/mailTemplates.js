const withdrawalOTPMailTemp = (fullName, otp) => `<!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8" />
                <title>OTP Email</title>
                </head>
                <body
                style="
                    font-family: Arial, sans-serif;
                    background-color: #f6f6f6;
                    margin: 0;
                    padding: 0;"
                >
                <div
                    style="
                    background-color: #ffffff;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    "
                >
                <div
                style="
                text-align: center;
                padding: 20px;
                display: flex;
                "
                >
                <img
                    src="https://grandhealthcycle-v1.onrender.com/assets/img/ghc_logo.png"
                    alt="Grand Health Cycle"
                    style="max-width: 100px; margin: 0 auto;"
                />
                </div>
                <h2 style="text-align: center;">Grand Health Cycle</h2>
                    <div style="padding: 20px">
                    <p>Hi ${fullName},</p>
                    <p>
                        We received your request to withdraw funds from your account. To
                        complete this transaction, please use the following One-Time Password
                        (OTP):
                    </p>
                    <div
                        style="
                        text-align: center;
                        padding: 10px 20px;
                        margin: 20px 0;
                        font-size: 30px;
                        font-weight: bold;
                        color: #ee6408;
                        border-radius: 5px;
                        letter-spacing: 10px;
                        "
                    >
                        ${otp}
                    </div>
                    <p>
                        This OTP is valid for the next 10 minutes. Please do not share this
                        code with anyone.
                    </p>
                    <p>
                        If you did not request this withdrawal, please contact our support
                        team immediately.
                    </p>
                    </div>
                    <div
                    style="
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #888888;
                    "
                    >
                    <p>PL 330, FI-00831 Helsinki, SUOMI/FINLAND.</p>
                    <p>
                        Need help?
                        <a
                        href="mailto:support@grandhealthcycle.com"
                        style="color: #888888; text-decoration: none"
                        >Contact Support: support@grandhealthcycle.com</a>
                    </p>
                    </div>
                </div>
                </body>
            </html>
            `;
const resetPasswordOTPMailTemp = (fullName, otp) => `<!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8" />
                <title>OTP Email</title>
                </head>
                <body
                style="
                    font-family: Arial, sans-serif;
                    background-color: #f6f6f6;
                    margin: 0;
                    padding: 0;
                "
                >
                <div
                    style="
                    background-color: #ffffff;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    "
                >
                    <div
                    style="
                    text-align: center;
                    padding: 20px;
                    display: flex;
                    "
                    >
                    <img
                        src="https://grandhealthcycle-v1.onrender.com/assets/img/ghc_logo.png"
                        alt="Grand Health Cycle"
                        style="max-width: 100px; margin: 0 auto;"
                    />
                    </div>
                    <h2 style="text-align: center;">Grand Health Cycle</h2>
                    <div style="padding: 20px">
                    <p>Hi ${fullName},</p>
                    <p>
                    We received a request to reset the password for your account. To proceed with resetting your password, please use the following One-Time Password (OTP):
                    </p>
                    <div
                        style="
                        text-align: center;
                        padding: 10px 20px;
                        margin: 20px 0;
                        font-size: 30px;
                        font-weight: bold;
                        color: #ee6408;
                        border-radius: 5px;
                        letter-spacing: 10px;
                        "
                    >
                        ${otp}
                    </div>
                    <p>
                        This OTP is valid for the next 10 minutes. Please do not share this
                        code with anyone.
                    </p>
                    <p>
                        If you did not request this withdrawal, please contact our support
                        team immediately.
                    </p>
                    </div>
                    <div
                    style="
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #888888;
                    "
                    >
                    <p>PL 330, FI-00831 Helsinki, SUOMI/FINLAND.</p>
                    <p>
                        Need help?
                        <a
                        href="mailto:support@grandhealthcycle.com"
                        style="color: #888888; text-decoration: none"
                        >Contact Support: support@grandhealthcycle.com</a>
                    </p>
                    </div>
                </div>
                </body>
            </html>
            `;
const welcomeMailTemp = (fullName) => `<!DOCTYPE html>
 <html>
     <head>
         <meta charset="UTF-8" />
         <title>Welcome to Grand Health Cycle</title>
     </head>
     <body
         style="
             font-family: Arial, sans-serif;
             background-color: #f6f6f6;
             margin: 0;
             padding: 0;
         "
     >
         <div
             style="
                 background-color: #ffffff;
                 width: 100%;
                 max-width: 600px;
                 margin: 0 auto;
                 padding: 20px;
                 border: 1px solid #dddddd;
             "
         >
         <div
         style="
         text-align: center;
         padding: 20px;
         display: flex;
         "
         >
         <img
             src="https://grandhealthcycle-v1.onrender.com/assets/img/ghc_logo.png"
             alt="Grand Health Cycle"
             style="max-width: 100px; margin: 0 auto;"
         />
         </div>
         <h2 style="text-align: center;">Grand Health Cycle</h2>
             <div style="padding: 20px">
                 <p>Hi ${fullName},</p>
                 <p>
                     Welcome to Grand Health Cycle!
                 </p>
                 <p>
                     We are thrilled to have you on board. Here’s a quick overview of what you can expect:
                 </p>
                 <ul>
                     <li><strong>Explore our Services:</strong> Dive into our wide range of services and find the ones that suit your needs.</li>
                     <li><strong>Get Support:</strong> Our support team is here to help you with any questions or issues. Feel free to reach out anytime.</li>
                     <li><strong>Stay Updated:</strong> Keep an eye on your inbox for updates, tips, and exclusive offers.</li>
                 </ul>
                 <p>
                     To get started, log in to your account and explore all the features we have to offer. If you have any questions, do not hesitate to contact us.
                 </p>
                 <p>
                     Thank you for choosing Grand Health Cycle. We look forward to serving you!
                 </p>
                 <p>
                     Best regards,<br/>
                     Grand Health Cycle Team
                 </p>
             </div>
             <div
                 style="
                     padding: 20px;
                     text-align: center;
                     font-size: 12px;
                     color: #888888;
                 "
             >
                 <p>PL 330, FI-00831 Helsinki, SUOMI/FINLAND.</p>
                 <p>
                     Need help?
                     <a
                         href="mailto:support@grandhealthcycle.com"
                         style="color: #888888; text-decoration: none"
                     >Contact Support: support@grandhealthcycle.com</a>
                 </p>
             </div>
         </div>
     </body>
 </html>
 `;

const contactUsMailTemp = (name, subject, email, message) => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Contact Us Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0;">
            <div style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd;">
                <div style="padding: 20px; text-align: center;">
                    <h2 style="color: #333333;">Contact Us Form Submission</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Hi Grand Health Cycle Team,</p>
                    <p>You have received a new message from the Contact Us form on your website. Here are the details:</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong><br/> ${message} </p>
                    <p>Please respond to the inquiry at your earliest convenience.</p>
                    <p>Best regards,</p>
                    <p> www.grandhealthcycle.com</p>
                </div>
                <div style="padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                    <p>Grand Health Cycle, PL 330, FI-00831 Helsinki, SUOMI/FINLAND. 
                     </p>
                </div>
            </div>
        </body>
    </html>
    
            `;

const mailTemplates = {
    withdrawal: withdrawalOTPMailTemp,
    resetPassword: resetPasswordOTPMailTemp,
    welcome: welcomeMailTemp,
    contactUs: contactUsMailTemp,
};

export default mailTemplates;
