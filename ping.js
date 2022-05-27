
let statuses = document.querySelectorAll('.status');



(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else { root.ping = factory(); }
}(this, function () {

    function request_image(url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () { resolve(img); };
            img.onerror = function () { reject(url); };
            img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
        });
    }

    function ping(url, multiplier) {
        return new Promise(function (resolve, reject) {
            var start = (new Date()).getTime();
            var response = function () {
                var delta = ((new Date()).getTime() - start);
                delta *= (multiplier || 1);
                resolve(delta);

            };
            request_image(url).then(response).catch(response);
        
            setInterval(function () { reject(Error('Timeout: ' + url)); }, 5000);
        });
    }


    return ping;
}));


for (let status of statuses) {
    function do_ping() {
        let counter = 0;
        ping(status.firstElementChild.name).then(function () {
            status.lastElementChild.classList.remove('red');
            status.lastElementChild.classList.add('green');
            // status.lastElementChild.style.backgroundColor = "green";
        })
            .catch(function (error) {
                console.log(String(error));
                // status.lastElementChild.style.backgroundColor = "red";
                status.lastElementChild.classList.remove('green');
                status.lastElementChild.classList.add('red');
                
            });
    };
    setInterval(do_ping, 5000);
}


