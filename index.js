const Joi = require('joi');

// 入力値に対する厳密なバリデーション
function validator(params) {
    // 検証ルールを定義
    // default設定
    const schema = Joi.object().keys({
        string_ids: Joi.string().required(),
        user_ids: Joi.array().items(Joi.number()).required(),
        user_group_name: Joi.string().default(""),
    });

    const result = Joi.validate(params, schema, { convert: false });
    if (result.error) {
        const errorMessage = result.error.details[0].message;
        const errorType = result.error.details[0].type;
        switch (errorType) {
            case "any.required":
                throw new Error(errorMessage);
            default:
                throw new Error("その他のエラー");
        }
    }
    return result.value;
}

// キーと型を変換
function converter(params) {
    // キーと型を変換
    const convertedParams = {
        stringIds: params.string_ids.split(",").map((v) => +v),
        userIds: params.user_ids,
        userGroupName: params.user_group_name,
    };

    // 検証ルールを定義
    const schema = Joi.object().keys({
        stringIds: Joi.array().items(Joi.number().min(1).integer()).required(),
        userIds: Joi.array().items(Joi.number()).required(),
        userGroupName: Joi.string().allow("").required(),
    });

    // サービスに渡す前の正当性検証
    // 別関数に分けるべき？
    const result = Joi.validate(convertedParams, schema, { convert: false });
    if (result.error) {
        const errorMessage = result.error.details[0].message;
        const errorType = result.error.details[0].type;
        switch (errorType) {
            case "any.required":
                throw new Error(errorMessage);
            case "number.min":
                throw new Error(`params must be larger than or equal to 1`);
            default:
                throw new Error("その他のエラー");
        }
    }
    return result.value;
}

module.exports = {
    validator,
    converter
};