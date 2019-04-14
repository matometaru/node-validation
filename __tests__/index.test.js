const main = require('../index');

describe('validator', () => {
    test('正しい入力値', () => {
        const params = {
            string_ids: "1,2,abc,3,1.2",
            user_ids: [1,2],
        };
        const actual = main.validator(params)
        const expected = {
            string_ids: "1,2,abc,3,1.2",
            user_ids: [1,2],
            user_group_name: "",
        };
        expect(actual).toEqual(expected);
    });
    test('user_idsが未入力', () => {
        const params = {
            string_ids: "1,2,abc,3,1.2",
        };
        try {
            main.validator(params);
        } catch (e) {
            expect(e.message).toEqual(`"user_ids" is required`);
        }
    });
    test('string_idsが未入力', () => {
        const params = {
            user_ids: [1,2],
        };
        try {
            main.validator(params);
        } catch (e) {
            expect(e.message).toEqual(`"string_ids" is required`);
        }
    });
});

describe('converter', () => {
    test('正しい入力値', () => {
        const params = {
            string_ids: "1,2,3",
            user_ids: [1,2],
            user_group_name: "",
        };
        const actual = main.converter(params)
        const expected = {
            stringIds: [1,2,3],
            userIds: [1,2],
            userGroupName: "",
        };
        expect(actual).toEqual(expected);
    });
    test('string_idsにカンマが2連続で含まれている', () => {
        const params = {
            string_ids: "1,2,,3",
            user_ids: [1,2],
        };
        try {
            main.converter(params);
        } catch (e) {
            expect(e.message).toEqual(`params must be larger than or equal to 1`);
        }
    });
    test('0以下の整数が含まれている', () => {
        const params = {
            string_ids: "-10,1,2,3",
            user_ids: [1,2],
        };
        try {
            main.converter(params);
        } catch (e) {
            expect(e.message).toEqual(`params must be larger than or equal to 1`);
        }
    });
    test('0以下の整数が含まれている', () => {
        const params = {
            string_ids: "abc,1,2,3",
            user_ids: [1,2],
        };
        try {
            main.converter(params);
        } catch (e) {
            expect(e.message).toEqual(`その他のエラー`);
        }
    });
});