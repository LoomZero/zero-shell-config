(async () => {

  const LoomConfig = require('./src/LoomConfig');

  const config = new LoomConfig();



  await config.setup('gitlab', ['token'], async (config, missing) => {

    config.token = await LoomConfig.ask('Gitlab Access Token');

  });

  console.log(config.config, config.private);

})();