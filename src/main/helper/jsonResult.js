var JsonResult = {};
JsonResult.success = function () {
    var arguCount = arguments.length;
    var res = {
        code: 200
    };
    if (arguCount <= 0) {
        return res;
    } else if (arguCount == 1) {
        let data = arguments[0];
        res.data = data;
        return res;
    } else if (arguCount == 2) {
        let message = arguments[0];
        let data = arguments[1];
        res.message = message;
        res.data = data;
        return res;
    }
    return res;
}

JsonResult.error = function () {
    var arguCount = arguments.length;
    var res = {
        code: 500
    };
    if (arguCount <= 0) {
        return res;
    } else if (arguCount == 1) {
        let message = arguments[0];
        res.message = message;
        return res;
    } else if (arguCount == 2) {
        let code = arguments[0];
        let message = arguments[1];
        res.message = message;
        res.code = code;
        return res;
    }
}

export default JsonResult;