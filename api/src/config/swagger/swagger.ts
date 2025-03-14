import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'oz-map API Documentation',
            version: '1.0.0',
            description: 'Full oz-map API documentation',
        },
        servers: [
            { url: 'http://localhost:8000/api/v1' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./src/config/swagger/docs/*.yaml']
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
