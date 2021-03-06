const AbstractApiGenerator = require('../openapi');
const utils = require('../utils');

function addDefinitionToSchemas (schemas, definition, model, modelName) {
  schemas[model] = definition;
  schemas[`${model}_list`] = {
    title: `${modelName} list`,
    type: 'array',
    items: { $ref: `#/components/schemas/${model}` }
  };
}

function filterParameter (refs) {
  return {
    description: 'Query parameters to filter',
    in: 'query',
    name: 'filter',
    style: 'form',
    explode: true,
    schema: { $ref: `#/components/schemas/${refs.filterParameter}` }
  };
}

function jsonSchemaRef (ref) {
  return {
    'application/json': {
      schema: {
        $ref: `#/components/schemas/${ref}`
      }
    }
  };
}

class OpenApiV3Generator extends AbstractApiGenerator {
  getDefaultSpecs () {
    return {
      paths: {},
      components: {
        schemas: {}
      },
      openapi: '3.0.2',
      tags: [],
      info: {}
    };
  }

  getOperationSpecDefaults () {
    return {
      parameters: [],
      responses: {},
      description: '',
      summary: '',
      tags: [],
      security: []
    };
  }

  getOperationDefaults () {
    return {
      find ({ tags, security, securities, refs }) {
        return {
          tags,
          description: 'Retrieves a list of all resources from the service.',
          parameters: [
            {
              description: 'Number of results to return',
              in: 'query',
              name: '$limit',
              schema: {
                type: 'integer'
              }
            }, {
              description: 'Number of results to skip',
              in: 'query',
              name: '$skip',
              schema: {
                type: 'integer'
              }
            }, {
              description: 'Property to sort results',
              in: 'query',
              name: '$sort',
              style: 'deepObject',
              schema: {
                ...(refs.sortParameter ? { $ref: `#/components/schemas/${refs.sortParameter}` } : { type: 'object' })
              }
            },
            filterParameter(refs)
          ],
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.findResponse)
            },
            401: {
              description: 'not authenticated'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('find', securities, security)
        };
      },
      get ({ tags, modelName, idName, idType, security, securities, refs }) {
        return {
          tags,
          description: 'Retrieves a single resource with the given id from the service.',
          parameters: [{
            description: `ID of ${modelName} to return`,
            in: 'path',
            required: true,
            name: idName,
            schema: {
              type: idType
            }
          }],
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.getResponse)
            },
            401: {
              description: 'not authenticated'
            },
            404: {
              description: 'not found'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('get', securities, security)
        };
      },
      create ({ tags, security, securities, refs }) {
        return {
          tags,
          description: 'Creates a new resource with data.',
          requestBody: {
            required: true,
            content: jsonSchemaRef(refs.createRequest)
          },
          responses: {
            201: {
              description: 'created',
              content: jsonSchemaRef(refs.createResponse)
            },
            401: {
              description: 'not authenticated'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('create', securities, security)
        };
      },
      update ({ tags, modelName, idName, idType, security, securities, refs }) {
        return {
          tags,
          description: 'Updates the resource identified by id using data.',
          parameters: [{
            description: `ID of ${modelName} to update`,
            in: 'path',
            required: true,
            name: idName,
            schema: {
              type: idType
            }
          }],
          requestBody: {
            required: true,
            content: jsonSchemaRef(refs.updateRequest)
          },
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.updateResponse)
            },
            401: {
              description: 'not authenticated'
            },
            404: {
              description: 'not found'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('update', securities, security)
        };
      },
      updateMulti ({ tags, security, securities, refs }) {
        return {
          tags,
          description: 'Updates multiple resources.',
          parameters: [],
          requestBody: {
            required: true,
            content: jsonSchemaRef(refs.updateMultiRequest)
          },
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.updateMultiResponse)
            },
            401: {
              description: 'not authenticated'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('updateMulti', securities, security)
        };
      },
      patch ({ tags, modelName, idName, idType, security, securities, refs }) {
        return {
          tags,
          description: 'Updates the resource identified by id using data.',
          parameters: [{
            description: `ID of ${modelName} to update`,
            in: 'path',
            required: true,
            name: idName,
            schema: {
              type: idType
            }
          }],
          requestBody: {
            required: true,
            content: jsonSchemaRef(refs.patchRequest)
          },
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.patchResponse)
            },
            401: {
              description: 'not authenticated'
            },
            404: {
              description: 'not found'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('patch', securities, security)
        };
      },
      patchMulti ({ tags, security, securities, refs }) {
        return {
          tags,
          description: 'Updates multiple resources queried by given filters.',
          parameters: [filterParameter(refs)],
          requestBody: {
            required: true,
            content: jsonSchemaRef(refs.patchMultiRequest)
          },
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.patchMultiResponse)
            },
            401: {
              description: 'not authenticated'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('patchMulti', securities, security)
        };
      },
      remove ({ tags, modelName, idName, idType, security, securities, refs }) {
        return {
          tags,
          description: 'Removes the resource with id.',
          parameters: [{
            description: `ID of ${modelName} to remove`,
            in: 'path',
            required: true,
            name: idName,
            schema: {
              type: idType
            }
          }],
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.removeResponse)
            },
            401: {
              description: 'not authenticated'
            },
            404: {
              description: 'not found'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('remove', securities, security)
        };
      },
      removeMulti ({ tags, security, securities, refs }) {
        return {
          tags,
          description: 'Removes multiple resources queried by given filters.',
          parameters: [filterParameter(refs)],
          responses: {
            200: {
              description: 'success',
              content: jsonSchemaRef(refs.removeMultiResponse)
            },
            401: {
              description: 'not authenticated'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security('removeMulti', securities, security)
        };
      },
      custom ({ tags, modelName, idName, idType, security, securities, refs }, { method, httpMethod, withId }) {
        const customDoc = {
          tags,
          description: `A custom ${method} method.`,
          parameters: [],
          responses: {
            200: {
              description: 'success'
            },
            401: {
              description: 'not authenticated'
            },
            500: {
              description: 'general error'
            }
          },
          security: utils.security(method, securities, security)
        };

        if (withId) {
          customDoc.parameters[0] = {
            description: `ID of ${modelName}`,
            in: 'path',
            required: true,
            name: idName,
            schema: {
              type: idType
            }
          };
        }

        if (['post', 'put', 'patch'].includes(httpMethod)) {
          const refRequestName = `${method}Request`;
          if (refs[refRequestName]) {
            customDoc.requestBody = {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${refs[refRequestName]}`
                  }
                }
              }
            };
          }
        }

        const refResponseName = `${method}Response`;
        if (refs[refResponseName]) {
          customDoc.responses['200'].content = {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${refs[refResponseName]}`
              }
            }
          };
        }

        return customDoc;
      }
    };
  }

  applyDefinitionsToSpecs (service, model, modelName) {
    if (typeof service.docs.definition !== 'undefined') {
      addDefinitionToSchemas(this.specs.components.schemas, service.docs.definition, model, modelName);
    }
    if (typeof service.docs.schema !== 'undefined') {
      addDefinitionToSchemas(this.specs.components.schemas, service.docs.schema, model, modelName);
    }
    if (typeof service.docs.definitions !== 'undefined') {
      this.specs.components.schemas = Object.assign(this.specs.components.schemas, service.docs.definitions);
    }
    if (typeof service.docs.schemas !== 'undefined') {
      this.specs.components.schemas = Object.assign(this.specs.components.schemas, service.docs.schemas);
    }
    if (typeof this.config.defaults.schemasGenerator === 'function') {
      this.specs.components.schemas = Object.assign(
        this.specs.components.schemas,
        this.config.defaults.schemasGenerator(service, model, modelName, this.specs.components.schemas)
      );
    }
  }

  getPathParameterSpec (name) {
    return {
      in: 'path',
      name,
      schema: {
        type: 'string'
      },
      required: true,
      description: name + ' parameter'
    };
  }
}

module.exports = OpenApiV3Generator;
