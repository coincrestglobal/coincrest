const catchAsync = require("../utils/catchAsync");
const Setting = require("../models/settingModel");

exports.updateDepositBonus = catchAsync(async (req, res) => {
  const { value } = req.body;

  let setting = await Setting.findOne({ key: "deposit_bonus" });

  if (setting) {
    setting.value = value;
    await setting.save();
  } else {
    setting = await Setting.create({
      key: "deposit_bonus",
      value,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Deposit bonus updated",
    data: { value: setting.value },
  });
});

exports.updateTeamBonus = catchAsync(async (req, res) => {
  const { bonusKey, bonusValue } = req.body;

  let setting = await Setting.findOne({ key: "team_bonus" });

  if (!setting) {
    setting = await Setting.create({
      key: "team_bonus",
      value: {
        10: 0,
        50: 0,
        100: 0,
        500: 0,
      },
    });
  }

  setting.value[bonusKey] = bonusValue;

  setting.markModified("value");

  await setting.save();

  res.status(200).json({
    status: "success",
    message: `Team bonus value updated for key ${bonusKey}`,
    data: { value: setting.value },
  });
});

exports.getDepositBonus = catchAsync(async (req, res) => {
  const setting = await Setting.findOne({ key: "deposit_bonus" });

  res.status(200).json({
    status: "success",
    data: { value: setting?.value || null },
  });
});

exports.getTeamBonus = catchAsync(async (req, res) => {
  const setting = await Setting.findOne({ key: "team_bonus" });

  res.status(200).json({
    status: "success",
    data: { value: setting.value || {} },
  });
});
