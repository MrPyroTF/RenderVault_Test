import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // Credenciales con las que funciona EmailJS
  private serviceId = 'service_xj4fn7q';
  private templateId = 'template_vjf6evd';
  private publicKey = 'lxcAsElzwVw3ve67E';

  constructor() { }

  sendOrderEmail(userEmail: string, cartItems: any[]): Promise<any> {
    // Generar la lista de los productos y sus formatos
    const productsListHTML = cartItems
      .map(item => `• ${item.title} (Formato: ${item.fileType}) - $${item.price.toFixed(2)}`)
      .join('\n');

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    const templateParams = {
      to_email: userEmail,
      cart_details: productsListHTML,
      total_amount: subtotal.toFixed(2)
    };

    return emailjs.send(this.serviceId, this.templateId, templateParams, this.publicKey);
  }
}
