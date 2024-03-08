'use strict';

/**
 * subtask service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::subtask.subtask');
