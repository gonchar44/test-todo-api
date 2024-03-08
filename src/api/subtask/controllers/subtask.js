'use strict';

/**
 * subtask controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subtask.subtask', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    if (data) {
      // Flatten each item in the array
      const flatDataArray = data.map(item => ({
        id: item.id,
        ...item.attributes,
      }));

      return { data: flatDataArray, meta };
    }

    return { data, meta };
  },

  async findOne(ctx) {
    // Use the original findOne method to get the data
    const originalResponse = await super.findOne(ctx);
    const { data, meta } = originalResponse;

    if (data) {
      // Create a new object with the id and all attributes on the same level
      const flatData = {
        id: data.id,
        ...data.attributes,
      };

      // Return the modified data with the meta information
      return { data: flatData, meta };
    }

    // If no data is found, return the original response
    return originalResponse;
  },

  async create(ctx) {
    const response = await super.create(ctx);
    const { data } = response;

    const { id, attributes } = data;
    const { task, ...otherAttributes } = attributes;
    const parent_id = task?.data?.id;

    return {
      id,
      ...otherAttributes,
      ...(parent_id && { parent_id })
    };
  },

  async update(ctx) {
    const response = await super.update(ctx);
    const { data, meta } = response;

    const { id, attributes } = data;
    const { task, ...otherAttributes } = attributes;
    const parent_id = task?.data?.id;

    return {
      id,
      ...otherAttributes,
      ...(parent_id && { parent_id })
    };
  }
}));

