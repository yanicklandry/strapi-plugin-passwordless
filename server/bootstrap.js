'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */
const {getAbsoluteServerUrl} = require('@strapi/utils');

const passworlessActions = {
  actions: [
    {
      // Settings
      section: 'plugins',
      displayName: 'Read',
      uid: 'settings.read',
      subCategory: 'Settings',
      pluginName: 'passwordless',
    },
    {
      // Settings Update
      section: 'plugins',
      displayName: 'Edit',
      uid: 'settings.update',
      subCategory: 'Settings',
      pluginName: 'passwordless',
    },
  ],
};

module.exports = async (
  {
    strapi
  }
) => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'passwordless',
  });
  const settings = await pluginStore.get({key: 'settings'});

  if (!settings) {
    const value = {
      enabled: true,
      createUserIfNotExists: true,
      expire_period: 3600,
      confirmationUrl: getAbsoluteServerUrl(strapi.config),
      from_name: 'Administration Panel',
      from_email: 'no-reply@strapi.io',
      response_email: '',
      token_length: 20,
      stays_valid: false,
      object: 'Passwordless Login',
      message_html: `<p>Hi!</p>
<p>Please click on the link below to login a strapi driven.</p>
<p><%= URL %>?loginToken=<%= CODE %></p>
<p>Thanks.</p>`,
      message_text: `Hi!
Please click on the link below to login on a strapi driven site.
<%= URL %>?loginToken=<%= CODE %>
Thanks.`,
    };

    await pluginStore.set({key: 'settings', value});
  }

  await strapi.admin.services.permission.actionProvider.registerMany(
    [{
      // Settings
      section: 'plugins',
      displayName: 'Read',
      uid: 'settings.read',
      subCategory: 'Settings',
      pluginName: 'passwordless',
    },]
  );
  // await strapi.plugin('users-permissions').service('passwordless').initialize()
};
