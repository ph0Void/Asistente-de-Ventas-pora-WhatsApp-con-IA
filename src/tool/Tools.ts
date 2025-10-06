import { ChatCompletionTool } from 'openai/resources/chat/completions';

export const availableTools: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'buscar_producto',
            description: 'Busca un producto en el inventario por nombre',
            parameters: {
                type: 'object',
                properties: {
                    nombre_producto: {
                        type: 'string',
                        description: 'Nombre del producto a buscar (ej: "mouse", "teclado", "monitor")'
                    }
                },
                required: ['nombre_producto']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'ver_catalogo',
            description: 'Muestra todos los productos disponibles en la tienda',
            parameters: {
                type: 'object',
                properties: {}
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'registrar_cliente',
            description: 'Registra un nuevo cliente en el sistema',
            parameters: {
                type: 'object',
                properties: {
                    nombre: {
                        type: 'string',
                        description: 'Nombre completo del cliente'
                    },
                    telefono: {
                        type: 'string',
                        description: 'Número de teléfono del cliente'
                    },
                    dni: {
                        type: 'string',
                        description: 'DNI o documento de identidad del cliente'
                    }
                },
                required: ['nombre', 'telefono', 'dni']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'crear_pedido',
            description: 'Crea un nuevo pedido/factura para un cliente',
            parameters: {
                type: 'object',
                properties: {
                    dni_cliente: {
                        type: 'string',
                        description: 'DNI del cliente'
                    },
                    productos: {
                        type: 'array',
                        description: 'Lista de productos a comprar',
                        items: {
                            type: 'object',
                            properties: {
                                nombre: {
                                    type: 'string',
                                    description: 'Nombre del producto'
                                },
                                cantidad: {
                                    type: 'number',
                                    description: 'Cantidad a comprar'
                                }
                            }
                        }
                    }
                },
                required: ['dni_cliente', 'productos']
            }
        }
    }
];