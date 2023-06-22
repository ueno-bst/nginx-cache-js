import request from "~/lib/request";
import loadConfig from "~/lib/helper/loadConfig";

function render(r:NginxHTTPRequest) {
    return request(r, (r) => {
        const config = loadConfig(r.variables.ngc_config ?? '');

        r.headersOut['Content-Type'] = "text/json";

        r.return(200, JSON.stringify(config, null, "    "));
    });
}

export default {render}
