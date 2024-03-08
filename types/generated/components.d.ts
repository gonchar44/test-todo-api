import type { Schema, Attribute } from '@strapi/strapi';

export interface SubtodosSubtodos extends Schema.Component {
  collectionName: 'components_subtodos_subtodos';
  info: {
    displayName: 'Subtodos';
    description: '';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 40;
      }>;
    subtitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    notes: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    priority: Attribute.Enumeration<['low', 'medium', 'high']> &
      Attribute.DefaultTo<'low'>;
    is_done: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'subtodos.subtodos': SubtodosSubtodos;
    }
  }
}
