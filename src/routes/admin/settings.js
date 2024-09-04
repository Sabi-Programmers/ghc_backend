import express from "express";
import {
  fundMember,
  getFundMemberPage,
  getOTPforSetting,
  getSettingsPage,
  updateSettings,
} from "../../controllers/admin/settings.js";

const settingRouter = express.Router();

settingRouter.get("", getSettingsPage);
settingRouter.post("", updateSettings);
settingRouter.get("/fund-member", getFundMemberPage);
settingRouter.post("/fund-member", fundMember);
settingRouter.post("/otp", getOTPforSetting);

export default settingRouter;
