import { MODEL_NAME, openai } from "../config/OpenAIConfig";
import { ICustomer, IInvoice } from "../model/Model";
import { CustomerService } from "../service/CustomerService";
import { InvoiceService } from "../service/InvoiceService";
import { ProductService } from "../service/ProductService";
import { availableTools } from "../tool/Tools";
import { SYSTEM_PROMPT } from "./message/Message";

export class AssistantService {
    private productService: ProductService;
    private customerService: CustomerService;
    private invoiceService: InvoiceService;

    private systemPrompt = SYSTEM_PROMPT;

    constructor() {
        this.productService = new ProductService();
        this.customerService = new CustomerService();
        this.invoiceService = new InvoiceService();
    }
 
   async processMessage(userMessage: string, conversationHistory: any[] = []) {
        try {
            console.log('\n ════════ PROCESANDO MENSAJE ════════');
            console.log('Mensaje del usuario:', userMessage);

            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...conversationHistory,
                { role: 'user', content: userMessage }
            ];

            const response = await openai.chat.completions.create({
                model: MODEL_NAME,
                messages: messages as any,
                tools: availableTools,
                tool_choice: 'auto', 
                temperature: 0.7,
                max_tokens: 500
            });

            const message = response.choices[0].message;

            // Si el modelo quiere usar una función
            if (message.tool_calls && message.tool_calls.length > 0) {
                
                let functionResults: string[] = [];

                for (const toolCall of message.tool_calls) {
                    if (toolCall.type === 'function' && toolCall.function) {
                        const functionName = toolCall.function.name;
                        const functionArgs = JSON.parse(toolCall.function.arguments);

                        const result = await this.executeFunction(functionName, functionArgs);
                        functionResults.push(result);
                    } else {
                        console.warn('Tool call no es de tipo función o no tiene datos de función:', toolCall);
                    }
                }

                const followUpMessages = [
                    ...messages,
                    message,  
                    {
                        role: 'tool' as const,
                        content: functionResults.join('\n'),
                        tool_call_id: message.tool_calls[0].id  
                    }
                ];

                const finalResponse = await openai.chat.completions.create({
                    model: MODEL_NAME,
                    messages: followUpMessages as any,
                    temperature: 0.7,
                    max_tokens: 500
                });

                const finalMessage = finalResponse.choices[0].message.content || 'Lo siento, hubo un error procesando tu solicitud.';
                console.log('✅ Respuesta final:', finalMessage);
                return finalMessage;
            }

            // Si no usa funciones, devolver la respuesta directa
            const directResponse = message.content || 'Lo siento, no pude procesar tu mensaje.';
            console.log('✅ Respuesta directa:', directResponse);
            return directResponse;

        } catch (error) {
            console.error('❌ Error en AssistantService:', error);
            return 'Lo siento, hubo un error procesando tu mensaje. Por favor, intenta de nuevo.';
        }
   }

    /**
     * Ejecuta la función solicitada por el modelo
     */
    private async executeFunction(functionName: string, args: any): Promise<string> {
        try {
            switch (functionName) {
                case 'buscar_producto':
                    return await this.buscarProducto(args.nombre_producto);
                
                case 'ver_catalogo':
                    return await this.verCatalogo();
                
                case 'registrar_cliente':
                    return await this.registrarCliente(args);
                
                case 'crear_pedido':
                    return await this.crearPedido(args);
                
                default:
                    return `Función ${functionName} no implementada`;
            }
        } catch (error) {
            console.error(`Error ejecutando función ${functionName}:`, error);
            return `Error al ejecutar ${functionName}: ${error}`;
        }
    }

    /**
     * Busca un producto por nombre
     */
    private async buscarProducto(nombreProducto: string): Promise<string> {
        console.log(`🔍 Buscando producto: ${nombreProducto}`);
        
        const producto = await this.productService.findByName(nombreProducto);
        
        if (producto) {
            return JSON.stringify({
                encontrado: true,
                producto: {
                    id: producto.id,
                    nombre: producto.name,
                    precio: producto.price,
                    stock: producto.stock
                }
            });
        } else {
            return JSON.stringify({
                encontrado: false,
                mensaje: `No se encontró el producto "${nombreProducto}"`
            });
        }
    }

    /**
     * Obtiene todos los productos del catálogo
     */
    private async verCatalogo(): Promise<string> {
        console.log('📚 Obteniendo catálogo completo');
        
        const productos = await this.productService.getAll();
        
        return JSON.stringify({
            total_productos: productos.length,
            productos: productos.map(p => ({
                id: p.id,
                nombre: p.name,
                precio: p.price,
                stock: p.stock
            }))
        });
    }

    /**
     * Registra un nuevo cliente
     */
    private async registrarCliente(datos: any): Promise<string> {
        console.log('👤 Registrando nuevo cliente:', datos);
        
        const cliente: ICustomer = {
            id: 0,
            name: datos.nombre,
            phone: datos.telefono,
            dni: datos.dni
        };
        
        try {
            await this.customerService.add(cliente);
            return JSON.stringify({
                exito: true,
                mensaje: `Cliente ${datos.nombre} registrado exitosamente`,
                dni: datos.dni
            });
        } catch (error) {
            return JSON.stringify({
                exito: false,
                mensaje: `Error al registrar cliente: ${error}`
            });
        }
    }


    /**
     * Crea un nuevo pedido/factura
     */
    private async crearPedido(datos: any): Promise<string> {
        console.log('🛒 Creando pedido:', datos);
        
        try {
            let total = 0;
            const detallesProductos = [];
            
            for (const item of datos.productos) {
                const producto = await this.productService.findByName(item.nombre);
                if (producto) {
                    const subtotal = Number(producto.price) * item.cantidad;
                    total += subtotal;
                    detallesProductos.push({
                        nombre: producto.name,
                        cantidad: item.cantidad,
                        precio_unitario: producto.price,
                        subtotal: subtotal
                    });
                }
            }
            
            const factura: IInvoice = {
                id: 0,
                customerDni: datos.dni_cliente,
                date: new Date().toISOString(),
                total: total,
                items: JSON.stringify(detallesProductos)
            };
            
            await this.invoiceService.add(factura);
            
            return JSON.stringify({
                exito: true,
                mensaje: 'Pedido creado exitosamente',
                numero_factura: factura.id,
                total: total,
                productos: detallesProductos
            });
            
        } catch (error) {
            return JSON.stringify({
                exito: false,
                mensaje: `Error al crear pedido: ${error}`
            });
        }
    }

}