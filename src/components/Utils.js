export const parseConfig = async () => {
  const response = await fetch("./config.json");
  const json = await response.json();
  const args = parseArgs();

  let runningConfig = {
    initCenter: [-40, 29],
    homeZoom: 3,
    minZoom: 2,
    maxZoom: 16
  }

  if (args.edition) {
    const editionConfig = await lookUpConfig(args.edition);
    runningConfig = { ...runningConfig, ...editionConfig };
  }

  const itemInfo = args.itemid && await getItemInfo(args.itemid);

  if (itemInfo) {
    runningConfig = {
      ...runningConfig,
      ...itemInfo
    };
  }

  if (!runningConfig.serviceURL || !runningConfig.serviceURL.trim().length) {
    runningConfig = { ...runningConfig, ...json }
  }

  const initCenter =
    args.initcenter &&
    args.initcenter.split(",").filter((str) => !isNaN(parseFloat(str)));

  if (initCenter && initCenter.length === 2) {
    runningConfig = { ...runningConfig, initCenter: initCenter };
  }

  const homeZoom = args.homezoom && parseInt(args.homezoom);
  if (homeZoom) {
    runningConfig = { ...runningConfig, homeZoom: homeZoom };
  }

  const maxZoom = args.maxzoom && parseInt(args.maxzoom);
  if (maxZoom) {
    runningConfig = { ...runningConfig, maxZoom: maxZoom };
  }

  const minZoom = args.minzoom && parseInt(args.minzoom);
  if (minZoom) {
    runningConfig = { ...runningConfig, minZoom: minZoom };
  }

  const stacking = args.stacking === "top" ? "top" : "bottom";
  runningConfig = { ...runningConfig, stacking: stacking };

  return runningConfig;

}

const lookUpConfig = async (edition) => {
  const featureLayerRegistryURL = "https://services.arcgis.com/nzS0F0zdNLvs7nc8/arcgis/rest/services/survey123_aedff645769549a5bea20220e2da313f_results/FeatureServer/0"
  const response = await fetch(
    featureLayerRegistryURL + "/query?where=edition='" + edition + "'&outFields=*&returnGeometry=true&f=pjson"
  );
  const json = await response.json();
  let config = null;
  if (json.features.length) {
    const attributes = json.features[0].attributes;
    const itemInfo = await getItemInfo(attributes.item_id);
    const imageURLs = await getImageURLs(featureLayerRegistryURL, [attributes.objectid]);
    config = {
      title: attributes.title,
      description: attributes.subtitle,
      serviceURL: itemInfo.serviceURL,
      homeZoom: parseInt(attributes.home_zoom),
      minZoom: parseInt(attributes.minimum_zoom),
      maxZoom: parseInt(attributes.maximum_zoom),
      initCenter: [json.features[0].geometry.x, json.features[0].geometry.y],
      introImage: imageURLs.length ? imageURLs[0].imageURL : null,
      sortKeys: attributes.sort_keys && attributes.sort_keys.split(",").map((value) => parseInt(value))
    }
  }
  return config;
}

export const fetchFeatures = async (serviceURL) => {{
  const infoJson =  {
    "objectIdFieldName": "objectid",
      "uniqueIdField": {
      "name": "objectid",
        "isSystemMaintained": true
    },
    "globalIdFieldName": "globalid",
      "geometryType": "esriGeometryPoint",
        "spatialReference": {
      "wkid": 4326,
        "latestWkid": 4326
    },
    "fields": [
      {
        "name": "objectid",
        "type": "esriFieldTypeOID",
        "alias": "ObjectID",
        "sqlType": "sqlTypeOther",
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "globalid",
        "type": "esriFieldTypeGlobalID",
        "alias": "GlobalID",
        "sqlType": "sqlTypeOther",
        "length": 38,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "CreationDate",
        "type": "esriFieldTypeDate",
        "alias": "CreationDate",
        "sqlType": "sqlTypeOther",
        "length": 8,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "Creator",
        "type": "esriFieldTypeString",
        "alias": "Creator",
        "sqlType": "sqlTypeOther",
        "length": 128,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "EditDate",
        "type": "esriFieldTypeDate",
        "alias": "EditDate",
        "sqlType": "sqlTypeOther",
        "length": 8,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "Editor",
        "type": "esriFieldTypeString",
        "alias": "Editor",
        "sqlType": "sqlTypeOther",
        "length": 128,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "location_name",
        "type": "esriFieldTypeString",
        "alias": "Location name",
        "sqlType": "sqlTypeOther",
        "length": 255,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "prompt",
        "type": "esriFieldTypeString",
        "alias": "Prompt",
        "sqlType": "sqlTypeOther",
        "length": 1000,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "hint",
        "type": "esriFieldTypeString",
        "alias": "Hint",
        "sqlType": "sqlTypeOther",
        "length": 1000,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "exclamation",
        "type": "esriFieldTypeString",
        "alias": "Exclamation",
        "sqlType": "sqlTypeOther",
        "length": 1000,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "location",
        "type": "esriFieldTypeString",
        "alias": "Location",
        "sqlType": "sqlTypeOther",
        "length": 255,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "image_attribution",
        "type": "esriFieldTypeString",
        "alias": "Image Attribution",
        "sqlType": "sqlTypeOther",
        "length": 255,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "image_license",
        "type": "esriFieldTypeString",
        "alias": "Image license",
        "sqlType": "sqlTypeOther",
        "length": 255,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "image_source_reference_page",
        "type": "esriFieldTypeString",
        "alias": "Image source reference page",
        "sqlType": "sqlTypeOther",
        "length": 255,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "image_license_reference_page",
        "type": "esriFieldTypeString",
        "alias": "Image license reference page",
        "sqlType": "sqlTypeOther",
        "length": 255,
        "domain": null,
        "defaultValue": null
      },
      {
        "name": "zoom_level",
        "type": "esriFieldTypeDouble",
        "alias": "Zoom level",
        "sqlType": "sqlTypeOther",
        "domain": null,
        "defaultValue": null
      }
    ],
      "features": [
        {
          "attributes": {
            "objectid": 1,
            "globalid": "7d198464-043e-471c-88e5-4d905683f894",
            "CreationDate": 1649790668132,
            "Creator": "bock@esri.com_Story",
            "EditDate": 1651611103225,
            "Editor": "bock@esri.com_Story",
            "location_name": "Zócalo",
            "prompt": "This historic city square is the heart of Mexico City, surrounded by important buildings like the Metropolitan Cathedral and the National Palace. Can you find it on the map?",
            "hint": "This is the main square in the historic center of Mexico City.",
            "exclamation": "Zócalo, Mexico City",
            "location": "Zócalo, Mexico City, CDMX",
            "image_attribution": "John Doe",
            "image_license": "CC BY-SA 4.0",
            "image_source_reference_page": "https://commons.wikimedia.org/wiki/File:Zocalo.jpg",
            "image_license_reference_page": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
            "zoom_level": 7
          },
          "geometry": {
            "x": -99.1332,
            "y": 19.4326
          }
        },
        {
          "attributes": {
            "objectid": 2,
            "globalid": "109a5eb0-9059-4e62-8d03-4e7bbcfb2123",
            "CreationDate": 1649790840853,
            "Creator": "bock@esri.com_Story",
            "EditDate": 1649790840853,
            "Editor": "bock@esri.com_Story",
            "location_name": "Chapultepec Castle",
            "prompt": "This castle, located in the middle of a vast park, offers stunning views of Mexico City. It has served as a royal residence, military academy, and presidential home. Can you locate it?",
            "hint": "This castle is located in the largest city park in Mexico.",
            "exclamation": "Chapultepec Castle, Mexico City",
            "location": "Chapultepec Castle, Mexico City, CDMX",
            "image_attribution": "Jane Doe",
            "image_license": "CC BY-SA 4.0",
            "image_source_reference_page": "https://commons.wikimedia.org/wiki/File:Chapultepec_Castle.jpg",
            "image_license_reference_page": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
            "zoom_level": 7
          },
          "geometry": {
            "x": -99.1914,
            "y": 19.4206
          }
        },
        {
          "attributes": {
            "objectid": 3,
            "globalid": "60a797f7-edbc-4dda-8539-f810681cc601",
            "CreationDate": 1649791157233,
            "Creator": "bock@esri.com_Story",
            "EditDate": 1649791157233,
            "Editor": "bock@esri.com_Story",
            "location_name": "Bellas Artes",
            "prompt": "This stunning palace is known for its magnificent architecture and cultural performances. It is one of the most prominent cultural centers in Mexico. Can you find it?",
            "hint": "This building is located in the historical center and is famous for its marble façade and art nouveau style.",
            "exclamation": "Palacio de Bellas Artes, Mexico City",
            "location": "Palacio de Bellas Artes, Mexico City, CDMX",
            "image_attribution": "Richard Roe",
            "image_license": "CC BY-SA 4.0",
            "image_source_reference_page": "https://commons.wikimedia.org/wiki/File:Bellas_Artes.jpg",
            "image_license_reference_page": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
            "zoom_level": 7
          },
          "geometry": {
            "x": -99.1412,
            "y": 19.4352
          }
        },
        {
          "attributes": {
            "objectid": 4,
            "globalid": "f4cea2bc-4030-4066-80e2-0d481fe4749e",
            "CreationDate": 1649791302910,
            "Creator": "bock@esri.com_Story",
            "EditDate": 1649791302910,
            "Editor": "bock@esri.com_Story",
            "location_name": "Frida Kahlo Museum",
            "prompt": "This museum, also known as the Blue House, was the birthplace and home of one of Mexico's most iconic artists, Frida Kahlo. Can you locate this vibrant blue building?",
            "hint": "This house is located in the Coyoacán neighborhood.",
            "exclamation": "Frida Kahlo Museum, Mexico City",
            "location": "Frida Kahlo Museum, Mexico City, CDMX",
            "image_attribution": "Anna Smith",
            "image_license": "CC BY-SA 4.0",
            "image_source_reference_page": "https://commons.wikimedia.org/wiki/File:Frida_Kahlo_Museum.jpg",
            "image_license_reference_page": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
            "zoom_level": 7
          },
          "geometry": {
            "x": -99.1617,
            "y": 19.3555
          }
        },
        {
          "attributes": {
            "objectid": 5,
            "globalid": "f1fcd3a0-1efd-4b0a-8faf-d1218627c7ce",
            "CreationDate": 1649791426973,
            "Creator": "bock@esri.com_Story",
            "EditDate": 1649791426973,
            "Editor": "bock@esri.com_Story",
            "location_name": "Basilica of Our Lady of Guadalupe",
            "prompt": "This basilica is one of the most important pilgrimage sites for Catholics worldwide, dedicated to the Virgin of Guadalupe. Can you find this sacred site?",
            "hint": "This basilica is located at the foot of Tepeyac Hill.",
            "exclamation": "Basilica of Our Lady of Guadalupe, Mexico City",
            "location": "Basilica of Our Lady of Guadalupe, Mexico City, CDMX",
            "image_attribution": "Carlos Hernandez",
            "image_license": "CC BY-SA 4.0",
            "image_source_reference_page": "https://commons.wikimedia.org/wiki/File:Basilica_of_Our_Lady_of_Guadalupe.jpg",
            "image_license_reference_page": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
            "zoom_level": 7
          },
          "geometry": {
            "x": -99.1175,
            "y": 19.4845
          }
        }
      ]
  }

  return infoJson.features;
}}

export const getImageURLs = async (serviceURL, objectIds) => {
  const customImageURLs = {
    1: "https://mexicocity.cdmx.gob.mx/wp-content/uploads/2021/06/Plaza-de-la-Constituci%C3%B3n-y-el-propio-Z%C3%B3calo-capitalino.png",
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQINYHTZJ3ifSctMOwRlu9NB1XyndJB_M950A&s",
    3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuXTIWYSyFoGwWlKdt6EERSKbxOhix1ZZUiw&s",
    4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKbW7CIRb1prauypuun5dSAziAssnyJcSZKg&s",
    5: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bas%C3%ADlica_de_Santa_Mar%C3%ADa_de_Guadalupe_2018.jpg/1200px-Bas%C3%ADlica_de_Santa_Mar%C3%ADa_de_Guadalupe_2018.jpg"
  };

  return objectIds.map((id) => {
    return {
      objectId: id,
      imageURL: customImageURLs[id] || "https://example.com/images/default.jpg"
    };
  });
};


export const getItemInfo = async (itemID) => {
  const SHARING_URL = "https://www.arcgis.com/sharing/";
  const response = await fetch(SHARING_URL + "rest/search?q=" + itemID + "&f=json");
  const json = await response.json();

  const surveyFormItem = json.results.filter(
    (value) => value.type === "Form" && value.access === "public"
  ).shift();

  const featureServiceItem = json.results.filter(
    (value) => value.type === "Feature Service" &&
      value.access === "public" &&
      (value.name.includes("stakeholder") || value.name.includes("results"))
  ).shift();

  return {
    title: (surveyFormItem && surveyFormItem.title) || "Your title here",
    description: (surveyFormItem && surveyFormItem.description) || "You're subtitle here too (once you add your Treasure Hunt to the registry).",
    serviceURL: featureServiceItem.url + "/0"
  };

}

export const parseArgs = () => {

  var parts = decodeURIComponent(document.location.href).split("?");
  var args = {};

  if (parts.length === 2) {
    args = parts[1].split("&").reduce(
      function (accumulator, value) {
        var temp = value.split("=");
        if (temp.length === 2) { accumulator[temp[0].toLowerCase()] = temp[1]; }
        return accumulator;
      },
      args
    );
  }

  return args;

}	  
