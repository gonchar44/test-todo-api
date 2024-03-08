'use strict';

/**
 * task controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task.task', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    if (data) {
      // Flatten each item in the array
      const flatDataArray = data.map(item => {
        const result = {
          id: item.id,
          ...item.attributes,
        }
        if (item.attributes.subtasks) {
          result.subtasks = item.attributes.subtasks?.data.map(inner => ({
            id: inner.id,
            parent_id: item.id,
            ...inner.attributes
          }))
        }

        return result
      });

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

      if (flatData.subtasks) {
        flatData.subtasks = flatData.subtasks?.data.map(item => ({
          id: item.id,
          parent_id: flatData.id,
          ...item.attributes
        }))
      }

      // Return the modified data with the meta information
      return { data: flatData, meta };
    }

    // If no data is found, return the original response
    return originalResponse;
  },

  async create(ctx) {
    // Original create operation
    const response = await super.create(ctx);
    const { data } = response;

    // Check if there's data and optionally if it includes nested relationships like subtasks
    return {
      id: data.id,
      ...data.attributes,
      subtasks: []
    }
  },

  async delete(ctx) {
    const { id } = ctx.params;

    // Find and delete all related subtasks
    const relatedSubtasks = await strapi.entityService.findMany('api::subtask.subtask', {
      filters: { task: id },
    });

    for (const subtask of relatedSubtasks) {
      await strapi.entityService.delete('api::subtask.subtask', subtask.id);
    }

    // Now delete the task itself
    return await super.delete(ctx);
  },

  async update(ctx) {
    // Original update operation
    const response = await super.update(ctx);
    const { data, meta } = response;

    if (data) {
      const flatData = {
        id: data.id,
        ...data.attributes,
      };

      if (flatData.subtasks) {
        flatData.subtasks = flatData.subtasks.data.map(subtask => ({
          id: subtask.id,
          parent_id: flatData.id,
          ...subtask.attributes,
        }));
      }

      return flatData;
    }

    return { data, meta };
  }
}));
