const { C_TYPE_NEW_ISV } = require('./constants.js');

const isJSONStringifyLegal = v => {
  try {
    JSON.stringify(v);
    return true;
  } catch (e) {
    return false;
  }
};

function transformSchemaValue(value) {
    if (!value) return '';
    const keysOfValue = Object.keys(value);
    if (!Array.isArray(keysOfValue)) return '';
    let res = [];
    keysOfValue.forEach(key => {
        const v = value[key] ? JSON.parse(value[key]) : null;
        const { type, value: scheme_value, fe_cfg } = v || {};
        let realValue = scheme_value;
        if (Array.isArray(scheme_value) && type === C_TYPE_NEW_ISV.listContainer.value) {
            realValue = scheme_value.map(i => {
                if (i && i.type === C_TYPE_NEW_ISV.objectContainer.value && i.value) {
                    const res = {
                        c_type: i.type,
                        name: i.name,
                        reject_info: null,
                        scheme_value: {},
                        ...(i?.fe_cfg && { fe_cfg: i.fe_cfg })
                    };
                    Object.keys(i.value).forEach(j => {
                        const vForObj = i.value[j];
                        res.scheme_value[j] = {
                            c_type: vForObj?.type,
                            scheme_value: vForObj?.value ? JSON.stringify(vForObj.value) : '',
                            name: j,
                            reject_info: null,
                            ...(vForObj?.fe_cfg && { fe_cfg: vForObj.fe_cfg })
                        };
                    });
                    res.scheme_value = JSON.stringify(res.scheme_value);
                    return res;
                }
                return {
                    c_type: i?.type,
                    name: i?.name,
                    reject_info: null,
                    scheme_value: i?.value ? JSON.stringify(i.value) : '',
                    ...(i?.fe_cfg && { fe_cfg: i.fe_cfg })
                };
            });
        }
        if (type === C_TYPE_NEW_ISV.objectContainer.value) {
            const res = {};
            Object.keys(scheme_value).forEach(j => {
                const vForObj = scheme_value[j];
                res[j] = {
                    c_type: vForObj?.type,
                    scheme_value: vForObj?.value ? JSON.stringify(vForObj.value) : '',
                    name: j,
                    reject_info: null,
                    ...(vForObj?.fe_cfg && { fe_cfg: vForObj.fe_cfg })
                };
            });
            realValue = res;
        }
        res.push({
            c_type: type,
            scheme_value: isJSONStringifyLegal(realValue) ? JSON.stringify(realValue) : '',
            name: key,
            reject_info: null,
            ...(fe_cfg && { fe_cfg })
        });
    });
    return res;
}
;
module.exports = function finalData(value) {
    if (!value)
        return '';
    const keysOfValue = Object.keys(value);
    if (!Array.isArray(keysOfValue))
        return '';
    let res = [];
    value.forEach(key => {
        const item = {
            ...(key?.materialId && {materialId: key.materialId}),
            componentId: key.component_id,
            componentVersion: key.version,
        };
        const componentValue = transformSchemaValue(key.data.value);
        item.value = JSON.stringify(componentValue);
        res.push(item);
    });
    return JSON.stringify(res);
};