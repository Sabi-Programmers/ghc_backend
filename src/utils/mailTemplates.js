const withdrawalOTPMailTemp = (fullName, otp) => {
  return `<!DOCTYPE html>
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
                        align-items: center;
                        gap: 24px;
                    "
                    >
                    <img
                        src="https://grandhealthcycle-v1.onrender.com/assets/img/ghc_logo.png"
                        alt="Grand Health Cycle"
                        style="max-width: 100px"
                    />
                    <h2>Grand Health Cycle</h2>
                    </div>
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
                        href="mailto:support@yourcompany.com"
                        style="color: #888888; text-decoration: none"
                        >Contact Support</a
                        >
                    </p>
                    </div>
                </div>
                </body>
            </html>
            `;
};

const mailTemplates = {
  withdrawal: withdrawalOTPMailTemp,
};

export default mailTemplates;
