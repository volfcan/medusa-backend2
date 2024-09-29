const Medusa = require("@medusajs/medusa-js");

const medusa = new Medusa({
  baseUrl: "https://sa-medusav2.0fskhj.easypanel.host/app", // replace with your Medusa instance's URL
  credentials: "pk_01J5X580TZF2X4CEPK6D0M24QV", // replace with your admin API key
});

medusa.admin.publishableApiKeys
  .create({
    title: "Web API Key",
  })
  .then(({ publishable_api_key }) => {
    console.log(publishable_api_key.id);
  })
  .catch((error) => {
    console.error(error);
  });
