(function () {
    window.onload = function () {
        var rootDiv = document.body;
        if (!rootDiv) console.error("can't find the root div");

        let div = document.createElement('div');
        div.className = "webpublish-div";
        let button = document.createElement('button')
        button.className = "ctrl-info"
        button.id = "ctrl-info"
        button.type = "button"
        button.title = "Show this map's info."
        let span = document.createElement('span')
        span.className = "ctrl-image-info"
        button.appendChild(span)
        div.appendChild(button)

        rootDiv.appendChild(div)

        var infoDiv = document.createElement('div')
        infoDiv.className = 'blur infoBox-father'
        var infoboxDiv = document.createElement('div')
        infoboxDiv.id = "infoBox"
        infoDiv.appendChild(infoboxDiv)

        rootDiv.appendChild(infoDiv)

        var html = objectToHtml({ object: mbInfo });
        document.getElementById("infoBox").innerHTML += html;

        button.onclick = function () {
            var box = document.getElementById("infoBox").parentElement;
            if (box.classList.contains('show')) {
                box.classList.remove('show')
            } else {
                box.classList.add('show')
            }
        }
    }

    var defaultValue = function (data, defaultValue) {
        return void 0 !== data && null !== data ? data : defaultValue;
    };

    var objectToHtml = function ({ object, filter, paramKey, isIgnoreNull }) {
        var option = defaultValue(object, {});
        var propertieFilter = defaultValue(filter, []);
        var param = defaultValue(paramKey, {});
        isIgnoreNull = defaultValue(isIgnoreNull, false);
        // var resultHtml = '<ul id="Ts-info-attr">';
        var resultHtml = convert(option, propertieFilter, param, undefined, isIgnoreNull);
        // resultHtml += `</ul>`;
        return resultHtml;
    }

    function convert(val, filter, paramKey, key, isIgnoreNull) {
        if (filter.indexOf(key) != -1) return "";
        var html = "";
        if (!val && isIgnoreNull) return "";
        if (val instanceof Array) {
            html += convertArray(val, filter, paramKey, key, isIgnoreNull);
        } else if (val instanceof Object) {
            html += convertObject(val, filter, paramKey, key, isIgnoreNull);
        } else {
            if (key) {
                var itemName, value;
                if (paramKey[key]) {
                    if (paramKey[key] instanceof Object) {
                        itemName = paramKey[key].key;
                        value = paramKey[key].value[val] ? paramKey[key].value[val] : val;
                    } else {
                        itemName = paramKey[key];
                        value = val;
                    }
                } else {
                    itemName = key;
                    value = val
                }

                html += `
                    <li>
                        <span>${itemName}</span>
                        <span>${value}</span>
                    </li>`;
            } else {
                html += `
                    <li style='text-align: center;'>
                        <span style='width: 100%;'>${val}</span>
                    </li>`;
            }
        }
        return html;
    }

    function convertArray(array, filter, paramKey, key, isIgnoreNull) {
        if (filter.indexOf(key) != -1) return "";
        var html = ``;
        if (key) {
            var itemName;
            if (paramKey[key]) {
                if (paramKey[key] instanceof Object) {
                    itemName = paramKey[key].key;
                } else {
                    itemName = paramKey[key];
                }
            } else {
                itemName = key;
            }
            html += `
            <ul style='text-align: center;'>
                <span style="font-size: 17px;">${itemName}</span>`;
        }
        for (let i = 0, size = array.length; i < size; i++) {
            const data = array[i];
            // html += `<ul>`
            html += convert(data, filter, paramKey, undefined, isIgnoreNull)
            // html += `</ul>`
        }
        if (key)
            html += `</ul>`
        return html
    }

    function convertObject(object, filter, paramKey, key, isIgnoreNull) {
        if (filter.indexOf(key) != -1) return "";
        var html = "";
        if (key) {
            var itemName;
            if (paramKey[key]) {
                if (paramKey[key] instanceof Object) {
                    itemName = paramKey[key].key;
                } else {
                    itemName = paramKey[key];
                }
            } else {
                itemName = key;
            }
            html += `
            <ul style='text-align: center;'>
                <span style="font-size: 17px;">${itemName}</span>`;
        }
        html += `<ul>`
        for (item in object) {
            html += convert(object[item], filter, paramKey, item, isIgnoreNull);
        }
        html += `</ul>`
        if (key)
            html += `</ul>`

        return html;
    }
})();